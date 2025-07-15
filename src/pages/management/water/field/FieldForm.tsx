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
import { LatLng, LeafletEvent, Layer, FeatureGroup as LeafletFeatureGroup } from "leaflet"
import FormCoordinatesMap from '@/components/FormComponent/FormCoordinatesMap'
import { useEffect, useRef, useState } from 'react'
import { FormTextbox } from '@/components/FormComponent/FormTextbox'
import { FormRadioGroup } from '@/components/FormComponent/FormRadio'
import BasicSelect from '@/components/BasicSelect'
import { cn } from '@/lib/utils'
import { FormFileReader } from '@/components/FormComponent/FormFileReader'
import MapPreview from '@/components/MapPreview'
import { usePostMapPreview } from '@/services/mapPreview'
import { POST_MAP_PREVIEW } from '@/services/mapPreview/constant'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetWaps } from '@/services/timeSeries'
import { usePostFieldByWAP } from '@/services/water/field'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { GET_FIELD_DETAIL_KEY_BY_WAP, GET_FIELD_LIST_KEY_BY_WAP, POST_FIELD_KEY_BY_WAP } from '@/services/water/field/constant'
import { showErrorToast } from '@/utils/tools'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  wapId:z.number().nullable().optional(),
  fieldId:z.string().optional(),
  fieldName: z.string().min(5, "Field Name must be at least 5 characters"),
  fieldDesc: z.string().optional(),
  fieldIrrigArea: z.coerce.number(),
  fieldLegalArea  : z.coerce.number(),
  fieldActBool: z.string().optional(),
  fieldGeometryFile: z.array(z.instanceof(File)).optional(),

});

type FormValues = z.infer<typeof formSchema>;
const FieldForm = () => {
const navigate = useNavigate();
  const { id } = useParams();
  const clientId = JSON.parse(localStorage.getItem("auth") as string)?.client_id
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape");
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { data: waps, isLoading: wapsLoading } = useGetWaps();
  const {mutate:createFieldByWap, isPending:creatingField} = usePostFieldByWAP();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wapId:Number(''),
      fieldId:"",
      fieldName: "",
      fieldIrrigArea: Number(''),
      fieldLegalArea  : Number(''),
      fieldActBool: "True",
      fieldDesc: "",
      fieldGeometryFile: undefined
      // markers: [],
    },
  });

  useEffect(() => {
    if (!!form.watch("fieldGeometryFile")) {
      const file = form.watch("fieldGeometryFile");
      if (file?.length !== 0) {
        previewMap(file, {
          onSuccess: (data) => {
            setPreviewMapData(data || null);
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
          },
          onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
            showErrorToast(error?.response?.data?.message || "Failed upload file");
          },
        });
      }
    }
  }, [form.watch("fieldGeometryFile")])

  useEffect(()=>{
    if(!id && waps?.data){
    form.setValue("wapId",waps?.data[0].value)
}
},[waps])


  const onSubmit = (data: FormValues) => {
    const formData =convertKeysToSnakeCase({...data,clientId:clientId}) 
       createFieldByWap(formData, {
           onSuccess: (data: any) => {
             // Invalidate and refetch
             queryClient.invalidateQueries({ queryKey: [GET_FIELD_LIST_KEY_BY_WAP] })
             queryClient.invalidateQueries({ queryKey: [GET_FIELD_DETAIL_KEY_BY_WAP] });
             queryClient.invalidateQueries({ queryKey: [POST_FIELD_KEY_BY_WAP] });
             toast.success(data?.message);
             navigate("/field");
             form.reset(); // Reset the form after successful submission
           },
           onError: (error) => {
             showErrorToast(error?.response?.data?.message || "Failed to create field");
             queryClient.invalidateQueries({ queryKey: [POST_FIELD_KEY_BY_WAP] });
           },
         });
    
  };

  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle="Add Field"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Field", menuPath: "/field" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>

    

          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>
            <FormComboBox control={form.control} name='wapId' label='Water Accounting Period' options={waps?.data} />
            <FormInput control={form.control} name='fieldId' label='Field ID' placeholder='Enter Field ID' type='text' />
            <FormInput control={form.control} name='fieldName' label='Field Name' placeholder='Enter Field Name' type='text' />
            <FormInput control={form.control} name='fieldIrrigArea' label='Irrigable Area' placeholder='Enter Irrigable  Area' type='number' />
            <FormInput control={form.control} name='fieldLegalArea' label='Irrigable Area' placeholder='Enter Stand By  Area' type='number' />
            {/* <FormInput control={form.control} name= 'fieldLegalArea ' label='Legal Area' placeholder='Enter Stand By  Area' type='number' /> */}
            <FormTextbox control={form.control} name='fieldDesc' label='Field Description' placeholder='Enter Field Description' />
            <FormRadioGroup control={form.control} name='fieldActBool' label='Active status' options={[{ label: "Yes", value: "True" }, { label: "No", value: "False" }]} />

            {!location.pathname.includes("view") && <BasicSelect
              itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
              label="Choose Geometric File Type"
              Value={shapeType}
              setValue={(newValue) => {
                // Clear the selected files **before** changing shapeType
                form.setValue("fieldGeometryFile", undefined);
                setPreviewMapData(null);
                setShapeType(newValue);
              }} />}

            {!location.pathname.includes("view") && <div className='flex flex-col gap-2 w-full'>
              {shapeType === "geojson" ? <FormFileReader
                control={form.control}
                name="fieldGeometryFile"
                label="Upload GeoJSON file"
                placeholder='Choose GeoJSON File'
                multiple={false}
                accept=".geojson"
              /> : <FormFileReader
                control={form.control}
                name="fieldGeometryFile"
                label="Upload Shapefile"
                placeholder='Choose Shapefile'
                multiple={true}
                accept=".prj,.shp,.dbf,.shx,.qmd,.cpg" />}
            </div>}

          </div>
          <MapPreview data={previewMapData} isLoading={mapLoading} />


          {/* <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/> */}
          <Button className=' w-24' type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default FieldForm;