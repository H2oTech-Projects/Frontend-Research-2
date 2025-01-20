import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
const position: [number, number] = [36.7783, -119.4179];

const Map = ({ resize}: { resize?: boolean}) => {
  const ResizeHandler = () => {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize(); // Force the map to resize
    }, [resize]);
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={8}
      scrollWheelZoom={true}
      zoomControl={false} // Disable default zoom control
      minZoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ResizeHandler />
    </MapContainer>
  )
}

export default Map;