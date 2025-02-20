import { GeoJSON } from "react-leaflet";
import { useEffect, useRef } from "react";
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
      geoJsonRef.current.addData(data); // Add new data
      geoJsonRef.current.setStyle({
        fillColor: "transparent",
        color: color,
        weight: 1.5,
      });
    }
  }, [data]); // Re-run effect when `data` changes

  return (
  <GeoJSON
    ref={geoJsonRef}
    key={key}
    pathOptions={{
      //color: "#9370DB",
      //fillColor: "lightblue",
      fillOpacity: 0,
      opacity: 1,
      weight: 2.5,
    }}
    onEachFeature={layerEvents}
    data={data}
    style={style}
    />
  );
};

export default RtGeoJson;