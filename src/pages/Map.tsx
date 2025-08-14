import { useEffect, useRef, useState } from "react";
import { TileLayer } from "react-leaflet";
import { Feature } from "geojson";
import L from "leaflet";
import * as Icon from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import profileImg from "../assets/profile-image.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { toast } from "react-toastify";
import irrigatedFields from "../geojson/Irrigated_Fields.json";
import nonIrrigatedFields from "../geojson/NonIrrigated_Fields.json";
import rt30_data from "../../rt30_data.json"
import parcelsData from "../../parcels.json"
import { buildPopupMessage } from "@/utils/map";
import $ from "jquery";
import { Button } from "@/components/ui/button";
import LeafletMap from "@/components/LeafletMap";
import RtGeoJson from "@/components/RtGeoJson";
import { usePostLogoutUser } from "@/services/registration";
import { showErrorToast } from "@/utils/tools";
import TableLineChartInfo, {ColusaTableLineChartInfo} from '@/utils/tableLineChartInfo';
import { createRoot } from 'react-dom/client';
import { useGetParcelListByWAY, useGetParcelMapByWAY } from "@/services/water/parcel";
// const popupDiv = document.createElement('div');
// popupDiv.id = 'chart-popup';
// popupDiv.style.width = '500px';
// popupDiv.style.height = '500px';
const Map = () => {
    const { mutate, isPending, isError, error, isSuccess, data } = usePostLogoutUser();
    const loggedUser = JSON.parse(localStorage.getItem("auth") as string)?.user
    const refreshToken = useSelector((state: any) => state.auth.refresh);
    const [position, setPosition] = useState<any>({ center: [36.92380329553985, -120.2151157309385], polygon: [], fieldId: "" });
    const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetParcelMapByWAY(12);
    const parcels: any = parcelsData as any;
    const { theme, setTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const handleLogout = () => {
          mutate({refresh_token: refreshToken},{
            onSuccess: (data) => {
              dispatch(logout());
              setIsModalOpen(false);
              toast.success("Logout successful");
            },
            onError: (err) => {
               showErrorToast(err?.response?.data.message)
            },

    })}
    const showInfo = (label: String, Id: String) => {
      var popup = $("<div></div>", {
        id: "popup-" + Id,
        class: "absolute top-14 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50",
      });
      // Insert a headline into that popup
      var hed = $("<div></div>", {
        text: `${label}: XXX-XXX-XXX` ,
        // text: `${label}: ` + Id,
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
        showInfo('FieldID', auxLayer.feature.properties.FieldID);
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

  const maderaLayerEvents = (feature: Feature, layer: L.Layer) => {
    const popupDiv = document.createElement('div');
    popupDiv.className = 'popup-map ';
    // @ts-ignore
    popupDiv.style = "width:100%; height:100%; border-radius:8px; overflow:hidden";
    popupDiv.id = feature.properties?.apn;
    layer.bindPopup(popupDiv,{maxHeight:1000, maxWidth:700});

    layer.on({
      mouseover: function (e) {
        const auxLayer = e.target;
        auxLayer.setStyle({
            weight: 4,
            //color: "#800080"
        });

        createRoot(popupDiv).render(<TableLineChartInfo data={{'tableInfo': parcels[auxLayer.feature.properties.apn], 'chartInfo': []}}/>);
        showInfo('Parcel Id', auxLayer.feature.properties.apn);
      },
      mouseout: function (e) {
        const auxLayer = e.target;
        auxLayer.setStyle({
            weight: 2.5,
            fillOpacity: 0,
            opacity: 1,
        });
        removeInfo(auxLayer.feature.properties.apn);
      },
    });
  }

  const colusaLayerEvents = (feature: Feature, layer: L.Layer) => {
    const popupDiv = document.createElement('div');
    popupDiv.className = 'popup-map ';
    // @ts-ignore
    popupDiv.style = "width:100%; height:100%; border-radius:8px; overflow:hidden";
    popupDiv.id = feature.properties?.apn;
    layer.bindPopup(popupDiv,{maxHeight:1000, maxWidth:700});

    layer.on({
      mouseover: function (e) {
        const auxLayer = e.target;
        auxLayer.setStyle({
            weight: 4,
            //color: "#800080"
        });

        createRoot(popupDiv).render(<ColusaTableLineChartInfo data={{'tableInfo': parcels[auxLayer.feature.properties.apn], 'chartInfo': []}}/>);
        showInfo('Parcel Id', auxLayer.feature.properties.apn);
      },
      mouseout: function (e) {
        const auxLayer = e.target;
        auxLayer.setStyle({
            weight: 2.5,
            fillOpacity: 0,
            opacity: 1,
        });
        removeInfo(auxLayer.feature.properties.apn);
      },
    });
  }

  const irrigatedgeoJsonStyle = (features: Feature) => {
    return {
      color: "#16599A", // Border color
      fillColor: "transparent", // Fill color for normal areas
      fillOpacity: 0.5,
      weight: 2,
    };
  }

  const maderaJsonStyle = (features: Feature) => {
    return {
      color: "#16599A", // Border color
      fillColor: "transparent", // Fill color for normal areas
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

  const showMapGeojson = () => {
    if (loggedUser == 'colusa@wateraccounts.com') {
      return mapLoading ? "" : <RtGeoJson key={'50003'} layerEvents={colusaLayerEvents} style={maderaJsonStyle} data={JSON.parse(mapData['data'])} color={"#16599a"}/>
    }
    return <RtGeoJson key={'50003'} layerEvents={maderaLayerEvents} style={maderaJsonStyle} data={rt30_data} color={"#16599a"}/>
  }

  let viewBound = loggedUser == 'colusa@wateraccounts.com' ? [[38.92390769485239, -122.45505718324472], [39.7991536823128, -121.79550745742236]] : [[36.76607448393658,-120.54487255571125],[37.183858352296326,-119.71052800353432]]
  debugger
  return (
    <div id="map" className="relative flex h-screen w-full">
       <div className="absolute right-4 top-0 flex h-[3.75rem] w-full justify-between  items-center gap-x-3 align-middle">
        <div className="flex items-center gap-x-3 justify-center text-white bg-royalBlue  ml-6 rounded-lg px-2  h-[32px] z-[450]">
          <Icon.Search
            size={20}
            className="text-slate-300"

          />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search ..."
            className="w-full bg-transparent text-xs text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
            autoComplete="off"
          />
        </div>
        <div className="flex items-center gap-x-3 z-[450]" >
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
          </button></div>
      </div>

      {isModalOpen && (
        <div
          ref={modalRef}
          className="absolute right-3 top-14 z-[9000] mt-2 flex w-52 flex-col gap-1 rounded-xl border-slate-900 bg-white p-1 shadow-lg dark:bg-slate-900 dark:text-slate-50"
        >
        <button
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-950"
            disabled={isPending}
            onClick={handleLogout}
        >
          <Icon.LogOut size={20} />
          Logout
        </button>
          </div>
      )}

      <LeafletMap position={position} viewBound={viewBound} zoom={11} configurations={{'minZoom': 10, 'containerStyle': { height: "100%", width: "100vw" }, enableLayers: true}}>
        {/* <RtGeoJson key={'irrigated'} layerEvents={geoJsonLayerEvents} style={irrigatedgeoJsonStyle} data={irrigatedFields} color={"#16599a"}/>
        <RtGeoJson key={'nonirrigated'} layerEvents={geoJsonLayerEvents} style={nonIrrigatedgeoJsonStyle} data={nonIrrigatedFields} color={"red"}/> */}
        {showMapGeojson()}
      </LeafletMap>
    </div>
  );
};

export default Map;
