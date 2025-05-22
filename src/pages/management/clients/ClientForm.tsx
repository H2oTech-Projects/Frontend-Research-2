import { useEffect, useRef, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/FormComponent/FormInput';
import { Form } from '@/components/ui/form';
import { FeatureGroup as LeafletFeatureGroup } from 'leaflet';
import { useGetClientDetails, usePostClient, usePutClient } from '@/services/client';
import { useQueryClient } from '@tanstack/react-query';
import { GET_CLIENT_LIST_KEY, POST_CLIENT_KEY, PUT_CLIENT_KEY } from '@/services/client/constant';
import { toast } from 'react-toastify';
import { FormDatePicker } from '@/components/FormComponent/FormDatePicker';
import dayjs from "dayjs";
import { showErrorToast } from '@/utils/tools';
import { FormFileReader } from '@/components/FormComponent/FormFileReader';
import { usePostMapPreview } from '@/services/mapPreview';
import MapPreview from '@/components/MapPreview';
import { POST_MAP_PREVIEW } from '@/services/mapPreview/constant';
import BasicSelect from '@/components/BasicSelect';
import { clientSchema } from '@/utils/schemaValidations/formSchema';
import { clientInitialValues } from '@/utils/initialFormValues';
import { ClientFormType } from '@/types/formTypes';
import { convertKeysToSnakeCase } from '@/utils/stringConversion';
import { useGetAdminAreaList, useGetLocationList, useGetSubAdminAreaList, useGetSubSubAdminAreaList, useGetSubSubSubAdminAreaList } from '@/services/location';
import { FormComboBox } from '@/components/FormComponent/FormRTSelect';


const ClientForm = () => {
  const initialLocationState = {
  clientCountry:undefined,
  clientAdminArea: undefined,
  clientSubadminArea: undefined,
  clientSubsubadminArea: undefined,
  clientSubsubsubadminArea: undefined
}
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [locationState, setLocationState] = useState<any>(initialLocationState)
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape")
  const { data: clientDetail, isLoading } = useGetClientDetails(id ? id : null);
  const { mutate: previewMap, isPending:mapLoading } = usePostMapPreview()
  const { mutate: createClient, isPending: isClientCreating } = usePostClient()
  const { mutate: editClient, isPending: isClientUpdating } = usePutClient()
  const form = useForm<ClientFormType>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientInitialValues,
  });
  const {data:locationData, isLoading:locationLoading} = useGetLocationList();
  const {data:adminAreaData} = useGetAdminAreaList(locationState.clientCountry);
  const {data:subAdminAreaData} = useGetSubAdminAreaList(locationState.clientAdminArea);
  const {data:subSubAdminAreaData} = useGetSubSubAdminAreaList(locationState.clientSubadminArea);
  const {data:subSubSubAdminAreaData} = useGetSubSubSubAdminAreaList(locationState.clientSubsubadminArea);

  useEffect(()=>{
        if(locationData  ) {
      setLocationState((prevState:any) => ({
        ...prevState,
        clientCountry: locationData?.data[0]?.value 
      }))
      form.setValue("clientCountry", locationData?.data[0]?.value)
    }
},[locationData])

useEffect(()=>{
  setLocationState((prevState:any) => ({
        ...prevState,
        clientCountry: form.watch("clientCountry")
      }))
  form.resetField("clientAdminArea", { defaultValue: undefined });
  form.resetField("clientSubadminArea", { defaultValue: undefined });
  form.resetField("clientSubsubadminArea", { defaultValue: undefined });
  form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });
},[form.watch("clientCountry")])

useEffect(()=>{
  setLocationState((prevState:any) => ({
        ...prevState,
        clientAdminArea: form.watch("clientAdminArea")
      }))
  form.resetField("clientSubadminArea", { defaultValue: undefined });
  form.resetField("clientSubsubadminArea", { defaultValue: undefined });
  form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });
},[form.watch("clientAdminArea")])

useEffect(()=>{
  setLocationState((prevState:any) => ({
        ...prevState,
        clientSubadminArea: form.watch("clientSubadminArea")
      }))
  form.resetField("clientSubsubadminArea", { defaultValue: undefined });
  form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });
},[form.watch("clientSubadminArea")])

useEffect(()=>{
  setLocationState((prevState:any) => ({
        ...prevState,
        clientSubsubadminArea: form.watch("clientSubsubadminArea")
      }))
  form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });
},[form.watch("clientSubsubadminArea")])

useEffect(()=> {
if(adminAreaData?.data){
  setLocationState((prevState:any) => ({
        ...prevState,
        clientAdminArea: adminAreaData?.data[0]?.value 
      }))
  form.setValue("clientAdminArea",adminAreaData?.data[0]?.value)
}

},[adminAreaData])

useEffect(()=>{
  if(subAdminAreaData?.data){
  setLocationState((prevState:any) => ({
        ...prevState,
        clientSubadminArea: subAdminAreaData?.data[0]?.value 
      }))
  form.setValue("clientSubadminArea",subAdminAreaData?.data[0]?.value)
}
},[subAdminAreaData])

useEffect(()=>{
  if(subSubAdminAreaData?.data){
  setLocationState((prevState:any) => ({
        ...prevState,
        clientSubsubadminArea: subSubAdminAreaData?.data[0]?.value 
      }))
  form.setValue("clientSubsubadminArea",subSubAdminAreaData?.data[0]?.value)
}
},[subSubAdminAreaData])

useEffect(()=>{
  if(subSubSubAdminAreaData?.data){
  form.setValue("clientSubsubsubadminArea",subSubSubAdminAreaData?.data[0]?.value)
}
},[subSubSubAdminAreaData])



//   useEffect(() =>{
    
//       if( !adminAreaData && !locationState.clientAdminArea) {
     
//       setLocationState((prevState:any) => ({
//         ...prevState,
//         clientAdminArea: adminAreaData?.data[0]?.value
//       }))
//        form.setValue("clientAdminArea", adminAreaData?.data[0]?.value)
//     }
//       if(adminAreaData?.hasNextLevel && subAdminAreaData && !locationState.clientSubadminArea) { 
//        console.log("here")
//       setLocationState((prevState:any) => ({
//         ...prevState,
//         clientSubadminArea: subAdminAreaData?.data[0]?.value
//       }))
//       form.setValue("clientSubadminArea", subAdminAreaData?.data[0]?.value)
//     }
//       if(subAdminAreaData?.hasNextLevel && subSubAdminAreaData && !locationState.clientSubsubadminArea) { 
//       setLocationState((prevState:any) => ({
//         ...prevState,
//         clientSubsubadminArea: subSubAdminAreaData?.data[0]?.value
//       }))
//       form.setValue("clientSubsubadminArea", subAdminAreaData?.data[0]?.value)
//     }
// },[locationData,adminAreaData,subAdminAreaData,subSubAdminAreaData])

// useEffect(()=>{
//    if(locationData?.hasNextLevel && adminAreaData) {
//       setLocationState((prevState:any) => ({
//         ...prevState,
//         clientAdminArea: adminAreaData?.data[0]?.value
//       }))
//       form.setValue("clientAdminArea", adminAreaData?.data[0]?.value)
//     }
// },[adminAreaData])

//   useEffect(() => {
//     if(form.watch("clientCountry")) {
//       setLocationState({...initialLocationState, clientCountry: form.watch("clientCountry")})
//     }
//   form.resetField("clientAdminArea", { defaultValue: undefined });
//   form.resetField("clientSubadminArea", { defaultValue: undefined });
//   form.resetField("clientSubsubadminArea", { defaultValue: undefined });
//   form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });

// }, [form.watch("clientCountry")])
 
//  useEffect(() => {
//     if(form.watch("clientAdminArea")) {
//       setLocationState((prevState:any) => ({
//         ...prevState,
//         clientAdminArea: form.watch("clientAdminArea"),
//         clientSubadminArea: undefined,
//         clientSubsubadminArea: undefined,
//         clientSubsubsubadminArea: undefined,
//       }))
//     }
//   form.resetField("clientSubadminArea", { defaultValue: undefined });
//   form.resetField("clientSubsubadminArea", { defaultValue: undefined });
//   form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });

// }, [form.watch("clientAdminArea")])
//   useEffect(() => {

//     if(form.watch("clientSubadminArea")) {
 
//       setLocationState((prevState:any) => ({
//         ...prevState,
//         clientSubadminArea: form.watch("clientSubadminArea"),
//         clientSubsubadminArea: undefined,
//         clientSubsubsubadminArea: undefined,
//       }))
//     }
//   form.resetField("clientSubsubadminArea", { defaultValue: undefined });
//   form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });

// }, [form.watch("clientSubadminArea")])
  

// useEffect(() => {
 
//     if(form.watch("clientSubsubadminArea")) {
//       setLocationState((prevState:any) => ({
//         ...prevState,
//         clientSubsubadminArea: form.watch("clientSubsubadminArea"),
//         clientSubsubsubadminArea: undefined,
//       }))
//     }
//   form.resetField("clientSubsubsubadminArea", { defaultValue: undefined });

