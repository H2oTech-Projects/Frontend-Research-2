import React, { useRef } from 'react'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { FormInput } from '@/components/FormComponent/FormInput';
import { Form } from '@/components/ui/form';
import FormCoordinatesMap from '@/components/FormComponent/FormCoordinatesMap';
import { LatLng, Layer, LeafletEvent,FeatureGroup as LeafletFeatureGroup  } from 'leaflet';
import { usePostClient } from '@/services/client';
import { useQueryClient } from '@tanstack/react-query';
import { GET_CLIENT_LIST_KEY, POST_CLIENT_KEY } from '@/services/client/constant';
import { toast } from 'react-toastify';
import { FormDatePicker } from '@/components/FormComponent/FormDatePicker';
import dayjs from "dayjs"; 

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

  // Board members and staff
  // boardMembers: z
  //   .array(
  //     z.object({
  //       name: z
  //         .string()
  //         .min(2, "Name must be at least 2 characters")
  //         .max(50, "Name must be at most 50 characters")
  //         .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  //     })
  //   )
  //   .min(1, "At least one board member is required"),
  // BoardPresident: z.string().optional(),
  // GM: z.string().optional(),
  // GMEmail: z.string().email().optional(),
  // GMPhone: z.string().optional(),
  // GMPhoneExt: z.string().optional(),
  // OA: z.string().optional(),
  // OAEmail: z.string().email().optional(),
  // OAPhone: z.string().optional(),
  // OM: z.string().optional(),
  // OMEmail: z.string().email().optional(),
  // OMPhone: z.string().optional(),
  client_name: z.string().optional(),

})
export type ClientFormType = z.infer<typeof clientSchema>;
const ClientForm = () => {
  const location = useLocation();
  const queryClient = useQueryClient()
  const featureGroupPolygonRef = useRef<LeafletFeatureGroup>(null);
  const {mutate, isPending} = usePostClient()
  const form = useForm<ClientFormType>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
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
      // boardMembers: [{ name: "" }],
      // BoardPresident: "",
      // GM: "",
      // GMEmail: "",
      // GMPhone: "",
      // GMPhoneExt: "",
      // OA: "",
      // OAEmail: "",
      // OAPhone: "",
      // OM: "",
      // OMEmail: "",
      // OMPhone: "",
      client_name: "",
    },
  });
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "boardMembers"
  // });
  const onSubmit = (data: ClientFormType) => {
    const FormValue = {...data,client_geom:{
      type:"MultiPolygon",
      coordinates:[data.client_geom],
},
    client_established: dayjs(data.client_established).format("YYYY-MM-DD")

}
    mutate(FormValue, {
      onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({queryKey: [GET_CLIENT_LIST_KEY]})
      queryClient.invalidateQueries({queryKey: [POST_CLIENT_KEY]});
      toast.success("Client created successfully!");
      form.reset(); // Reset the form after successful submission
      
      },
      onError: (error) => {
        console.error("Error creating client:", error);
      },
    });
  };

  // const polygons = form.watch("client_geom") || [];
  //   const getPolygonCoordinates = (layer: Layer): [number, number][] => {
  //     const latlngs = (layer as any).getLatLngs()[0] as LatLng[];
  //     return latlngs.map((latlng) => [latlng.lat, latlng.lng]);
  //   };
  
  //   // Handle polygon creation event
  //   const onPolygonCreated = (e: LeafletEvent) => {
  
  //     const layer = (e as any).layer;
  //     const formattedCoords = getPolygonCoordinates(layer);
    
  //     form.setValue("client_geom", [...polygons, formattedCoords]);
  //     form.clearErrors("client_geom");
  
  //   };
  
  //   // Handle polygon edit event
  //   const onPolygonEdited = (e: LeafletEvent) => {
  //     const updatedPolygons: [number, number][][] = [];
  //     featureGroupPolygonRef.current?.eachLayer((layer: Layer) => {
  //       updatedPolygons.push(getPolygonCoordinates(layer));});
  //     form.setValue("client_geom", updatedPolygons);
  //   };
  
  //   // Handle polygon deletion event
  // const onPolygonDeleted = (e: LeafletEvent) => {
  //     const remainingPolygons: [number, number][][] = [];
  //     featureGroupPolygonRef.current?.eachLayer((layer: Layer) => {
  //       remainingPolygons.push(getPolygonCoordinates(layer));});
  //     form.setValue("client_geom", remainingPolygons);
  //   };
  
  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${location.state?.mode === 'edit' ? 'Edit' : 'Add'} Client`}
        breadcrumbPathList={[
          { menuName: "Management", menuPath: "" },
          { menuName: "Clients", menuPath: "/clients" }
        ]}
      />
      <Form {...form}>
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
              
            </div>
            <div className='flex flex-col gap-2'>
              <FormDatePicker control={form.control} name='client_established' label='Established Date'  />
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
          {/* <div className='w-1/2'><FormInput control={form.control} name='BoardPresident' label='Board President' placeholder='Enter Board President Name' type='text' showLabel={true} /></div> */}
          {/* <div className='w-full'>
            Board Members
            {fields.map((field, index) => (
              <div key={field.id} className='flex gap-2 items-center my-3 w-full'>
                <div className='w-1/2'> <FormInput control={form.control} name={`boardMembers.${index}.name`} label='Board Member' placeholder='Enter Board Member Name' type='text' showLabel={false} /></div>
                {fields.length > 1 && (
                  <Button type="button" onClick={() => remove(index)}>Remove</Button>
                )}
                {index === fields.length - 1 && (
                  <Button type="button" onClick={() => append({ name: "" })}>Add</Button>
                )}
              </div>
            ))}
          </div> */}
          {/* <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='flex flex-col gap-2'>
              <FormInput control={form.control} name='GM' label='General Manager' placeholder='Enter General Manager Name' type='text' showLabel={true} />
              <FormInput control={form.control} name='GMPhone' label='General Manager Phone' placeholder='Enter General Manager Phone Number' type='text' showLabel={true} />
              <FormInput control={form.control} name='OA' label='Operations Assistant' placeholder='Enter Operations Assistant Name' type='text' showLabel={true} />
              <FormInput control={form.control} name='OAEmail' label='Operations Assistant Email' placeholder='Enter Operations Assistant Email' type='email' showLabel={true} />
              <FormInput control={form.control} name='OMEmail' label='Operations Manager Email' placeholder='Enter Operations Manager Email' type='email' showLabel={true} />
            </div>
            <div className='flex flex-col gap-2'>
              <FormInput control={form.control} name='GMEmail' label='General Manager Email' placeholder='Enter General Manager Email' type='email' showLabel={true} />
              <FormInput control={form.control} name='GMPhoneExt' label='General Manager Phone Ext.' placeholder='Enter General Manager Phone Ext.' type='text' showLabel={true} />
              <FormInput control={form.control} name='OAPhone' label='Operations Assistant Phone' placeholder='Enter Operations Assistant Phone Number' type='text' showLabel={true} />
              <FormInput control={form.control} name='OM' label='Operations Manager' placeholder='Enter Operations Manager Name' type='text' showLabel={true} />
              <FormInput control={form.control} name='OMPhone' label='Operations Manager Phone' placeholder='Enter Operations Manager Phone Number' type='text' showLabel={true} />
            </div>
          </div> */}
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
          <Button className='w-24 mt-4' type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default ClientForm
