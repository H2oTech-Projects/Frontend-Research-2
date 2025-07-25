import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { FormInput } from '@/components/FormComponent/FormInput'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import { useEffect, useRef, useState } from 'react'
import { FormTextbox } from '@/components/FormComponent/FormTextbox'
import { FormRadioGroup } from '@/components/FormComponent/FormRadio'
import { cn } from '@/lib/utils'
import MapPreview from '@/components/MapPreview'
import { usePostMapPreview } from '@/services/mapPreview'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetWaps } from '@/services/timeSeries'
import { showErrorToast } from '@/utils/tools'
import { useGetCustomerFieldDetailByWAP, useGetCustomerList, useGetFieldList, usePostCustomerField } from '@/services/customerField'
import { FormMultiComboBox } from '@/components/FormComponent/FormMultiSelect'
import { GET_ALL_CUSTOMER_FIELD, POST_CUSTOMER_FIELD } from '@/services/customerField/constants'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  wapId: z.number(),
  fieldId: z.number(),
  customerIds: z.array(z.number()),
  customers: z.array(
    z.object({
      customerId: z.number(),
      pctFarmed: z.coerce.number().min(0).max(100), // optional range check
    })
  ),
  comment: z.string(),
});


type FormValues = z.infer<typeof formSchema>;
const CustomerFieldForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, wapId } = useParams();
  const clientId = JSON.parse(localStorage.getItem("auth") as string)?.client_id
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [wayId, setWayId] = useState<number | undefined>(undefined)
  const { data: wapsOptions, isLoading: wapsOptionsLoading } = useGetWaps();
  const { data: customerOptions, isLoading: customerOptionsLoading } = useGetCustomerList();
  const { data: fieldOptions, isLoading: fieldOptionsLoading } = useGetFieldList(wayId);
  const {data:fieldCustomerData,isLoading:isFieldCustomerDataLoading} = useGetCustomerFieldDetailByWAP(wapId!,id!)
  const {mutate:createCustomerField,isPending:isCustomerFieldCreating} = usePostCustomerField();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wapId:Number(wapId),
      fieldId: undefined,
      customerIds: [],
      customers: [],
      comment: ""
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customers"
  })



  useEffect(() => {
    if (!id && wapsOptions?.data) {
        console.log("hererererere")
      form.setValue("wapId", wapsOptions?.data[0].value);
      setWayId(wapsOptions?.data[0].value)
    }
    // else {
    //   form.setValue("wapId", Number(wapId));
    //   setWayId(Number(wapId))
    // }

  }, [wapsOptions])



  useEffect(() => {
    setWayId(form.getValues("wapId"))
  }, [form.watch("wapId")])

  useEffect(() => {
    const listOfCustomerId = form.getValues("customerIds")
    const percentage = 100 / listOfCustomerId.length
    if (listOfCustomerId.length > 0) {
      const listOfCustomer = listOfCustomerId.map((item) => {
        return {
          customerId: Number(item), pctFarmed: Number(percentage.toFixed(2))
        }

      })
      remove();
      form.setValue("customers", listOfCustomer)

    }

  }, [form.watch("customerIds")])



  const onSubmit = (data: FormValues) => {
            createCustomerField(data, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] })
          queryClient.invalidateQueries({ queryKey: [GET_ALL_CUSTOMER_FIELD] });
          // queryClient.invalidateQueries({ queryKey: [POST_FIELD_KEY_BY_WAP] });
          // queryClient.invalidateQueries({ queryKey: [GET_FIELD_MAP_KEY] });
          toast.success(data?.message);
          navigate("/customer-field", {
            state: {
              wapId: data?.wapId
            }
          });
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create Link");
          queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] });
        },
      });

  };

  useEffect(()=>{
    if(fieldCustomerData?.success){
      const customerList = fieldCustomerData?.data?.customers?.map((item:any)=> item?.customerId);
      form.reset({...fieldCustomerData?.data,customerIds : customerList,wapId:Number(wapId) })
}
},[fieldCustomerData])


  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Customer-Field`}
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Customer Field", menuPath: "/customer-field" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>
          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-2' : 'grid-cols-1')}>
            <FormComboBox control={form.control} name='wapId' label='Water Accounting Periods' options={wapsOptions?.data} disabled={id ? true : false} />
            <FormComboBox control={form.control} name='fieldId' label='Fields' options={fieldOptions?.data}  />
            <FormMultiComboBox control={form.control} name='customerIds' label='Customer' options={customerOptions?.data} />
            <FormTextbox control={form.control} name='comment' label='comment' placeholder='Enter comment' disabled={location.pathname.includes("view")} />
          </div>
          {/* <MapPreview data={previewMapData} isLoading={mapLoading} /> */}
        {  fields?.length > 0 && <div className='text-lg text-royalBlue dark:text-slate-50 '>Percentage Farm By customers</div>}
          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>
            {
              fields?.length > 0 &&
              fields.map((item, index) => {
                return <div key={item.id}>
                  <FormInput name={`customers.${index}.pctFarmed`} control={form.control} label={customerOptions?.data?.filter((item2: any) => item2?.value === item?.customerId)[0]?.label} type='number' placeholder='Enter Percentage' />
                </div>
              })
            }
          </div>
          {/* <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/> */}
          {!location.pathname.includes("view") && <Button className='w-24 mt-4' type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
        </form>
      </Form>
    </div>
  );
}

export default CustomerFieldForm;