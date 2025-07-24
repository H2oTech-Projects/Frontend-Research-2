import { FeatureGroup, MapContainer, Marker, Polygon, Polyline, TileLayer, useMap } from "react-leaflet"
import CustomZoomControl from './MapController'
import Spinner from '@/components/Spinner';
import L, { LatLng, LeafletEvent, Layer,FeatureGroup as LeafletFeatureGroup,LatLngTuple } from "leaflet"
import { EditControl } from "react-leaflet-draw"
import { useSelector } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import RtGeoJson from "./RtGeoJson";
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

const FieldMapPreview = ({ data, isLoading }: any) => {
  const refLayer = useRef<LeafletFeatureGroup>(null);
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

  const getCoordinates = (layer: Layer): [number, number][] => {
    const latlngs = (layer as any).getLatLngs();
    const flattened = latlngs.flat(Infinity) as LatLng[];
    return flattened.map((latlng) => [latlng.lat, latlng.lng]);
  };

  // Handle polygon creation event
  const onPolygonCreated = (e: LeafletEvent) => {
    const layer = (e as any).layer;
    const formattedCoords = getCoordinates(layer);

  };

  // Handle polygon edit event
  const onPolygonEdited = (e: LeafletEvent) => {
    const updatedPolygons: [number, number][][] = [];
    refLayer.current?.eachLayer((layer: Layer) => {
      updatedPolygons.push(getCoordinates(layer));});
  };

  // Handle polygon deletion event
  const onPolygonDeleted = (e: LeafletEvent) => {
    const remainingPolygons: [number, number][][] = [];
    refLayer.current?.eachLayer((layer: Layer) => {
      remainingPolygons.push(getCoordinates(layer));});
  };

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
  console.log(data)
  return (
    <div className="w-full h-[calc(100vh-228px)] ">
      {isLoading || !data || !refLayer ? (<><MapContainer
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
          <FeatureGroup ref={refLayer}>
              <EditControl
                position="topright"
                onCreated={onPolygonCreated}
                onEdited={onPolygonEdited}
                onDeleted={onPolygonDeleted}
                draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  polygon: true,
                }}
                edit= {{
                  remove: false
              }}
              />
              <Polygon positions={data.coordinates} />
            </FeatureGroup>
        <MapSizeHandler />
        <CustomZoomControl />
      </MapContainer>}
    </div>
  )
}

export default React.memo(FieldMapPreview)
