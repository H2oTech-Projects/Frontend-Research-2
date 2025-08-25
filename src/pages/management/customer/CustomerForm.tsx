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
import { FormRadioGroup } from '@/components/FormComponent/FormRadio'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetWaps } from '@/services/timeSeries'
import { usePostFieldByWAP, usePutFieldByWAP } from '@/services/water/field'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { GET_FIELD_DETAIL_KEY_BY_WAP, GET_FIELD_LIST_KEY_BY_WAP, GET_FIELD_MAP_KEY, POST_FIELD_KEY_BY_WAP, PUT_FIELD_KEY_BY_WAP } from '@/services/water/field/constant'
import { showErrorToast } from '@/utils/tools'
import { useGetCustomerDetail, usePostCustomer, usePutCustomer } from '@/services/customers'
import { GET_CUSTOMER_LIST_KEY, POST_CUSTOMER_KEY, PUT_CUSTOMER } from '@/services/customers/constants'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  name: z.string().min(1, { message: "Customer Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email("Invalid email address"),
  phone: z.string().min(1, { message: "Phone is required" }),
  active: z.string().optional(),
  comments: z.string().optional()

});

type FormValues = z.infer<typeof formSchema>;
const FieldForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const { data: fieldDetailData, isLoading: isFieldDetailLoading } = useGetCustomerDetail(id!)
  const { mutate: createCustomer, isPending: creatingCustomer } = usePostCustomer();
  const { mutate: updateCustomer, isPending: updatingCustomer } = usePutCustomer();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      active: "True",
      comments: ""
    },
  });

  useEffect(() => {
    if (fieldDetailData && id) {
      form.reset({ ...fieldDetailData?.data[0], active: fieldDetailData?.data[0]?.active ? "True" : "False" });
    }

  }, [fieldDetailData])

  const onSubmit = (data: FormValues) => {

    if (!id) {
      const formData = convertKeysToSnakeCase({ ...data, active: data?.active === "True" ? true : false })
      createCustomer(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_CUSTOMER_LIST_KEY] })
          queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_KEY] });
          toast.success(data?.message);
          navigate("/customers");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create Customer");
          queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_KEY] });
        },
      });
    } else {
      const formData = convertKeysToSnakeCase({ ...data, customerId: id, active: data?.active === "True" ? true : false})
      updateCustomer(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_CUSTOMER_LIST_KEY] })
          queryClient.invalidateQueries({ queryKey: [PUT_CUSTOMER] });
          toast.success(data?.message);
          navigate("/customers");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to Update Customer");
          queryClient.invalidateQueries({ queryKey: [PUT_CUSTOMER] });
        },
      });
    }

  };


  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Customer`}
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Customers", menuPath: "/customers" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>
          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>
            <FormInput control={form.control} name='name' label='Customer Name' placeholder='Enter Customer Name' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='email' label='Customer Email' placeholder='Enter Customer Email' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='phone' label='Customer Phone No.' placeholder='Enter Customer Phone No.' type='text' disabled={location.pathname.includes("view")} />
            <FormTextbox control={form.control} name='comments' label='Comments' placeholder='Enter Comments' disabled={location.pathname.includes("view")} />
            <FormRadioGroup control={form.control} name='active' label='Active status' options={[{ label: "Yes", value: "True" }, { label: "No", value: "False" }]} disabled={location.pathname.includes("view")} />
          </div>


          {/* <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/> */}
          {!location.pathname.includes("view") && <Button className='w-24 mt-4' disabled={creatingCustomer || updatingCustomer} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
        </form>
      </Form>
    </div>
  );
}

export default FieldForm;