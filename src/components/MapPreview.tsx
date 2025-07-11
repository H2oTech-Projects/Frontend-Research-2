import { MapContainer, TileLayer, useMap } from "react-leaflet"
import CustomZoomControl from './MapController'
import Spinner from '@/components/Spinner';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import RtGeoJson from "./RtGeoJson";
const MapPreview = ({ data, isLoading }: {data:any,isLoading:boolean}) => {

  const MapSizeHandler = () => {
    // This component is used to handle the map size when the side menu is collapsed or expanded
    const isMenuCollapsed = useSelector((state: any) => state.sideMenuCollapse.sideMenuCollapse)
    const map = useMap();
    useEffect(() => {
      map?.invalidateSize(); // Force the map to resize
      if (data?.view_bounds) {
        map?.fitBounds(data?.view_bounds);
      }
    }, [data])

    useEffect(() => {
      setTimeout(() => {
        map?.invalidateSize();
      }, 300)
    }, [isMenuCollapsed]);

    return null;
  }

  const geoJsonLayerEvents = (feature: any, layer: any) => {
    // layer.bindPopup(buildPopupMessage(parcelInfo[feature.properties.apn]));
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
          //color: "#800080"
        });
        // showInfo(auxLayer.feature.properties.apn);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          //fillColor: "lightblue",
          fillOpacity: 0,
          opacity: 1,
        });
        // removeInfo(auxLayer.feature.properties.apn);
      },
    })
  };
  return (
    <div className="w-full h-[calc(100vh-228px)] ">
      {isLoading ? (<><MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false} // Disable default zoom control
        minZoom={2}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <div className="absolute top-1/2 left-1/2 right-1/2 z-[800] flex gap-4 -ml-[70px] ">
          <div className="flex  rounded-lg bg-[#16599a] text-slate-50 bg-opacity-65 p-2 text-xl h-auto gap-3 ">Loading <Spinner /></div>
        </div>
        <MapSizeHandler />
        <CustomZoomControl />
      </MapContainer></>) : <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%",borderRadius: "8px" }}
        scrollWheelZoom={true}
        zoomControl={false} // Disable default zoom control
        minZoom={2}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data?.data &&
          <RtGeoJson
            layerEvents={geoJsonLayerEvents}
            data={JSON.parse(data?.data)}
            style={{ fillColor: "transparent", color: "#9370DB", weight: 1.5 }}
            key={data?.view_bounds}
            color="#9370DB" />
        }
        <MapSizeHandler />
        <CustomZoomControl />
      </MapContainer>}
    </div>
  )
}

export default React.memo(MapPreview)
