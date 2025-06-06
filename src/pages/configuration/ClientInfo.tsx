import PageHeader from '@/components/PageHeader';
import { useGetClientDetails, useGetClientTypeOptions, useGetClientUnitSystemLabel, useGetClientUnitSystemOptions, usePutClient } from '@/services/client';
import { GET_CLIENT_DETAILS_KEY, GET_CLIENT_MAP_GEOJSON_KEY, PUT_CLIENT_KEY } from '@/services/client/constant';
import { useGetAdminAreaList, useGetCountryList, useGetLocationLabels, useGetSubAdminAreaList, useGetSubSubAdminAreaList, useGetSubSubSubAdminAreaList } from '@/services/location';
import { usePostMapPreview } from '@/services/mapPreview';
import { POST_MAP_PREVIEW } from '@/services/mapPreview/constant';
import { ClientFormType } from '@/types/formTypes';
import { clientInitialValues } from '@/utils/initialFormValues';
import { clientSchema } from '@/utils/schemaValidations/formSchema';
import { convertKeysToSnakeCase } from '@/utils/stringConversion';
import { showErrorToast } from '@/utils/tools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from "dayjs";
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { useMediaQuery } from '@uidotdev/usehooks';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/FormComponent/FormInput';
import { FormComboBox } from '@/components/FormComponent/FormRTSelect';
import { Input } from '@/components/ui/input';
import { FormDatePicker } from '@/components/FormComponent/FormDatePicker';
import BasicSelect from '@/components/BasicSelect';
import { FormFileReader } from '@/components/FormComponent/FormFileReader';
import MapPreview from '@/components/MapPreview';
import { Button } from '@/components/ui/button';
const ClientInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
   const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const form = useForm<ClientFormType>({
      resolver: zodResolver(clientSchema),
      defaultValues: clientInitialValues,
      shouldUnregister: true,
    });
  const queryClient = useQueryClient();
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [update,setUpdate] = useState<boolean>(false)
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview()
  const { mutate: updateClient, isPending: isClientUpdating } = usePutClient()
  const [shapeType, setShapeType] = useState<string>("shape")
  const { data: clientDetail, isLoading } = useGetClientDetails(userInfo?.clientId);
  const { data: unitSystemOptions } = useGetClientUnitSystemOptions();
  const { data: clientTypeOptions } = useGetClientTypeOptions();
  const { data: clientUnitSystemLabels } = useGetClientUnitSystemLabel();
  const { data: locationLabels, isLoading: labelLoading } = useGetLocationLabels();
  const { data: countryOptions, isLoading: countryOptionsLoading } = useGetCountryList();
  const { data: adminAreaData, refetch: refetchAdminArea } = useGetAdminAreaList(form.getValues("clientCountry"));
  const { data: subAdminAreaData, refetch: refetchSubAdminArea } = useGetSubAdminAreaList(form.getValues("clientAdminArea"));
  const { data: subSubAdminAreaData, refetch: refetchSubsubadminArea } = useGetSubSubAdminAreaList(form.getValues("clientSubadminArea"));
  const { data: subSubSubAdminAreaData, refetch: refetchlevel3Location } = useGetSubSubSubAdminAreaList(form.getValues("clientSubsubadminArea"));

  const handleUpdateClient = (data: ClientFormType) => {
    const FormValue = convertKeysToSnakeCase({
      ...data,
      clientEstablished: dayjs(data?.clientEstablished).format("YYYY-MM-DD"),
      id: userInfo?.clientId
    })
    const cleaned = Object.fromEntries(
      Object.entries(FormValue).filter(([_, value]) => value !== undefined)
    );
    updateClient(cleaned, {
      onSuccess: (data: any) => {
        // Invalidate and refetch
    
        queryClient.invalidateQueries({ queryKey: [GET_CLIENT_DETAILS_KEY, userInfo?.clientId] })
        queryClient.invalidateQueries({ queryKey: [PUT_CLIENT_KEY] });
        queryClient.invalidateQueries({ queryKey: [GET_CLIENT_MAP_GEOJSON_KEY] });
        toast.success(data?.message);
        setUpdate(false);
        // navigate("/clients");
        // form.reset(); // Reset the form after successful submission
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  }


  useEffect(() => {
    if (!!adminAreaData?.data && adminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = adminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientAdminAreaId'])
      let value = alreadyExisted && clientDetail['data'][0]['clientAdminAreaId'] || adminAreaData?.data[0]?.value
      form.setValue("clientAdminArea", value)
    }
  }, [adminAreaData, clientDetail])

  useEffect(() => {
     if ( !!subAdminAreaData?.data && subAdminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = subAdminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientSubadminAreaId'])
      let value = alreadyExisted && clientDetail['data'][0]['clientSubadminAreaId'] || subAdminAreaData?.data[0]?.value
      form.setValue("clientSubadminArea", value)
    }

  }, [subAdminAreaData, clientDetail])

  useEffect(() => {
   if ( !!subSubAdminAreaData?.data && subSubAdminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = subSubAdminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientSubadminArea2Id'])
      let value = alreadyExisted && clientDetail['data'][0]['clientSubadminArea2Id'] || subSubAdminAreaData?.data[0]?.value
      form.setValue("clientSubsubadminArea", value)
    }
  }, [subSubAdminAreaData])

  useEffect(() => {
     if ( !!subSubSubAdminAreaData?.data && subSubSubAdminAreaData?.data.length > 0 && !!clientDetail) {
      let alreadyExisted = subSubSubAdminAreaData.data.some((dic: any) => dic['value'] == clientDetail['data'][0]['clientSubadminArea3Id'])
      let value = alreadyExisted && clientDetail['data'][0]['clientSubadminArea3Id'] || subSubSubAdminAreaData?.data[0]?.value
      form.setValue("clientSubsubsubadminArea", value)
    }
  }, [subSubSubAdminAreaData])

  useEffect(() => {
    form.watch("clientCountry") && refetchAdminArea()
  }, [form.watch("clientCountry")])

  useEffect(() => {
    form.watch("clientAdminArea") && refetchSubAdminArea()
  }, [form.watch("clientAdminArea")])

  useEffect(() => {
    form.watch("clientSubadminArea") && refetchSubsubadminArea()
  }, [form.watch("clientSubadminArea")])

  useEffect(() => {
    form.watch("clientSubsubadminArea") && refetchlevel3Location()
  }, [form.watch("clientSubsubadminArea")])

  useEffect(() => {
    if (clientDetail ) {
      form.reset({ ...clientDetail?.data[0], clientDefaultUnitSystem: clientDetail?.data[0]?.clientDefaultUnitSystemId, uploadFile: [], clientCountry: clientDetail?.data[0]?.clientCountryId, clientAdminArea: clientDetail?.data[0]?.clientAdminAreaId, clientSubadminArea: clientDetail?.data[0]?.clientSubadminAreaId ?? undefined, clientSubsubadminArea: clientDetail?.data[0]?.clientSubadminArea2Id ?? undefined, clientSubsubsubadminArea: clientDetail?.data[0]?.clientSubadminArea3Id ?? undefined, clientType: clientDetail?.data[0]?.clientTypeId ?? undefined }); // Reset the form with the fetched data
      setPreviewMapData({ data: clientDetail?.clientGeojson, view_bounds: clientDetail?.viewBounds })
    }
  }, [clientDetail])

  useEffect(() => {
    if (!!form.watch("uploadFile")) {
      const file = form.watch("uploadFile");
      if (file?.length !== 0) {
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

  const handleCancel = ()=> {
       form.reset({ ...clientDetail?.data[0], clientDefaultUnitSystem: clientDetail?.data[0]?.clientDefaultUnitSystemId, uploadFile: [], clientCountry: clientDetail?.data[0]?.clientCountryId, clientAdminArea: clientDetail?.data[0]?.clientAdminAreaId, clientSubadminArea: clientDetail?.data[0]?.clientSubadminAreaId ?? undefined, clientSubsubadminArea: clientDetail?.data[0]?.clientSubadminArea2Id ?? undefined, clientSubsubsubadminArea: clientDetail?.data[0]?.clientSubadminArea3Id ?? undefined, clientType: clientDetail?.data[0]?.clientTypeId ?? undefined }); // Reset the form with the fetched data
      setPreviewMapData({ data: clientDetail?.clientGeojson, view_bounds: clientDetail?.viewBounds })
      setUpdate(false)
}

  const enabledadminAreaData = !!adminAreaData?.data && adminAreaData?.data.length > 0
  const enabledSubadminAreaData = enabledadminAreaData && !!subAdminAreaData?.data && subAdminAreaData?.data.length > 0
  const enabledSubSubAdminArea = enabledSubadminAreaData && !!subSubAdminAreaData?.data && subSubAdminAreaData?.data.length > 0
  const enabledSubSubSubAdminArea = enabledSubSubAdminArea && !!subSubSubAdminAreaData?.data && subSubSubAdminAreaData?.data.length > 0
  const locationLabel = !!locationLabels?.data && !!form.getValues('clientCountry') && locationLabels?.data[form.getValues('clientCountry')!]
  const UnitSystemLabel = !!clientUnitSystemLabels?.data && !!form.watch('clientDefaultUnitSystem') && clientUnitSystemLabels?.data[form.watch('clientDefaultUnitSystem')!]
  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${userInfo?.clientType} information`}
        pageHeaderAction={!update ? <Button type='button' onClick={()=>setUpdate(true)}>Edit Info</Button> : <Button type='button' variant={'destructive'} onClick={handleCancel}>Cancel</Button>}
        breadcrumbPathList={[
          { menuName: "Configuration", menuPath: "" },  
        ]}
      />
       {isLoading ? (<>Fetching Client Detail</>) : (<Form {...form} >
        <form onSubmit={form.handleSubmit(handleUpdateClient)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-2 dark:bg-slate-900 dark:text-white'>
             <div className='flex flex-col gap-2 mt-1'>
            <h2 className='text-lg font-semibold'> General Information</h2>
            <hr />
          </div>
          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>

            <FormInput
              control={form.control}
              name='clientId'
              label='ID'
              placeholder='Enter ID '
              type='text'
              showLabel={true}
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name='clientName'
              label='Name'
              placeholder='Enter Client Name'
              type='text'
              showLabel={true}
              disabled={!update}
            />
{/* 
            <FormComboBox
              control={form.control}
              name='clientType'
              label='Client Type'
              placeholder='Select client Type'
              options={clientTypeOptions || []}
              disabled={true}
            /> */}
            {/* <FormComboBox
              control={form.control}
              name='clientDefaultUnitSystem'
              label='Default Unit System'
              placeholder='Select Default Unit System'
              options={unitSystemOptions || []}
              disabled={!update}
            /> */}


             <FormInput
              control={form.control}
              name='clientLegalHa'
              label={UnitSystemLabel?.clientLegalHa}
              placeholder='Enter legal Area '
              type='number'
              showLabel={true}
              disabled={!update} 
            />

            {!update && <FormItem>
              <FormLabel>{UnitSystemLabel?.clientGeomHa} </FormLabel>
              <FormControl>
                <Input
                  value={clientDetail?.data[0]?.clientGeomHa || "2"}
                  type={"number"}
                  autoComplete="off"
                  disabled={true}
                // className={type === "number" ? " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" : ""}
                />
              </FormControl>
            </FormItem>}


            <FormInput
              control={form.control}
              name='clientWebsite'
              label='Website'
              placeholder='Enter Client Website URL'
              type='text'
              showLabel={true}
              disabled={!update} />


            <FormDatePicker
              control={form.control}
              name='clientEstablished'
              label='Established Date'
              disabled={!update}
            />

          </div>
          <div className='flex flex-col gap-2 mt-1'>
            <h2 className='text-lg font-semibold'> Contact Information</h2>
            <hr />
          </div>
          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>

            <FormInput
              control={form.control}
              name='clientEmail'
              label='Email'
              placeholder='Enter Client Email'
              type='email' showLabel={true}
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name='clientPhone'
              label='Phone'
              placeholder='Enter Client Phone Number'
              type='text'
              showLabel={true}
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name='clientFax'
              label='Fax'
              placeholder='Enter Client Fax Number'
              type='text'
              showLabel={true}
              disabled={!update} />

          </div>
          <div className='flex flex-col gap-2 mt-1'>
            <h2 className='text-lg font-semibold'>Location Information</h2>
            <hr />
          </div>

          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>
            <FormComboBox
              control={form.control}
              name="clientCountry"
              label="Country"
              placeholder="Enter Client Country"
              options={countryOptions?.data || []}
              disabled={!update}
            />

            {enabledadminAreaData && (
              <FormComboBox
                control={form.control}
                name="clientAdminArea"
                label={locationLabel?.adminArea || "Admin Area"}
                placeholder="Enter Client Admin Area"
                options={adminAreaData?.data || []}
                disabled={!update}
              />
            )}

            {enabledSubadminAreaData && (
              <FormComboBox
                control={form.control}
                name="clientSubadminArea"
                label={locationLabel?.subAdminArea || "Sub Admin Area"}
                placeholder="Enter Client Sub Admin Area"
                options={subAdminAreaData?.data || []}
                disabled={!update}
              />
            )}

            {enabledSubSubAdminArea && (
              <FormComboBox
                control={form.control}
                name="clientSubsubadminArea"
                label={locationLabel?.subAdminAreaLevel2 || "Sub Sub Admin Area"}
                placeholder="Enter Client Sub Sub Admin Area"
                options={subSubAdminAreaData?.data || []}
                disabled={!update}
              />
            )}

            {enabledSubSubSubAdminArea && (
              <FormComboBox
                control={form.control}
                name="clientSubsubsubadminArea"
                label={locationLabel?.subAdminAreaLevel3 || "Sub Sub Sub Admin Area"}
                placeholder="Enter Client Sub Sub Sub Admin Area"
                options={subSubSubAdminAreaData?.data || []}
                disabled={!update}
              />
            )}

            <FormInput
              control={form.control}
              name="clientLocality"
              label= { locationLabel?.locality || "Locality"}
              placeholder={`Enter Client ${locationLabel?.locality || "Locality"}`}
              type="text"
              showLabel
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name='clientPostalCode'
              label={locationLabel?.postalCode || "Postal Code"}
              placeholder={`Enter Client ${locationLabel?.postalCode || "Postal Code"}`}
              type='text' showLabel={true}
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name="clientPoBox"
              label={locationLabel?.poBox || "PO Box"}
              placeholder={`Enter Client ${locationLabel?.poBox || "PO Box"}`}
              type="text"
              showLabel
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name="clientStreet"
              label={locationLabel?.street || "Street"}
              placeholder={`Enter Client ${locationLabel?.street || "Street"}`}
              type="text"
              showLabel
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name="clientPremise"
              label={locationLabel?.premise || "Premise"}
              placeholder={`Enter Client ${locationLabel?.premise || "Premise"}`}
              type="text"
              showLabel
              disabled={!update}
            />

            <FormInput
              control={form.control}
              name="clientSubpremise"
              label= {locationLabel?.subpremise || "Sub Premise"}
              placeholder={`Enter Client ${locationLabel?.subpremise || "Sub Premise"}`}
              type="text"
              showLabel
              disabled={!update}
            />




          </div>
          <div className='flex flex-col gap-2 mt-1'>
            <h2 className='text-lg font-semibold'>Geometric Information</h2>
            <hr />
          </div>
          <div className={cn('grid gap-4 auto-rows-auto mb-4', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>

            {!!update && <BasicSelect
              itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
              label="Choose Geometric File Type"
              Value={shapeType}
              setValue={(newValue) => {
                // Clear the selected files **before** changing shapeType
                form.setValue("uploadFile", undefined);
                setPreviewMapData(null);
                setShapeType(newValue);
              }} />}

            {!!update && <div className='flex flex-col gap-2 w-full'>
              {shapeType === "geojson" ? <FormFileReader
                control={form.control}
                name="uploadFile"
                label="Upload GeoJSON file"
                placeholder='Choose GeoJSON File'
                multiple={false}
                accept=".geojson"
              /> : <FormFileReader
                control={form.control}
                name="uploadFile"
                label="Upload Shapefile"
                placeholder='Choose Shapefile'
                multiple={true}
                accept=".prj,.shp,.dbf,.shx,.qmd,.cpg" />}
            </div>}

          </div>
          <MapPreview data={previewMapData} isLoading={mapLoading} />
          {!!update && <Button className='w-24 mt-4' disabled={ isClientUpdating} type="submit">Update</Button>}

        </form>
      </Form>)}
    </div>
  )
}

export default ClientInfo
