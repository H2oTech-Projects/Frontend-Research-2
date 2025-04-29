import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet"
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import {  LeafletEvent,FeatureGroup as LeafletFeatureGroup } from "leaflet"
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
  refLayer: React.RefObject<LeafletFeatureGroup<any>>;
  layerCounts?: "single" | "multiple";
}

const FormCoordinatesMap = ({control,name,label,onCreated,onEdited,onDeleted,type, refLayer, layerCounts = "multiple"}:FormCoordinatesMapProps) => {
  return (
         <FormField 
            control={control}
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
            </div>
            
            {layerCounts === "single" && field.value?.length > 1 ? <FormMessage>Only one {type} is allowed</FormMessage> : null}
            <FormMessage/>
          </FormItem>
)}
/>
  )
}

export default FormCoordinatesMap
