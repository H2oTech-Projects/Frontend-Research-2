import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, LayersControl, GeoJSON } from "react-leaflet";
import * as Icon from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import profileImg from "../assets/profile-image.jpg";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { toast } from "react-toastify";
import CustomZoomControl from "../components/MapController";
import swmcFields from "../geojson/SMWC_Fields.json";
import $ from "jquery";
const Map = () => {
    const position: [number, number] = [38.86902846413033, -121.729324818604];
    const { theme, setTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const layers = [
        {
            name: "Satellite",
            layer: (
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
                />
            ),
        },
        {
            name: "Street Map",
            layer: (
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            ),
        },
    ];

    const showInfo = (Id: String) => {
        var popup = $("<div></div>", {
            id: "popup-" + Id,
            css: {
                position: "absolute",
                height: "50px",
                width: "150px",
                top: "5px",
                left: "5px",
                zIndex: 1002,
                backgroundColor: "white",
                //padding: "200px",
                border: "1px solid #ccc",
            },
        });
        // Insert a headline into that popup
        var hed = $("<div></div>", {
            text: "FieldID: " + Id,
            css: { fontSize: "16px", marginBottom: "3px" },
        }).appendTo(popup);
        // Add the popup to the map
        popup.appendTo("#map");
    };

    const removeInfo = (Id: String) => {
        $("#popup-" + Id).remove();
    };
    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div
            id="map"
            className="relative flex h-screen w-full"
        >
            <div className="absolute right-4 top-0 z-[800] flex h-[3.75rem] items-center gap-x-3">
                <button
                    className="btn-map size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Icon.Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Icon.Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="btn-map size-10">
                    <Icon.Bell size={20} />
                </button>
                <button
                    className="size-10 overflow-hidden rounded-full"
                    onClick={() => setIsModalOpen(!isModalOpen)}
                >
                    <img
                        src={profileImg}
                        alt="profile image"
                        className="size-full object-cover"
                    />
                </button>
            </div>
            {isModalOpen && (
                <div
                    ref={modalRef}
                    className="absolute right-3 top-14 z-[800] mt-2 flex w-52 flex-col gap-1 rounded-xl border-slate-900 bg-white p-1 shadow-lg dark:bg-slate-900 dark:text-slate-50"
                >
                    <button
                        className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-950"
                        onClick={() => {
                            dispatch(logout());
                            setIsModalOpen(false);
                            toast.success("Logout successful");
                        }}
                    >
                        <Icon.LogOut size={20} />
                        Logout
                    </button>
                </div>
            )}
            <MapContainer
                center={position}
                zoom={10}
                scrollWheelZoom={true}
                zoomControl={false} // Disable default zoom control
                minZoom={2}
                style={{ height: "100%", width: "100vw" }}
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

                <GeoJSON
                    pathOptions={{
                        //color: "#9370DB",
                        //fillColor: "lightblue",
                        fillOpacity: 0,
                        opacity: 1,
                        weight: 2.5,
                    }}
                    onEachFeature={(feature, layer) => {
                        layer.on({
                            mouseover: function (e) {
                                const auxLayer = e.target;
                                auxLayer.setStyle({
                                    weight: 4,
                                    //color: "#800080"
                                });
                                showInfo(auxLayer.feature.properties.FieldID);
                            },
                            mouseout: function (e) {
                                const auxLayer = e.target;
                                auxLayer.setStyle({
                                    weight: 2.5,
                                    //color: "#9370DB",
                                    //fillColor: "lightblue",
                                    fillOpacity: 0,
                                    opacity: 1,
                                });
                                removeInfo(auxLayer.feature.properties.FieldID);
                            },
                        });
                    }}
                    style={(features) => {
                        return {
                            color: "#16599A", // Border color
                            fillColor: "lightblue", // Fill color for normal areas
                            fillOpacity: 0.5,
                            weight: 2,
                        };
                    }}
                    data={swmcFields as any}
                />
                <CustomZoomControl />
            </MapContainer>
        </div>
    );
};

export default Map;
