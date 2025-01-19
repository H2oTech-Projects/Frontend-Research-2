import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import * as Icon from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import profileImg from "../assets/profile-image.jpg";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { toast } from "react-toastify";
import CustomZoomControl from "../components/MapController";

const Map = () => {
    const position: [number, number] = [36.7783, -119.4179];
    const { theme, setTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
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
        <div className="relative flex h-screen w-full">
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
