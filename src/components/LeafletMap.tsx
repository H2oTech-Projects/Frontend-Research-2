import { MapContainer, TileLayer, useMap, Polygon, Popup, GeoJSON } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect } from "react";
import L, { divIcon } from "leaflet";
import $ from "jquery";

type LeafletMapTypes = {
    zoom: number;
    position: [number, number];
    collapse: string;
    geojson: any;
    clickedField?: string | null;
};

const LeafletMap = ({ zoom, position, collapse, geojson, clickedField = null }: LeafletMapTypes) => {
    const MapHandler = () => {
        const map = useMap();

        useEffect(() => {
            map.invalidateSize(); // Force the map to resize
            map.setView(position); // Force the map to recenter
            map.setZoom(zoom);
        }, [collapse, position, zoom]);

        return null;
    };

    return (
        <MapContainer
            center={position}
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
                        weight: 1.5,
                    }}
                    onEachFeature={(feature, layer) => {
                        layer.on({
                            mouseover: function (e) {
                                const auxLayer = e.target;
                                auxLayer.setStyle({
                                    weight: 4,
                                    //color: "#800080"
                                });
                                var popup = $("<div></div>", {
                                    id: "popup-" + auxLayer.feature.properties.FieldID,
                                    css: {
                                        position: "absolute",
                                        height: "50px",
                                        width: "150px",
                                        top: "0px",
                                        left: "0px",
                                        zIndex: 1002,
                                        backgroundColor: "white",
                                        //padding: "200px",
                                        border: "1px solid #ccc",
                                    },
                                });
                                // Insert a headline into that popup
                                var hed = $("<div></div>", {
                                    text: "FieldID: " + auxLayer.feature.properties.FieldID,
                                    css: { fontSize: "16px", marginBottom: "3px" },
                                }).appendTo(popup);
                                // Add the popup to the map
                                popup.appendTo("#map");
                            },
                            mouseout: function (e) {
                                const auxLayer = e.target;
                                auxLayer.setStyle({
                                    weight: 1,
                                    //color: "#9370DB",
                                    //fillColor: "lightblue",
                                    dashArray: "",
                                    fillOpacity: 0,
                                    opacity: 1,
                                });
                                $("#popup-" + auxLayer.feature.properties.FieldID).remove();
                            },
                        });
                    }}
                    style={(features) => {
                        if (features?.properties?.FieldID === clickedField) {
                            return {
                                color: "red", // Border color
                                fillColor: "#16599A", // Fill color for the highlighted area
                                fillOpacity: 0.5,
                                weight: 2,
                            };
                        }
                        return {
                            color: "blue", // Border color
                            fillColor: "lightblue", // Fill color for normal areas
                            fillOpacity: 0.5,
                            weight: 2,
                        };
                    }}
                    data={geojson}
                />
            }
            <CustomZoomControl />
            <MapHandler />
        </MapContainer>
    );
};

export default LeafletMap;
