import { ChevronsLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../../utils/cn";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import CustomZoomControl from "../../../../components/MapController";

const Field = () => {
    const ResizeHandler = () => {
        const map = useMap();

        useEffect(() => {
            map.invalidateSize(); // Force the map to resize
        }, [collapse]);

        return null;
    };
    const [collapse, setCollapse] = useState("default");
    const [width, setWidth] = useState("612");
    const position: [number, number] = [36.7783, -119.4179];
    const tableCollapseBtn = () => {
        collapse === "default" ? setCollapse("table") : setCollapse("default");
        setWidth("1248");
    };
    const mapCollapseBtn = () => {
        collapse === "default" ? setCollapse("map") : setCollapse("default");
        setWidth("612");
    };
    return (
        <div className="flex h-full flex-col gap-1 px-6 py-3">
            <div className="flex gap-1 text-xs">
                <Link to="">Home</Link>/<span>Field</span>
            </div>
            <div className="pageTitle text-lg font-normal text-black">Field</div>
            <div className="pageContain flex flex-grow flex-col gap-3">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <div className="search">
                            <input type="text" />
                        </div>
                        <button>Filter</button>
                    </div>
                    <button>Add Field</button>
                </div>
                <div className="flex flex-grow">
                    <div className={cn("tableContainer w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
                        <div className="relative table h-full w-full bg-slate-500">
                            <button
                                className="absolute -right-4 top-1/2 m-2 flex size-10 h-6 w-6 items-center justify-center rounded-full bg-blue-400"
                                onClick={tableCollapseBtn}
                            >
                                <ChevronsLeft size={20} />
                            </button>
                        </div>
                    </div>
                    <div className={cn("mapContainer w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3")}>
                        <div className="relative flex h-[558px] w-full bg-slate-500">
                            <MapContainer
                                center={position}
                                zoom={12}
                                scrollWheelZoom={true}
                                zoomControl={false} // Disable default zoom control
                                minZoom={5}
                                style={{ height: "100%", width: "100%", overflow: "hidden" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <CustomZoomControl />
                                <ResizeHandler />
                            </MapContainer>
                            <button
                                className="absolute -left-4 top-1/2 z-[800] m-2 flex size-10 h-6 w-6 items-center justify-center rounded-full bg-blue-400"
                                onClick={mapCollapseBtn}
                            >
                                <ChevronsLeft
                                    size={20}
                                    className="rotate-180"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Field;
