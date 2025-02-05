import { MapContainer, TileLayer, useMap, LayersControl } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect } from "react";

type mapConfiguration = {
  minZoom: number;
  containerStyle: {};
};

type LeafletMapTypes = {
    zoom: number;
    position: any;
    collapse?: string;
    clickedField?: string | null;
    configurations?: mapConfiguration;
    children?: any;
    viewBound?: any;
};

const LeafletMap = ({ zoom, position, collapse, clickedField = null, viewBound, configurations = {'minZoom': 11, 'containerStyle': {}}, children }: LeafletMapTypes) => {
  const { center } = position;
  const MapHandler = () => {
    const map = useMap();

    useEffect(() => {
      map.invalidateSize(); // Force the map to resize
      map.setView(center); // Force the map to recenter
      map.fitBounds(viewBound);
      //map.setZoom(zoom);
    }, [collapse, center, zoom, viewBound]);

    return null;
  };

    return (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false} // Disable default zoom control
        minZoom={configurations.minZoom || 6}
        style={configurations.containerStyle || { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" }}
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer
              checked
              name="Satellite"
          >
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
        { children }
        <CustomZoomControl />
        <MapHandler />
      </MapContainer>
    );
};

export default LeafletMap;
