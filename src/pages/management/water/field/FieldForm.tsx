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
import { useParams } from 'react-router-dom'
import { useGetWaps } from '@/services/timeSeries'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  wapId:z.number().nullable(),
  fieldName: z.string().min(5, "Field Name must be at least 5 characters"),
  field_desc: z.string().optional(),
  field_cmnt: z.string().optional(),
  IrrigAcres: z.coerce.number(),
  StandbyAcres: z.coerce.number().optional(),
  ActiveFlag: z.string().optional(),
  MsmtMethod: z.string().min(1, "Measurement Method is required"),
  MsmtMethodDesc: z.string().optional(),
  uploadFile: z.array(z.instanceof(File)).optional(),

});

type FormValues = z.infer<typeof formSchema>;
const FieldForm = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape");
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { data: waps, isLoading: wapsLoading } = useGetWaps();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wapId:null,
      fieldName: "",
      IrrigAcres: Number(''),
      StandbyAcres: Number(''),
      ActiveFlag: "true",
      MsmtMethod: "",
      MsmtMethodDesc: "",
      field_desc: "",
      field_cmnt: "",
      uploadFile: undefined
      // markers: [],
    },
  });

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

  useEffect(()=>{
    if(!id && waps.data){
    form.setValue("wapId",waps?.data[0].value)
}
},[waps])


  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
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
            <FormInput control={form.control} name='fieldName' label='Field Name' placeholder='Enter Field Name' type='text' />

            <FormInput control={form.control} name='IrrigAcres' label='Irrigable Acres' placeholder='Enter Irrigable  Acres' type='number' />
            <FormInput control={form.control} name='StandbyAcres' label='Stand By Acres' placeholder='Enter Stand By  Acres' type='number' />

            <FormTextbox control={form.control} name='field_desc' label='Field Description' placeholder='Enter Field Description' />
            <FormTextbox control={form.control} name='field_cmnt' label='Comments' placeholder='Comments...' />

           
            <FormComboBox control={form.control} name='MsmtMethod' label='Measurement Method' options={[{ label: "GPS", value: "GPS" }, { label: "Survey", value: "Survey" }, { label: "Aerial", value: "Aerial" }]} />
            <FormRadioGroup control={form.control} name='ActiveFlag' label='Active status' options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} />

            <FormTextbox control={form.control} name='MsmtMethodDesc' label='Measurement Method Description' placeholder='Enter Measurement Method Description' />
            {/* <FormComboBox control={form.control} name = "year" label= 'Year' options={[{ label:"2022",value:"2022"},{ label:"2023",value:"2023"},{ label:"2024",value:"2024"}]}/> */}



            {!location.pathname.includes("view") && <BasicSelect
              itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
              label="Choose Geometric File Type"
              Value={shapeType}
              setValue={(newValue) => {
                // Clear the selected files **before** changing shapeType
                form.setValue("uploadFile", undefined);
                setPreviewMapData(null);
                setShapeType(newValue);
              }} />}

            {!location.pathname.includes("view") && <div className='flex flex-col gap-2 w-full'>
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


          {/* <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/> */}
          <Button className=' w-24' type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default FieldForm;