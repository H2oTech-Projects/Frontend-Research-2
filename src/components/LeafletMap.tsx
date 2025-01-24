import { MapContainer, TileLayer, useMap, Polygon, Popup, GeoJSON } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect, useMemo } from "react";
import L, { divIcon } from "leaflet";
import $ from "jquery";

type LeafletMapTypes = {
    zoom: number,
    position: any;
    collapse: string;
    geojson: any
};

const LeafletMap = ({ zoom, position, collapse, geojson }: LeafletMapTypes) => {
    const {center} = position;
    console.log(position);
    const MapHandler = () => {
        const map = useMap();

        useEffect(() => {
            map.invalidateSize(); // Force the map to resize
            map.setView(center); // Force the map to recenter
            map.setZoom(zoom);
        }, [collapse, center, zoom]);

        return null;
    };

    const polygonEventHandlers = useMemo(
      () => ({
        mouseover(e: any) {
          const { id } = e.target.options;
          showInfo(id);
        },
        mouseout(e: any) {
          const { id } = e.target.options;
          removeInfo(id);
        }
      }),
      []
    );

    const showInfo = (Id: String) => {
      var popup = $("<div></div>", {
        id: "popup-" + Id,
        css: {
            position: "absolute",
            height: "50px",
            width: "150px",
            top: "0px",
            left: "0px",
            zIndex: 1002,
            backgroundColor: "white",
            //padding: "200px",
            border: "1px solid #ccc"
        }
      });
      // Insert a headline into that popup
      var hed = $("<div></div>", {
          text: "FieldID: " + Id,
          css: {fontSize: "16px", marginBottom: "3px"}
      }).appendTo(popup);
      // Add the popup to the map
      popup.appendTo("#map");
    }

    const removeInfo = (Id: String) => {
      $("#popup-" + Id).remove();
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom || 10}
            scrollWheelZoom={true}
            zoomControl={false} // Disable default zoom control
            minZoom={6}
            style={{ height: "100%", width: "100%", overflow: "hidden" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
              <GeoJSON
                pathOptions={{
                  //color: "#9370DB",
                  //fillColor: "lightblue",
                  fillOpacity: 0,
                  opacity: 1,
                  weight: 2.5
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
                        dashArray: "",
                        fillOpacity: 0,
                        opacity: 1
                      });
                      removeInfo(auxLayer.feature.properties.FieldID)
                    }

                  });
                }}
                data={geojson}
              />
            }
            {!!position.polygon ?
              <Polygon
                pathOptions={{id: position.fieldId} as Object}
                positions={position.polygon}
                color={'red'}
                eventHandlers={polygonEventHandlers as L.LeafletEventHandlerFnMap}
                /> :
              null}
            <CustomZoomControl />
            <MapHandler />
        </MapContainer>
    );
};

export default LeafletMap;
