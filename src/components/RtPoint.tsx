import React from "react";
import { Polygon, CircleMarker, Popup } from "react-leaflet";

type RtTypes = {
  position: any;
  children: any;
};

const RtPoint = ({ position, children }: RtTypes) => {
  console.log(position, 'ganayo')
    return (
      <CircleMarker
        center={position}
        radius={10}  // size of the circle in pixels
        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
      >
        <Popup>
          This is the CircleMarker for your PointField!
        </Popup>
      </CircleMarker>
    );
};

export default RtPoint;
