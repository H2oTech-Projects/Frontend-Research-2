import React, { useEffect, useRef, useState } from 'react'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/FormComponent/FormInput';
import { Form } from '@/components/ui/form';
import FormCoordinatesMap from '@/components/FormComponent/FormCoordinatesMap';
import { FeatureGroup as LeafletFeatureGroup  } from 'leaflet';
import { useGetClientDetails, usePostClient, usePutClient } from '@/services/client';
import { useQueryClient } from '@tanstack/react-query';
import { GET_CLIENT_LIST_KEY, POST_CLIENT_KEY, PUT_CLIENT_KEY } from '@/services/client/constant';
import { toast } from 'react-toastify';
import { FormDatePicker } from '@/components/FormComponent/FormDatePicker';
import dayjs from "dayjs"; 
import { showErrorToast } from '@/utils/tools';

const clientSchema = z.object({
  client_id: z.string().optional(),
  client_ha: z.coerce.number().optional(),
  client_country: z.string().optional(),
  client_admin_area: z.string().optional(),
  client_subadmin_area: z.string().optional(),
  client_locality: z.string().optional(),
  client_postal_code: z.string().optional(),
  client_po_box: z.string().optional(),
  client_street: z.string().optional(),
  client_premise: z.string().optional(),
  client_subpremise: z.string().optional(),
  client_email: z.string().email().optional(),
  client_established: z.coerce.date().optional(),
  client_fax: z.string().optional(),
  client_phone: z.string().optional(),
  client_website: z.string().url().optional(),
  client_geom: z.array(z.array(
    z.tuple([
      z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    ])
  )).min(1, "At least  coordinate is required"),
  client_name: z.string().optional(),

})
export type ClientFormType = z.infer<typeof clientSchema>;
const initialValues: ClientFormType = {
      client_id:undefined,
      client_ha: undefined,
      client_country: "",
      client_admin_area: "",
      client_subadmin_area: "",
      client_locality: "",
      client_postal_code: "",
      client_po_box: "",
      client_street: "",
      client_premise: "",
      client_subpremise: "",
      client_email: "",
      client_established: undefined,
      client_fax: "",
      client_phone: "",
      client_website: "",
      client_geom: [],
      client_name: "",
    }
const ClientForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [clientFormData, setClientFormData] = useState<ClientFormType>(initialValues);
  const{data:clientDetail,isLoading} = useGetClientDetails(id ? id : null);
  // 
  const featureGroupPolygonRef = useRef<LeafletFeatureGroup>(null);
  const {mutate:createClient, isPending:isClientCreating} = usePostClient()
  const {mutate:editClient, isPending:isClientUpdating} = usePutClient()
  const form = useForm<ClientFormType>({
    resolver: zodResolver(clientSchema),
    defaultValues: id ? clientFormData : initialValues,
  });

  const handleCreateClient =(data:ClientFormType) =>{
      const FormValue = {...data,client_geom:{
      type:"MultiPolygon",
      coordinates:[data.client_geom],},
      client_established: dayjs(data.client_established).format("YYYY-MM-DD")
  }
      createClient(FormValue, {
      onSuccess: (data) => {
      // Invalidate and refetch
        queryClient.invalidateQueries({queryKey: [GET_CLIENT_LIST_KEY]})
        queryClient.invalidateQueries({queryKey: [POST_CLIENT_KEY]});
        toast.success("Client created successfully!");
        navigate("/clients");
        form.reset(); // Reset the form after successful submission
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  }
  const handleUpdateClient =(data:ClientFormType) =>{
      const FormValue = {...data,client_geom:{
      type:"MultiPolygon",
      coordinates:[data.client_geom]   
    },
     client_established: dayjs(data.client_established).format("YYYY-MM-DD"),
     id:id
  }
  console.log(FormValue)  
      editClient(FormValue, {
      onSuccess: (data) => {
      // Invalidate and refetch
        queryClient.invalidateQueries({queryKey: [GET_CLIENT_LIST_KEY]})
        queryClient.invalidateQueries({queryKey: [PUT_CLIENT_KEY]});
        toast.success("Client updated successfully!");
        navigate("/clients");
        form.reset(); // Reset the form after successful submission
      },
      onError: (error) => {
           showErrorToast(error?.response?.data.message);
      },
    });
  }

  const onSubmit = (data: ClientFormType) => {
   if(!id) {
    console.log("here")
    handleCreateClient(data)
   }else{
    handleUpdateClient(data)
    }
  };

  useEffect(()=>{
  if(clientDetail && id && !isLoading){
    const clientFormData= {...clientDetail, client_geom: clientDetail?.client_geom?.coordinates[0]}
    setClientFormData(clientFormData)
    form.reset(clientFormData); // Reset the form with the fetched data
  }

},[clientDetail,isLoading])
  
  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id  ? 'Add' : (location.pathname.includes("editClient") ? "Edit" : "View")} Client`}
        breadcrumbPathList={[
          { menuName: "Management", menuPath: "" },
          { menuName: "Clients", menuPath: "/clients" }
        ]}
      />
      {isLoading  ? (<>Fetching Client Detail</>) : (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>

         <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='flex flex-col gap-2'>
              <FormInput control={form.control} name='client_id' label='Client ID' placeholder='Enter Client ID ' type='number' showLabel={true} />
              <FormInput control={form.control} name='client_ha' label='Client Acreage' placeholder='Enter Client Acreage ' type='number' showLabel={true} />
              <FormInput control={form.control} name='client_name' label='Client Name' placeholder='Enter Client Name' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_email' label='Client Email' placeholder='Enter Client Email' type='email' showLabel={true} />
              <FormInput control={form.control} name='client_phone' label='Client Phone' placeholder='Enter Client Phone Number' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_website' label='Client Website' placeholder='Enter Client Website URL' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_fax' label='Client Fax' placeholder='Enter Client Fax Number' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_street' label='Client Street' placeholder='Enter Client street' type='text' showLabel={true} />
               <FormDatePicker control={form.control} name='client_established' label='Established Date'  />
            </div>
            <div className='flex flex-col gap-2'>
             
              <FormInput control={form.control} name='client_country' label='Client Country' placeholder='Enter Client Country' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_admin_area' label='Client Admin Area' placeholder='Enter Client Admin Area' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_subadmin_area' label='Client Subadmin Area' placeholder='Enter Client Subadmin Area' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_premise' label='Client Premise' placeholder='Enter  Client Premise' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_subpremise' label='Client Sub Premise' placeholder='Enter Client sub Premise' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_locality' label='Client Locality' placeholder='Enter Client Locality' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_postal_code' label='Client Postal Code' placeholder='Enter Client Postal Code' type='text' showLabel={true} />
              <FormInput control={form.control} name='client_po_box' label='Client PO Box' placeholder='Enter Client PO Box Number' type='text' showLabel={true} />
            </div>
          </div>
              <div> 
               <FormCoordinatesMap
                form = {form}
                name="client_geom" 
                label="Client Coordinates"
                type="polygon"
                refLayer={featureGroupPolygonRef}
                layerCounts='multiple'
            />
          </div>
          <Button className='w-24 mt-4' type="submit">{location.pathname.includes("editClient") ? "Update" : "Add"}</Button>
        </form>
      </Form>) }
    </div>
  )
}

export default ClientForm
