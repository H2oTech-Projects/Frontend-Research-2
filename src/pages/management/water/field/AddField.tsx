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
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { LatLng, LeafletEvent, Layer,FeatureGroup as LeafletFeatureGroup  } from "leaflet"
import FormCoordinatesMap from '@/components/FormComponent/FormCoordinatesMap'
import { useRef } from 'react'
import { FormTextbox } from '@/components/FormComponent/FormTextbox'
import { FormRadioGroup } from '@/components/FormComponent/FormRadio'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  fieldName: z.string().min(5, "Field Name must be at least 5 characters"),
  field_desc: z.string().optional(),
  field_cmnt: z.string().optional(),
  IrrigAcres: z.coerce.number(),
  StandbyAcres: z.coerce.number().optional(),
  ActiveFlag: z.string().optional(),
  MsmtMethod: z.string().min(1, "Measurement Method is required"),
  MsmtMethodDesc: z.string().optional(),
  coordinates: z.array(z.array(
    z.tuple([
      z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    ])
  )).min(1, "At least  coordinate is required"),
  // markers:  z.array(
  //   z.tuple([
  //     z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  //     z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  //   ])
  // ).min(1, "At least  coordinate is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AddField = () => {
  const featureGroupPolygonRef = useRef<LeafletFeatureGroup>(null);
  const featureGroupMarkerRef = useRef<LeafletFeatureGroup>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: "",
      IrrigAcres: Number(''),
      StandbyAcres: Number(''),
      ActiveFlag: "true",
      MsmtMethod: "",
      MsmtMethodDesc: "",
      field_desc: "",
      field_cmnt: "",
      coordinates: [],
      // markers: [],
    },
  });
  const polygons = form.watch("coordinates");
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "coordinates",
  // });

  // Helper function to extract coordinates from a polygon layer
  const getPolygonCoordinates = (layer: Layer): [number, number][] => {
    const latlngs = (layer as any).getLatLngs()[0] as LatLng[];
    return latlngs.map((latlng) => [latlng.lat, latlng.lng]);
  };

  // Handle polygon creation event
  const onPolygonCreated = (e: LeafletEvent) => {

    const layer = (e as any).layer;
    const formattedCoords = getPolygonCoordinates(layer);
  
    form.setValue("coordinates", [...polygons, formattedCoords]);
    form.clearErrors("coordinates");

  };

  // Handle polygon edit event
  const onPolygonEdited = (e: LeafletEvent) => {
    const updatedPolygons: [number, number][][] = [];
    featureGroupPolygonRef.current?.eachLayer((layer: Layer) => {
      updatedPolygons.push(getPolygonCoordinates(layer));});
    form.setValue("coordinates", updatedPolygons);
  };

  // Handle polygon deletion event
const onPolygonDeleted = (e: LeafletEvent) => {
    const remainingPolygons: [number, number][][] = [];
    featureGroupPolygonRef.current?.eachLayer((layer: Layer) => {
      remainingPolygons.push(getPolygonCoordinates(layer));});
    form.setValue("coordinates", remainingPolygons);
  };

  



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
         <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='flex flex-col gap-2'>
          <FormInput control={form.control} name='fieldName' label='Field Name' placeholder='Enter Field Name' type='text' />
          <div className='grid grid-cols-2 gap-4'>
           <FormInput control={form.control} name='IrrigAcres' label='Irrigable Acres' placeholder='Enter Irrigable  Acres' type='number' />
          <FormInput control={form.control} name='StandbyAcres' label='Stand By Acres' placeholder='Enter Stand By  Acres' type='number' />
          </div>
          <FormTextbox control={form.control} name='field_desc' label='Field Description' placeholder='Enter Field Description'  />
          <FormTextbox control={form.control} name='field_cmnt' label='Comments' placeholder='Comments...'  />
          <div className='grid grid-cols-2 gap-4'>
          <FormComboBox control={form.control} name='MsmtMethod' label='Measurement Method' options={[{ label: "GPS", value: "GPS" }, { label: "Survey", value: "Survey" }, { label: "Aerial", value: "Aerial" }]} />
          <FormRadioGroup control={form.control} name='ActiveFlag' label='Active status' options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} />
          </div>
          <FormTextbox control={form.control} name='MsmtMethodDesc' label='Measurement Method Description' placeholder='Enter Measurement Method Description'  />
 {/* <FormComboBox control={form.control} name = "year" label= 'Year' options={[{ label:"2022",value:"2022"},{ label:"2023",value:"2023"},{ label:"2024",value:"2024"}]}/> */}      
          </div>
          <div> 
             <FormCoordinatesMap form={form} name="coordinates" label="Polygon Coordinates"  type="polygon" refLayer={featureGroupPolygonRef} layerCounts='multiple'/>
          </div>
         </div>
         
          {/* <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/> */}
          <Button className=' w-24' type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddField;