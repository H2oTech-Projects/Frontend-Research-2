import React from "react";
import { Polygon, CircleMarker, Popup, Marker } from "react-leaflet";
import L from "leaflet";
type RtTypes = {
  position: any;
  children: any;
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
      <Marker
        position={position}
        //radius={10}  // size of the circle in pixels
        //pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
        eventHandlers={{
          mousedown: handleMouseDown,
          mouseup: cancel,
        }}
        icon={Icon}
      >
        {children}
      </Marker>
    );
};

export default RtPoint;
