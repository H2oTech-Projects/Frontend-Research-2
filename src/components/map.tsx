import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, GeoJSON } from "react-leaflet";
import seg from "./seg.json";
import {CRS} from 'leaflet';
const position: [number, number] = [36.7783, -119.4179];

const Map = ({ resize, geojson}: { resize?: boolean, geojson?: any}) => {
  const ResizeHandler = () => {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize(); // Force the map to resize
    }, [resize]);
    return null;
  };

  const setColor = ({ properties: any }) => {
    return { weight: 5, color: 'red' };
  };
  debugger
  return (
    <MapContainer
      center={position}
      zoom={8}
      scrollWheelZoom={true}
      zoomControl={false} // Disable default zoom control
      minZoom={2}
      style={{ height: "100%", width: "100%" }}
      //crs={CRS.EPSG4326}
    >
      <GeoJSON data={seg} style={setColor} />
      <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ResizeHandler />
    </MapContainer>
  )
}

export default Map;