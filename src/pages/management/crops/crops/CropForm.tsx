import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { FormInput } from '@/components/FormComponent/FormInput'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import { useEffect } from 'react'
import { FormTextbox } from '@/components/FormComponent/FormTextbox'
import { cn } from '@/lib/utils'
//import MapPreview from '@/components/MapPreview'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { useGetCropById, useGetCropGroupNameDropdown, usePostCrops, usePutCrops } from '@/services/crops'
import { GET_CROPS_LIST, POST_CROPS, PUT_CROPS } from '@/services/crops/constants'
import { FormFieldsWrapper, FormMapWrapper, FormPageHeader, FormPageWrapper, FormWrapper } from '@/components/wrappers/formWrappers'
// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  cropCode: z.string().optional(),
  cropName: z.string().optional(),
  cropDesc: z.string().optional(),
  cropAbbrev: z.string().optional(),
  cropAppDepthM: z.coerce.number(),
  cropGroupId: z.coerce.number().optional()
});

type FormValues = z.infer<typeof formSchema>;
const FieldForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: CropGroupNameOptions } = useGetCropGroupNameDropdown();
  const { data: fieldDetailData, isLoading: isFieldDetailLoading } = useGetCropById(id!)
  const { mutate: createCrop, isPending: creatingCrop } = usePostCrops();
  const { mutate: updateCrops, isPending: updatingCrop } = usePutCrops();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropCode: "",
      cropName: "",
      cropDesc: "",
      cropAbbrev: "",
      cropAppDepthM: undefined,
      cropGroupId: undefined,
    },
  });

  useEffect(() => {
    if (fieldDetailData) {
      form.reset({ ...fieldDetailData?.data[0] })
    }
  }, [fieldDetailData]);

  const onSubmit = (data: FormValues) => {
    const formData = convertKeysToSnakeCase(data)
    if (!id) {
      createCrop(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_CROPS_LIST] })
          queryClient.invalidateQueries({ queryKey: [POST_CROPS] });
          toast.success(data?.message);
          navigate("/crops");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create Crop");
          queryClient.invalidateQueries({ queryKey: [POST_CROPS] });
        },
      });
    } else {
      updateCrops({ cropId: id, formData: formData }, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_CROPS_LIST] })
          queryClient.invalidateQueries({ queryKey: [PUT_CROPS] });
          toast.success(data?.message);
          navigate("/crops");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to update Crop");
          queryClient.invalidateQueries({ queryKey: [PUT_CROPS] });
        },
      });
    }

  };
  const disableEdit = location.pathname.includes("view")
  return (
    <FormPageWrapper>
      <FormPageHeader>
        <PageHeader
          pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Crop`}
          breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Crops", menuPath: "/crops" }]}
        />
        {!disableEdit && <Button className='w-24 mt-4' form="cropForm" disabled={creatingCrop || updatingCrop} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
      </FormPageHeader>
      <FormWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="cropForm" className=' h-auto'>
            <FormFieldsWrapper>
              <FormInput control={form.control} name='cropCode' label='Crop Code' placeholder='Crop Code' type='text' disabled={disableEdit} />
              <FormInput control={form.control} name='cropName' label='Crop Name' placeholder='Enter Crop Name' type='text' disabled={disableEdit} />
              <FormInput control={form.control} name='cropAbbrev' label={" Crop Abbreviation"} placeholder='Enter Crop Abbreviation' type='text' disabled={disableEdit} />
              <FormInput control={form.control} name='cropAppDepthM' label={"Crop App Depth"} placeholder='Crop App Depth' type='number' disabled={disableEdit} />
              <FormComboBox control={form.control} name='cropGroupId' label='Select Crop Group Name' options={CropGroupNameOptions?.data} disabled={disableEdit} />
              <FormTextbox control={form.control} name='cropDesc' label='Crop Description' placeholder='Enter Crop Description' disabled={disableEdit} />
            </FormFieldsWrapper>
          </form>
        </Form>
      </FormWrapper>

    </FormPageWrapper>
  );
}

export default FieldForm;