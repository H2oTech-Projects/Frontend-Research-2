import { useState } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents } from "react-leaflet";
function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(e: any) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}
const Map = () => {
    const position: [number, number] = [36.7783, -119.4179];

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={position}
                zoom={8}
                scrollWheelZoom={true}
                zoomControl={false}
                style={{ height: "100%", width: "100vw" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <LocationMarker /> */}
            </MapContainer>
        </div>
    );
};

export default Map;
