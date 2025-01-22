import { MapContainer, TileLayer, useMap, Polygon, Popup } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect } from "react";
import DummyMapData from "../../SMWC_Fields[2].json";
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
            minZoom={3}
            style={{ height: "100%", width: "100%", overflow: "hidden" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {DummyMapData?.features?.map((feature: any) => {
                return (
                    <Polygon
                        key={feature?.properties?.FieldID}
                        positions={feature?.geometry?.coordinates[0]}
                        color="black"
                        fillColor="green"
                        fillOpacity={0.5}
                        weight={5}
                    >
                        <Popup>Click for more information</Popup>
                    </Polygon>
                );
            })}
            <CustomZoomControl />
            <MapHandler />
        </MapContainer>
    );
};

export default LeafletMap;
