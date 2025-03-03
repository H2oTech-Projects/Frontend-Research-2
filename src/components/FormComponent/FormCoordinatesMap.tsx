import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet"
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import {  LeafletEvent } from "leaflet"
import { EditControl } from "react-leaflet-draw"
import { Control } from "react-hook-form";
type FormCoordinatesMapProps = {
  control: Control<any>;
  name: string;
  label: string;
  onCreated: (e:LeafletEvent)=>void;
  onEdited: (e:LeafletEvent)=>void;
  onDeleted: (e:LeafletEvent)=>void;
  type:"marker"|"polygon"|"polyline";
}

const FormCoordinatesMap = ({control,name,label,onCreated,onEdited,onDeleted,type}:FormCoordinatesMapProps) => {
  return (
         <FormField 
          control={control}
            name={name}  
            render={({ field }) => (
            <FormItem>
            <FormLabel>{label}</FormLabel>
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "400px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={onCreated}
                  onEdited={onEdited} 
                  onDeleted={onDeleted} 
                  draw={{
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    polyline: type==="polyline" ? true : false,
                    polygon: type==="polygon" ? true : false,
                    marker: type==="marker" ? true : false, 
                  }}
                />
              </FeatureGroup>
            </MapContainer>
            <FormMessage/>
          </FormItem>
)}
/>
  )
}

export default FormCoordinatesMap
