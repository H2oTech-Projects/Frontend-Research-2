import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet"
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { LatLng, LeafletEvent, Layer,FeatureGroup as LeafletFeatureGroup } from "leaflet"
import { EditControl } from "react-leaflet-draw"
import { UseFormReturn } from "react-hook-form";
type FormCoordinatesMapProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  type: "marker"|"polygon"|"polyline";
  refLayer: React.RefObject<LeafletFeatureGroup<any>>;
  layerCounts?: "single" | "multiple";
}

const FormCoordinatesMap = ({
  form,
  name,
  label,
  type,
  refLayer,
  layerCounts = "multiple"
  }:FormCoordinatesMapProps) => {
  const polyline = form.watch(`${name}`) || [];
  // Helper function to extract coordinates from a polygon layer
  const getCoordinates = (layer: Layer): [number, number][] => {
    const latlngs = (layer as any).getLatLngs();
    const flattened = latlngs.flat(Infinity) as LatLng[];
    return flattened.map((latlng) => [latlng.lat, latlng.lng]);
  };

  // Handle polygon creation event
  const onPolygonCreated = (e: LeafletEvent) => {
    const layer = (e as any).layer;
    const formattedCoords = getCoordinates(layer);
    form.setValue(name, [...polyline, formattedCoords]);
    form.clearErrors(name);
  };

  // Handle polygon edit event
  const onPolygonEdited = (e: LeafletEvent) => {
    const updatedPolygons: [number, number][][] = [];
    refLayer.current?.eachLayer((layer: Layer) => {
      updatedPolygons.push(getCoordinates(layer));});
    form.setValue(name, updatedPolygons);
  };

  // Handle polygon deletion event
  const onPolygonDeleted = (e: LeafletEvent) => {
    const remainingPolygons: [number, number][][] = [];
    refLayer.current?.eachLayer((layer: Layer) => {
      remainingPolygons.push(getCoordinates(layer));});
    form.setValue(name, remainingPolygons);
  };

  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem>
        <FormLabel>{label}</FormLabel>
        <div className="w-full h-[calc(100vh-228px)] ">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }} >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FeatureGroup ref={refLayer} >
            <EditControl
              position="topright"
              onCreated={onPolygonCreated}
              onEdited={onPolygonEdited}
              onDeleted={onPolygonDeleted}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                polyline: type==="polyline",
                polygon: type==="polygon",
                marker: type==="marker"
              }}
            />
          </FeatureGroup>
        </MapContainer>
        </div>
        {layerCounts === "single" && field.value?.length > 1 ? <FormMessage>Only one {type} is allowed</FormMessage> : null}
        <FormMessage/>
        </FormItem>
      )}
    />
  )
}

export default FormCoordinatesMap
