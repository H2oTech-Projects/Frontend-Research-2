import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/FormComponent/FormInput';
import { Form } from '@/components/ui/form';
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
import { useGetAdminAreaList, useGetCountryList, useGetSubAdminAreaList, useGetSubSubAdminAreaList, useGetSubSubSubAdminAreaList, useGetLocationLabels } from '@/services/location';
import { FormComboBox } from '@/components/FormComponent/FormRTSelect';


const ClientForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape")
  const { data: clientDetail, isLoading } = useGetClientDetails(id);
  const { mutate: previewMap, isPending:mapLoading } = usePostMapPreview()
  const { mutate: createClient, isPending: isClientCreating } = usePostClient()
  const { mutate: updateClient, isPending: isClientUpdating } = usePutClient()
  const form = useForm<ClientFormType>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientInitialValues,
  });
  const {data: locationLabels, isLoading: labelLoading} = useGetLocationLabels();
  const {data:countryOptions, isLoading:countryOptionsLoading} = useGetCountryList();
  const {data:adminAreaData, refetch: refetchAdminArea} = useGetAdminAreaList(form.getValues("clientCountry"));
  const {data:subAdminAreaData, refetch: refetchSubAdminArea} = useGetSubAdminAreaList(form.getValues("clientAdminArea"));
  const {data:subSubAdminAreaData, refetch: refetchSubsubadminArea} = useGetSubSubAdminAreaList(form.getValues("clientSubadminArea"));
  const {data:subSubSubAdminAreaData, refetch: refetchlevel3Location} = useGetSubSubSubAdminAreaList(form.getValues("clientSubsubadminArea"));

  useEffect(()=>{
    if(!!countryOptions?.data && countryOptions?.data.length > 0) {
      !id && form.setValue("clientCountry", countryOptions?.data[0]?.value)
    }
  },[countryOptions])

  useEffect(()=>{
    if(!id && !!adminAreaData?.data && adminAreaData?.data.length > 0) {
      form.setValue("clientAdminArea", adminAreaData?.data[0]?.value)
    } else if (!!id && !!adminAreaData?.data && adminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = adminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientAdminAreaId'])
      let value = alreadyExisted && clientDetail['data'][0]['clientAdminAreaId'] || adminAreaData?.data[0]?.value
      form.setValue("clientAdminArea", value)
    }
  },[adminAreaData, clientDetail])

  useEffect(()=>{
    if(!id && !!subAdminAreaData?.data && subAdminAreaData?.data.length > 0) {
      form.setValue("clientSubadminArea", subAdminAreaData?.data[0]?.value)
    } else if (!!id && !!subAdminAreaData?.data && subAdminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = subAdminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientSubadminAreaId'])
      let value = alreadyExisted && clientDetail['data'][0]['clientSubadminAreaId'] || subAdminAreaData?.data[0]?.value
      form.setValue("clientSubadminArea", value)
    }
  },[subAdminAreaData, clientDetail])

  useEffect(()=>{
    if(!id && !!subSubAdminAreaData?.data && subSubAdminAreaData?.data.length > 0) {
      form.setValue("clientSubsubadminArea", subSubAdminAreaData?.data[0]?.value)
    } else if (!!id && !!subSubAdminAreaData?.data && subSubAdminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = subSubAdminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientSubsubadminAreaId'])
      let value = alreadyExisted && clientDetail['data'][0]['clientSubsubadminAreaId'] || subSubAdminAreaData?.data[0]?.value
      form.setValue("clientSubsubadminArea", value)
    }
  },[subSubAdminAreaData])

  useEffect(()=>{
    if(!id && !!subSubSubAdminAreaData?.data && subSubSubAdminAreaData?.data.length > 0) {
      form.setValue("clientSubsubsubadminArea", subSubSubAdminAreaData?.data[0]?.value)
    } else if (!!id && !!subSubSubAdminAreaData?.data && subSubSubAdminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = subSubSubAdminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientSubsubsubadminAreaId'])
      let value = alreadyExisted && clientDetail['data'][0]['clientSubsubsubadminAreaId'] || subSubSubAdminAreaData?.data[0]?.value
      form.setValue("clientSubsubsubadminArea", value)
    }
  },[subSubSubAdminAreaData])

  useEffect(()=>{
    form.watch("clientCountry") && refetchAdminArea() 
  },[form.watch("clientCountry")])

  useEffect(()=>{
  form.watch("clientAdminArea") && refetchSubAdminArea()
  },[form.watch("clientAdminArea")])

  useEffect(()=>{
    form.watch("clientSubadminArea") && refetchSubsubadminArea()
  },[form.watch("clientSubadminArea")])

  useEffect(()=>{
    form.watch("clientSubsubadminArea") && refetchlevel3Location()
  },[form.watch("clientSubsubadminArea")])

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
    const FormValue = convertKeysToSnakeCase({
      ...data,
      clientEstablished: dayjs(data.clientEstablished).format("YYYY-MM-DD"),
      id: id

    })
  
   const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );

    updateClient(cleaned, {
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
    if (clientDetail && id) {
      form.reset({...clientDetail?.data[0],uploadFile: [], clientCountry:clientDetail?.data[0]?.clientCountryId, clientAdminArea:clientDetail?.data[0]?.clientAdminAreaId,clientSubadminArea:clientDetail?.data[0]?.clientSubadminAreaId ?? undefined,clientSubsubadminArea:clientDetail?.data[0]?.clientSubsubadminAreaId ?? undefined,clientSubsubsubadminArea:clientDetail?.data[0]?.clientSubsubsubadminAreaId ?? undefined}); // Reset the form with the fetched data
      setPreviewMapData({data:clientDetail?.clientGeojson, view_bounds:clientDetail?.viewBounds})
    }
  }, [clientDetail])

  useEffect(() => {
    if (!!form.watch("uploadFile") ) {
      const file = form.watch("uploadFile");
      if(file?.length !== 0){
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
    }
  }, [form.watch("uploadFile")])
  const enabledadminAreaData = !!adminAreaData?.data && adminAreaData?.data.length > 0
  const enabledSubadminAreaData = enabledadminAreaData && !!subAdminAreaData?.data && subAdminAreaData?.data.length > 0
  const enabledSubSubAdminArea = enabledSubadminAreaData  && !!subSubAdminAreaData?.data && subSubAdminAreaData?.data.length > 0
  const enabledSubSubSubAdminArea = enabledSubSubAdminArea && !!subSubSubAdminAreaData?.data && subSubSubAdminAreaData?.data.length > 0

  const locationLabel = !!locationLabels?.data && !!form.getValues('clientCountry') && locationLabels?.data[form.getValues('clientCountry')!]

  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Client`}
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
              <FormComboBox control={form.control} name='clientCountry' label='Country' placeholder='Enter Client Country' options={countryOptions?.data || []} />

              {enabledadminAreaData && <FormComboBox control={form.control}  name='clientAdminArea' label={locationLabel?.adminArea} placeholder='Enter Client Admin Area' options={adminAreaData?.data || []} />}

              {enabledSubadminAreaData && <FormComboBox control={form.control}  name='clientSubadminArea' label={locationLabel?.subAdminArea} placeholder='Enter Client Sub admin Area' options={subAdminAreaData?.data || []}  />}

              {enabledSubSubAdminArea && <FormComboBox control={form.control}  name='clientSubsubadminArea' label={locationLabel?.subAdminAreaLevel2} placeholder='Enter Client Sub Sub admin Area' options={subSubAdminAreaData?.data || []}  />}

              {enabledSubSubSubAdminArea && <FormComboBox control={form.control}  name='clientSubsubsubadminArea' label={locationLabel?.subAdminAreaLevel3} placeholder='Enter Client Sub sub sub admin Area' options={subSubSubAdminAreaData?.data || []}  />}

              <FormInput control={form.control} name='clientPremise' label=' Premise' placeholder='Enter Client Premise' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientSubpremise' label='Sub Premise' placeholder='Enter Client sub Premise' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientLocality' label='Locality' placeholder='Enter Client Locality' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientPostalCode' label='Postal Code' placeholder='Enter Client Postal Code' type='text' showLabel={true} />
              <FormInput control={form.control} name='clientPoBox' label='PO Box' placeholder='Enter Client PO Box Number' type='text' showLabel={true} />
            </div>
          </div>
          <MapPreview data={previewMapData} isLoading={mapLoading} />
          <Button className='w-24 mt-4' disabled={isClientCreating || isClientUpdating} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>
        </form>
      </Form>)}
    </div>
  )
}

export default ClientForm
