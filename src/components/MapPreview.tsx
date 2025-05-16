import { MapContainer, Marker, Polygon, Polyline, TileLayer, GeoJSON, useMap } from "react-leaflet"
import CustomZoomControl from './MapController'
import { buildPopupMessage } from '@/utils/map';
import { useSelector } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { set } from 'date-fns';
import { GeoJSON as LeafletGeoJSON } from "leaflet";
const MapPreview = (data: any) => {
 const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const MapSizeHandler = () => {
    // This component is used to handle the map size when the side menu is collapsed or expanded
    const isMenuCollapsed = useSelector((state: any) => state.sideMenuCollapse.sideMenuCollapse)
    const map = useMap();
   
    useEffect(() => {
        
         map?.invalidateSize(); // Force the map to resize
        map?.setView(data?.data?.view_bounds[0]); // Force the map to recenter
      if (data?.view_bounds) {
        map?.fitBounds(data?.data?.view_bounds);
      }
    }, [data])

    useEffect(() => {
      setTimeout(() => {
        map?.invalidateSize();
      }, 300)
    }, [isMenuCollapsed]);

    return null;
  }

  useEffect(() => {
  if (geoJsonLayerRef.current) {
    geoJsonLayerRef.current.clearLayers(); // Clear existing
    geoJsonLayerRef.current.addData(JSON.parse(data?.data?.data)); // Add new
  }
}, [data?.data?.data]);
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
    <div className="w-full h-[calc(100vh-228px)]">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false} // Disable default zoom control
        minZoom={2}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          ref={geoJsonLayerRef}
          pathOptions={{
            //color: "#9370DB",
            //fillColor: "lightblue",
            fillOpacity: 0,
            opacity: 1,
            weight: 2.5,
          }}
          onEachFeature={geoJsonLayerEvents}
          data={JSON.parse(data?.data?.data)}
        />
        <MapSizeHandler />
        <CustomZoomControl />
      </MapContainer>
    </div>
  )
}

export default React.memo(MapPreview)
