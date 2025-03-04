import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormInput } from '@/components/FormComponent/FormInput'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'

import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { LatLng, LeafletEvent, Layer,FeatureGroup as LeafletFeatureGroup  } from "leaflet"
import FormCoordinatesMap from '@/components/FormComponent/FormCoordinatesMap'
import { string } from 'yup'
import { useRef } from 'react'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  fieldID: z.string().min(5, "FieldID must be at least 5 characters"),
  farmedAcres: z.coerce.number(),
  year: z.string(),
  coordinates: z.array(z.array(
    z.tuple([
      z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    ])
  )).min(1, "At least  coordinate is required").max(1, "Only one polygon is allowed"),
  markers:  z.array(
    z.tuple([
      z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    ])
  ).min(1, "At least  coordinate is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AddField = () => {
  const featureGroupPolygonRef = useRef<LeafletFeatureGroup>(null);
  const featureGroupMarkerRef = useRef<LeafletFeatureGroup>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldID: "",
      year: "",
      farmedAcres: Number(''),
      coordinates: [],
      markers: [],
    },
  });
  const polygons = form.watch("coordinates");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "coordinates",
  });

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

    // Extract marker coordinates from a layer
  const getMarkerCoordinates = (layer: Layer): [number, number] => {
    const latlng = (layer as any).getLatLng() as LatLng;
    return [latlng.lat, latlng.lng];
  };

  // Handle marker creation event
  const onMarkerCreated = (e: LeafletEvent) => {
    const layer = (e as any).layer;
    const newMarker = getMarkerCoordinates(layer);

    // Add new marker to the list
    form.setValue("markers",  [newMarker]);
    form.clearErrors("markers"); // Clear errors on new marker creation
  };

  // Handle marker edit event
  const onMarkerEdited = (e: LeafletEvent) => {
    const layers = (e as any).layers;
    const updatedMarkers: [number, number][] = [];

    layers.eachLayer((layer: Layer) => {
      updatedMarkers.push(getMarkerCoordinates(layer));
    });

    form.setValue("markers", updatedMarkers);
  };

  // Handle marker deletion event
   const onMarkerDeleted = (e: LeafletEvent) => {
    const layers = (e as any).layers;
    if (layers.getLayers().length !== 0) {
      form.setValue("markers", []); // Clear markers on delete
    }
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
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-[calc(100vh-132px)] flex flex-col gap-4'>
         
          <FormInput control={form.control} name='fieldID' label='FieldID' placeholder='Enter FieldID' type='text' />
          <FormInput control={form.control} name='farmedAcres' label='Farmed Acres' placeholder='Enter Farmed Acres' type='number' />
          <FormComboBox control={form.control} name = "year" label= 'Year' options={[{ label:"2022",value:"2022"},{ label:"2023",value:"2023"},{ label:"2024",value:"2024"}]}/>
          <FormCoordinatesMap control={form.control} name="coordinates" label="Polygon Coordinates" onCreated={onPolygonCreated} onEdited={onPolygonEdited} onDeleted={onPolygonDeleted} type="polygon" refLayer={featureGroupPolygonRef} layerCounts='single'/>
          <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/>
          <Button className='mt-4 w-24' type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddField;