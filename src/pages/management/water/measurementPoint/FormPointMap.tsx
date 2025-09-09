import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomZoomControl from "@/components/MapController";
import { useEffect } from "react";
import { useSelector } from "react-redux";

type FormPointMapProps = {
  latitude: number;
  longitude: number;
  onPointChange: (lat: number, lng: number) => void;
};

const FormPointMap = ({ latitude, longitude, onPointChange }: FormPointMapProps) => {
  const isMenuCollapsed = useSelector((state: any) => state.sideMenuCollapse.sideMenuCollapse)

  const MapClickHandler = () => {
      const map = useMap();
    useMapEvents({
      click(e) {
        onPointChange(e.latlng.lat, e.latlng.lng);
      },
    });

    useEffect(() => {
      setTimeout(() => {
        map?.invalidateSize();
      }, 300)
    }, [isMenuCollapsed]);


    return null;
  };

  return (
    <MapContainer
      center={[latitude || 38.86902846413033, longitude || -121.729324818604]} // fallback center
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom={true}
      zoomControl={false}
      minZoom={2}
    >
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {latitude && longitude && (
        <Marker position={[latitude, longitude]} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })} />
      )}

      <MapClickHandler />
      <CustomZoomControl />
    </MapContainer>
  );
};

export default FormPointMap;