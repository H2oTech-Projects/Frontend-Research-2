import { CircleMarker } from "react-leaflet";
import L from "leaflet";
type RtTypes = {
  position: any;
  children?: any;
  handleMouseDown: any;
  cancel: any;
};
import LightLogo from "../assets/msmtPoint.png";

const Icon = new L.Icon({
  iconUrl: LightLogo, // your water+valve image
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const RtPoint = ({ position, children,  handleMouseDown, cancel}: RtTypes) => {
    return (
      <CircleMarker
        center={position}
        radius={10}  // size of the circle in pixels
        pathOptions={{ color: 'white', fillColor: 'blue', fillOpacity: 1 }}
        eventHandlers={{
          mousedown: handleMouseDown,
          mouseup: cancel,
        }}
      >
        {children}
      </CircleMarker>
    );
};

export default RtPoint;
