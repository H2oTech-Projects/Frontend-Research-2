import { useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import * as Icon from "lucide-react";

const CustomZoomControl = () => {
    const map = useMap();
    const [zoomLevel, setZoomLevel] = useState(8);
    useMapEvents({
        zoomend: (e) => {
            setZoomLevel(e.target.getZoom());
        },
    });

    const zoomIn = () => {
        map.setZoom(map.getZoom() + 1);
    };

    const zoomOut = () => {
        map.setZoom(map.getZoom() - 1);
    };

    return (
        <div className="absolute bottom-11 right-3 z-[800] flex w-8 flex-col content-center justify-center gap-4 text-black dark:text-white">
            <div className="flex h-8 content-center justify-center rounded-lg bg-slate-400 p-2 text-sm font-bold dark:bg-slate-900">{zoomLevel}</div>
            <div className="flex h-16 w-8 flex-col content-center justify-center rounded-lg bg-slate-400 dark:bg-slate-900">
                <button
                    className="flex items-center justify-center border-b border-black border-opacity-50 pb-1 dark:border-white"
                    onClick={zoomIn}
                    disabled={zoomLevel === 18}
                >
                    <Icon.Plus size={24} />
                </button>
                <button
                    className="flex items-center justify-center pt-1"
                    onClick={zoomOut}
                    disabled={zoomLevel === 5}
                >
                    <Icon.Minus size={24} />
                </button>
            </div>
        </div>
    );
};

const Map = () => {
    const position: [number, number] = [36.7783, -119.4179];

    return (
        <div className="relative flex h-screen w-full">
            <MapContainer
                center={position}
                zoom={8}
                scrollWheelZoom={true}
                zoomControl={false} // Disable default zoom control
                minZoom={5}
                style={{ height: "100%", width: "100vw" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CustomZoomControl />
            </MapContainer>
        </div>
    );
};

export default Map;
