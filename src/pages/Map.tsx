import { useEffect, useRef, useState } from "react";
import { TileLayer } from "react-leaflet";
import { Feature } from "geojson";
import L from "leaflet";
import * as Icon from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import profileImg from "../assets/profile-image.jpg";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { toast } from "react-toastify";
import irrigatedFields from "../geojson/Irrigated_Fields.json";
import nonIrrigatedFields from "../geojson/NonIrrigated_Fields.json";
import $ from "jquery";
import { Button } from "@/components/ui/button";
import LeafletMap from "@/components/LeafletMap";
import RtGeoJson from "@/components/RtGeoJson";

const Map = () => {
    const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "" });
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
        class: "absolute top-2 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65",
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

  const geoJsonLayerEvents = (feature: Feature, layer: L.Layer) => {
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
            fillOpacity: 0,
            opacity: 1,
        });
        removeInfo(auxLayer.feature.properties.FieldID);
      },
    });
  }

  const irrigatedgeoJsonStyle = (features: Feature) => {
    return {
      color: "#16599A", // Border color
      fillColor: "lightblue", // Fill color for normal areas
      fillOpacity: 0.5,
      weight: 2,
    };
  }

  const nonIrrigatedgeoJsonStyle = (features: Feature) => {
    return {
      color: "red", // Border color
      fillColor: "red", // Fill color for normal areas
      fillOpacity: 0.5,
      weight: 2,
    };
  }
  return (
    <div id="map" className="relative flex h-screen w-full">
      <div className="absolute right-4 top-0 z-[800] flex h-[3.75rem] items-center gap-x-3">
        <Button
            variant={"default"}
            className="size-8"
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
        </Button>
        <Button
          variant={"default"}
          className="size-8">
          <Icon.Bell size={20} />
        </Button>
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

      <LeafletMap position={position} zoom={11} configurations={{'minZoom': 11, 'containerStyle': { height: "100%", width: "100vw" }}}>
        <RtGeoJson key={'irrigated'} layerEvents={geoJsonLayerEvents} style={irrigatedgeoJsonStyle} data={irrigatedFields}/>
        <RtGeoJson key={'nonirrigated'} layerEvents={geoJsonLayerEvents} style={nonIrrigatedgeoJsonStyle} data={nonIrrigatedFields} />
      </LeafletMap>
    </div>
  );
};

export default Map;
