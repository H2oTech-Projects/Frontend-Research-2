import { GeoJSON } from "react-leaflet";
import React, { useEffect, useRef } from "react";
import './mapStyle.css'
type RtGeoJsonTypes = {
  layerEvents: any;
  data: any;
  style: any;
  key: string;
  color: string;
};

const RtGeoJson = ({ layerEvents, data, style, key, color }: RtGeoJsonTypes) => {
const geoJsonRef = useRef<L.GeoJSON>(null);
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.clearLayers(); // Remove old data
    data &&   geoJsonRef.current.addData(data); // Add new data
      geoJsonRef.current.setStyle(style);
    }
  }, [data]); // Re-run effect when `data` changes
  console
  return (
  <GeoJSON
    ref={geoJsonRef}
    key={key}
    pathOptions={{
      fillColor: "transparent",
      fillOpacity: 0,
      opacity: 1,
      weight: 2.5,
    }}
    onEachFeature={layerEvents}
    data={data}
    pane="overlayPane"
    style={style}
    />
  );
};

export default RtGeoJson;