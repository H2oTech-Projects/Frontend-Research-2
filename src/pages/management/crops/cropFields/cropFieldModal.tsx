import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Form
} from "@/components/ui/form"

import CustomModal from "@/components/modal/ConfirmModal";
import { FormInput } from "@/components/FormComponent/FormInput";
import { showErrorToast } from "@/utils/tools";
import { usePutCropField } from "@/services/crops";
import { GET_ALL_CROP_FIELDS_LIST } from "@/services/crops/constants";

type CropFieldModalProps = {
  cropId: string;
  cropfields: [];
  wap_id: string;
  isConflictFields: boolean;
  setOpen: (value: boolean) => void;
  refetchMap: () => void;
  refetch: () => void;
  setId: (value: string) => void;
  setConflictFields: (value:[]) => void;
  setProcessConflictFields: (value: boolean) => void;
  cropName: string;
}



const formSchema = z.object({
  crops: z.array(
    z.object({
      fieldName: z.string().optional(),
      cropName: z.string().optional(),
      fieldId: z.string().optional(),
      cropId: z.coerce.number().optional(),
      pctFarmed: z.coerce.number().optional(), // optional range check
      hidden: z.coerce.boolean().optional(),
    })
    ),
    comment: z.string().optional(),
  });
type FormValues = z.infer<typeof formSchema>;

function roundTo(value: number, decimals: number) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
const info = "One or more of the fields you have linked to crop are already shared with another crop. Use Farmed % below to set how the fields are shared. Enter shared field details below for ";
const CropFieldModal = ({cropId, wap_id, cropfields, setOpen, isConflictFields,setProcessConflictFields, refetchMap, refetch, setId, setConflictFields, cropName}: CropFieldModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateCropField, isPending: isCropFieldUpdating } = usePutCropField();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crops: cropfields
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "crops"
  })

  useEffect(() => {
    if (!!cropfields && cropfields.length >0) {
      form.setValue("crops", cropfields)
    }
  }, [cropfields])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;
      let fieldCropIndex = Number(name?.split('.')[1])
      if (!fieldCropIndex) return;
      let editedFieldId = form.getValues(`crops.${fieldCropIndex}.fieldId`)
      let editedCropId = form.getValues(`crops.${fieldCropIndex}.cropId`)
      let editedPctFarmed = form.getValues(`crops.${fieldCropIndex}.pctFarmed`) || 0

      let requiredCrops = form.getValues('crops').filter((fieldCrop) => fieldCrop.fieldId?.toString() == editedFieldId?.toString() && fieldCrop.cropId?.toString() != editedCropId?.toString())
      let poportionSum = requiredCrops.reduce((accumulator, currentValue: any) => accumulator + currentValue['pctFarmed'], 0);

      let renewCrops = form.getValues('crops')
        .map((crop: any) =>
            {
              if (crop.fieldId != editedFieldId) return crop
              if (crop.cropId == editedCropId) return crop
              crop['pctFarmed'] = roundTo((crop['pctFarmed']/poportionSum)*(100-editedPctFarmed),2)
              return crop
            }
        )

      setTimeout(() => {
        form.setValue('crops', renewCrops)
      }, 1000);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: FormValues) => {
    console.log("called")
    const formData ={wapId:wap_id, cropId: cropId, data: data}
          updateCropField(formData, {
          onSuccess: (data: any) => {
            setOpen(false);
            // queryClient.invalidateQueries({ queryKey: [POST_CROP_FIELD] })
            queryClient.invalidateQueries({ queryKey: [GET_ALL_CROP_FIELDS_LIST] });
            refetchMap();
            refetch();
            toast.success(data?.message);
            setId("");
            setConflictFields([]);
            setProcessConflictFields(false);
          },
          onError: (error) => {
            showErrorToast(error?.response?.data?.message || "Failed to create Link");
            queryClient.invalidateQueries({ queryKey: [GET_ALL_CROP_FIELDS_LIST] });
            setConflictFields([]);
            setProcessConflictFields(false);
          },
        });
  }
  // console.log(customerId)
  let title = isConflictFields ? `Enter shared field details below for ${cropName}` : 'Edit Link Crop and Field'
  let italicInfo = isConflictFields ? `${info} ${cropName}` : ""
  return <CustomModal
    isOpen={true}
    onClose={() => {
      setOpen(false)
    }}
    title={`${title}`}
    description={italicInfo}
    confirmText="Link"
    isDeleteModal={false}
    showActionButton={false}
    titleStyle="w-[570px] italic"
  >
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (error) => { console.log(error, "error") })} className="h-[30rem] w-auto flex flex-col gap-2 " >

        <div className="mb-3 flex gap-2" >
          <div className="w-[100px]">Field Name</div>
          <div className="w-[200px]" >Crop Name</div>
          <div>Farmed Percentage(%) </div>
        </div>
        <div className="h-[90%] overflow-y-auto p-2">

          {fields && fields?.map((field, index) => {
            let hide = field.hidden ? 'hidden ' : ''
            let grayOut = field?.cropId?.toString()!= cropId.toString() ? 'bg-[#e3e3ec] rounded-md' : ''
            return <div className={`mb-3 flex gap-2 ${hide} ${grayOut}`} key={field?.id} >
              <div className="w-[100px]">{field?.fieldName}</div>
              <div className="w-[200px]" >{field?.cropName}</div>
              <div>
                <FormInput
                  control={form.control}
                  label="Percentage Farm"
                  name={`crops.${index}.pctFarmed`}
                  type="number"
                  placeholder="Enter Percentage"
                  showLabel={false}
                  disabled={field?.cropId?.toString()!= cropId.toString()}
                />
              </div>
            </div>
          })}
        </div>
        <div className="flex gap-2  items-center justify-end">
          <Button type="submit">Update</Button> <Button type="button" onClick={() => setOpen(false)} >Cancel</Button>
        </div>
      </form>
    </Form>
  </CustomModal>
}

export default CropFieldModal;