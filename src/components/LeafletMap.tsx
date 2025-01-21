import { MapContainer, TileLayer, useMap } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect } from "react";

type LeafletMapTypes = {
    position: [number, number];
    collapse: string;
};

const LeafletMap = ({ position, collapse }: LeafletMapTypes) => {
    const MapHandler = () => {
        const map = useMap();

        useEffect(() => {
            map.invalidateSize(); // Force the map to resize
            map.setView(position); // Force the map to recenter
        }, [collapse, position]);

        return null;
    };
    return (
        <MapContainer
            center={position}
            zoom={12}
            scrollWheelZoom={true}
            zoomControl={false} // Disable default zoom control
            minZoom={8}
            style={{ height: "100%", width: "100%", overflow: "hidden" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CustomZoomControl />
            <MapHandler />
        </MapContainer>
    );
};

export default LeafletMap;