// }, [form.watch("clientSubsubadminArea")])

  const handleCreateClient = (data: ClientFormType) => {
    const FormValue = convertKeysToSnakeCase({
      ...data,
      clientEstablished: dayjs(data.clientEstablished).format("YYYY-MM-DD")
    })
    const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );
    createClient(cleaned, {
      onSuccess: (data:any) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [GET_CLIENT_LIST_KEY] })
        queryClient.invalidateQueries({ queryKey: [POST_CLIENT_KEY] });
        toast.success(data?.message);
        navigate("/clients");
        form.reset(); // Reset the form after successful submission
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  }
  const handleUpdateClient = (data: ClientFormType) => {
    const FormValue = {
      ...data, 
      clientEstablished: dayjs(data.clientEstablished).format("YYYY-MM-DD"),
      id: id
    }
   const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );
    editClient(cleaned, {
      onSuccess: (data) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: [GET_CLIENT_LIST_KEY] })
        queryClient.invalidateQueries({ queryKey: [PUT_CLIENT_KEY] });
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
    if (!id) {
      handleCreateClient(data)
    } else {
      handleUpdateClient(data)
    }
  };

  useEffect(() => {
    if (clientDetail && id && !isLoading) {
      form.reset(clientDetail); // Reset the form with the fetched data
    }
  }, [clientDetail, isLoading])

  useEffect(() => {
    if (!!form.watch("uploadFile") ) {
      const file = form.watch("uploadFile");
      previewMap(file, {
        onSuccess: (data) => {
          setPreviewMapData(data || null);
          queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
        },
        onError: (error: any) => {
          queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
          toast.error(error?.response?.data.message?.APIException[0]);
        },
      });
    }
  }, [form.watch("uploadFile")])

  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("editClient") ? "Edit" : "View")} Client`}
        breadcrumbPathList={[
          { menuName: "Management", menuPath: "" },
          { menuName: "Clients", menuPath: "/clients" }
        ]}
      />
      {isLoading ? (<>Fetching Client Detail</>) : (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='flex flex-col gap-2'>
              <FormInput control={form.control} name='clientId' label='ID' placeholder='Enter Client ID ' type='number' showLabel={true} />
              <FormInput control={form.control} name='clientLegalHa' label='Acreage' placeholder='Enter Client Acreage ' type='number' showLabel={true} />
              <FormInput control={form.control} name='clientName' label='Name' placeholder='Enter Client Name' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientEmail' label='Email' placeholder='Enter Client Email' type='email' showLabel={true} />
              <FormInput control={form.control} name='clientPhone' label='Phone' placeholder='Enter Client Phone Number' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientWebsite' label='Website' placeholder='Enter Client Website URL' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientFax' label='Fax' placeholder='Enter Client Fax Number' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientStreet' label='Client Street' placeholder='Enter street' type='text' showLabel={true} />
              <FormDatePicker control={form.control} name='clientEstablished' label='Established Date' />
              <BasicSelect
                itemList={[{ label: "Shape", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
                label="Choose Geometric File Type"
                Value={shapeType}
                setValue={(newValue) => {
                  // Clear the selected files **before** changing shapeType
                  form.setValue("uploadFile", undefined);
                  setPreviewMapData(null);
                  setShapeType(newValue);
                }} />
              <div className='flex flex-col gap-2 w-full'>
                {shapeType === "geojson" ? <FormFileReader control={form.control} name="uploadFile" label="Upload GeoJSON file" placeholder='Choose GeoJSON File' multiple={false} accept=".geojson" /> : <FormFileReader control={form.control} name="uploadFile" label="Upload Shape file" placeholder='Choose Shape File' multiple={true} accept=".prj,.shp,.dbf,.shx,.qmd,.cpg" />}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              {/* <FormInput control={form.control} name='clientCountry' label='Country' placeholder='Enter Client Country' type='number' showLabel={true} /> */}
              <FormComboBox control={form.control} name='clientCountry' label='Country' placeholder='Enter Client Country' options={locationData?.data || []} />
              <FormComboBox control={form.control}  name='clientAdminArea' label='Admin Area' placeholder='Enter Client Admin Area' options={adminAreaData?.data || []} />
              <FormComboBox control={form.control}  name='clientSubadminArea' label='Subadmin Area' placeholder='Enter Client Sub admin Area' options={subAdminAreaData?.data || []} />
              <FormComboBox control={form.control}  name='clientSubsubadminArea' label='Subsub Admin Area' placeholder='Enter Client Sub Sub admin Area' options={subSubAdminAreaData?.data || []} />
              <FormComboBox control={form.control}  name='clientSubsubsubadminArea' label='Sub sub sub Admin Area' placeholder='Enter Client Sub sub sub admin Area' options={subSubSubAdminAreaData?.data || []} />
              <FormInput control={form.control} name='clientPremise' label=' Premise' placeholder='Enter Client Premise' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientSubpremise' label='Sub Premise' placeholder='Enter Client sub Premise' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientLocality' label='Locality' placeholder='Enter Client Locality' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientPostalCode' label='Postal Code' placeholder='Enter Client Postal Code' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientPoBox' label='PO Box' placeholder='Enter Client PO Box Number' type='text' showLabel={true} />
            </div>
          </div>
          <MapPreview data={previewMapData} isLoading={mapLoading} />
          <Button className='w-24 mt-4' type="submit">{location.pathname.includes("editClient") ? "Update" : "Add"}</Button>
        </form>
      </Form>)}
    </div>
  )
}

export default ClientForm
