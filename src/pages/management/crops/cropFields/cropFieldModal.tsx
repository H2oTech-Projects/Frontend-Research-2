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
import { useGetCustomerFieldDetailByWAP, useGetCustomerFieldListByWAP, useGetCustomerFieldMapByWAP, usePutCustomerField } from "@/services/customerField";
import { GET_ALL_CUSTOMER_FIELD, POST_CUSTOMER_FIELD } from "@/services/customerField/constants";
import { FormInput } from "@/components/FormComponent/FormInput";
import { showErrorToast } from "@/utils/tools";

type CustomerFieldModalProps = {
  customerId: string;
  customerfields: [];
  wap_id: string;
  isConflictFields: boolean;
  setOpen: (value: boolean) => void;
  refetchMap: () => void;
  refetch: () => void;
  setId: (value: string) => void;
  setConflictFields: (value:[]) => void;
  setProcessConflictFields: (value: boolean) => void;
  customerName: string;
}



const formSchema = z.object({
  customers: z.array(
    z.object({
      fieldName: z.string().optional(),
      customerName: z.string().optional(),
      fieldId: z.coerce.number().optional(),
      customerId: z.coerce.number().optional(),
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
const info = "One or more of the fields you have linked to customer are already shared with another customer. Use Farmed % below to set how the fields are shared. Enter shared field details below for ";
const CustomerFieldModal = ({customerId, wap_id, customerfields, setOpen, isConflictFields,setProcessConflictFields, refetchMap, refetch, setId, setConflictFields, customerName}: CustomerFieldModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateCustomerField, isPending: isCustomerFieldUpdating } = usePutCustomerField();
  debugger
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customers: customerfields
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customers"
  })

  useEffect(() => {
    if (!!customerfields && customerfields.length >0) {
      form.setValue("customers", customerfields)
    }
  }, [customerfields])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;
      let fieldCustomerIndex = Number(name?.split('.')[1])
      if (!fieldCustomerIndex) return;
      let editedFieldId = form.getValues(`customers.${fieldCustomerIndex}.fieldId`)
      let editedCustomerId = form.getValues(`customers.${fieldCustomerIndex}.customerId`)
      let editedPctFarmed = form.getValues(`customers.${fieldCustomerIndex}.pctFarmed`) || 0

      let requiredCustomers = form.getValues('customers').filter((fieldCustomer) => fieldCustomer.fieldId?.toString() == editedFieldId?.toString() && fieldCustomer.customerId?.toString() != editedCustomerId?.toString())
      let poportionSum = requiredCustomers.reduce((accumulator, currentValue: any) => accumulator + currentValue['pctFarmed'], 0);

      let renewCustomers = form.getValues('customers')
        .map((customer: any) =>
            {
              if (customer.fieldId != editedFieldId) return customer
              if (customer.customerId == editedCustomerId) return customer
              customer['pctFarmed'] = roundTo((customer['pctFarmed']/poportionSum)*(100-editedPctFarmed),2)
              return customer
            }
        )
      debugger
      setTimeout(() => {
        form.setValue('customers', renewCustomers)
      }, 1000);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: FormValues) => {
    const formData ={wapId:wap_id, customerId: customerId, data: data}
          updateCustomerField(formData, {
          onSuccess: (data: any) => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] })
            queryClient.invalidateQueries({ queryKey: [GET_ALL_CUSTOMER_FIELD] });
            refetchMap();
            refetch();
            toast.success(data?.message);
            setId("");
            setConflictFields([]);
            setProcessConflictFields(false);
          },
          onError: (error) => {
            showErrorToast(error?.response?.data?.message || "Failed to create Link");
            queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] });
            setConflictFields([]);
            setProcessConflictFields(false);
          },
        });
  }
  console.log(customerId)
  let title = isConflictFields ? `Enter shared field details below for ${customerName}` : 'Edit Link Customer and Field'
  let italicInfo = isConflictFields ? `${info} ${customerName}` : ""
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
          <div className="w-[200px]" >Customer Name</div>
          <div>Farmed Percentage(%) </div>
        </div>
        <div className="h-[90%] overflow-y-auto p-2">

          {fields && fields?.map((field, index) => {
            let hide = field.hidden ? 'hidden ' : ''
            let grayOut = field?.customerId?.toString()!= customerId.toString() ? 'bg-[#e3e3ec] rounded-md' : ''
            return <div className={`mb-3 flex gap-2 ${hide} ${grayOut}`} key={field?.id} >
              <div className="w-[100px]">{field?.fieldName}</div>
              <div className="w-[200px]" >{field?.customerName}</div>
              <div>
                <FormInput
                  control={form.control}
                  label="Percentage Farm"
                  name={`customers.${index}.pctFarmed`}
                  type="number"
                  placeholder="Enter Percentage"
                  showLabel={false}
                  disabled={field?.customerId?.toString()!= customerId.toString()}
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

export default CustomerFieldModal;