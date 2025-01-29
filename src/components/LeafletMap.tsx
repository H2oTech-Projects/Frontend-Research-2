import { MapContainer, TileLayer, useMap, Polygon, Popup, GeoJSON, LayersControl } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect } from "react";

type mapConfiguration = {
  minZoom: number;
  containerStyle: {};
};

type LeafletMapTypes = {
    zoom: number;
    position: any;
    collapse: string;
    geojson: any;
    clickedField?: string | null;
    configurations?: mapConfiguration;
};

const LeafletMap = ({ zoom, position, collapse, geojson, clickedField = null, configurations = {}, children }: LeafletMapTypes) => {
    const { center } = position;
    const MapHandler = () => {
        const map = useMap();

        useEffect(() => {
            map.invalidateSize(); // Force the map to resize
            map.setView(center); // Force the map to recenter
            //map.setZoom(zoom);
        }, [collapse, center, zoom]);

        return null;
    };

    return (
        <MapContainer
            center={center}
            zoom={14}
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
