"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { LatLng, LeafletEvent, Layer, FeatureGroup as LeafletFeatureGroup } from "leaflet";
import L from "leaflet";

interface FormValues {
  polygons: [number, number][][]; 
  polylines: [number, number][][]; 
  markers: [number, number][]; 
}

const MapForm: React.FC = () => {
  const { setValue, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      polygons: [],
      polylines: [],
      markers: [],
    },
  });


  const featureGroupRef = useRef<LeafletFeatureGroup>(null);


  const polygons = watch("polygons");
  const polylines = watch("polylines");
  const markers = watch("markers");


const getCoordinates = (layer: Layer): [number, number][] => {
  const latlngs = (layer as any).getLatLngs();

  const flattened = latlngs.flat(Infinity) as LatLng[];

  return flattened.map((latlng) => [latlng.lat, latlng.lng]);
};


  const getMarkerCoordinates = (layer: Layer): [number, number] => {
    const latlng = (layer as any).getLatLng() as LatLng;
    return [latlng.lat, latlng.lng];
  };


  const onLayerCreated = (e: LeafletEvent) => {
    const layer = (e as any).layer;

    if (layer instanceof L.Polygon) {
      setValue("polygons", [...polygons, getCoordinates(layer)]);
    } else if (layer instanceof L.Polyline) {
      setValue("polylines", [...polylines, getCoordinates(layer)]);
    } else if (layer instanceof L.Marker) {
      setValue("markers", [...markers, getMarkerCoordinates(layer)]);
    }
  };

  const onLayerEdited = () => {
    if (!featureGroupRef.current) return;

    const updatedPolygons: [number, number][][] = [];
    const updatedPolylines: [number, number][][] = [];
    const updatedMarkers: [number, number][] = [];

    featureGroupRef.current.eachLayer((layer: Layer) => {
      if (layer instanceof L.Polygon) {
        updatedPolygons.push(getCoordinates(layer));
      } else if (layer instanceof L.Polyline) {
        updatedPolylines.push(getCoordinates(layer));
      } else if (layer instanceof L.Marker) {
        updatedMarkers.push(getMarkerCoordinates(layer));
      }
    });

    setValue("polygons", updatedPolygons);
    setValue("polylines", updatedPolylines);
    setValue("markers", updatedMarkers);
  };


  const onLayerDeleted = () => {
    if (!featureGroupRef.current) return;

    const remainingPolygons: [number, number][][] = [];
    const remainingPolylines: [number, number][][] = [];
    const remainingMarkers: [number, number][] = [];

    featureGroupRef.current.eachLayer((layer: Layer) => {
      if (layer instanceof L.Polygon) {
        remainingPolygons.push(getCoordinates(layer));
      } else if (layer instanceof L.Polyline) {
        remainingPolylines.push(getCoordinates(layer));
      } else if (layer instanceof L.Marker) {
        remainingMarkers.push(getMarkerCoordinates(layer));
      }
    });

    setValue("polygons", remainingPolygons);
    setValue("polylines", remainingPolylines);
    setValue("markers", remainingMarkers);
  };

  
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">Draw & Edit Polygons, Polylines, and Markers</h2>
      <MapContainer center={[37.8199, -122.4783]} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onLayerCreated}
            onEdited={onLayerEdited}
            onDeleted={onLayerDeleted}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              polygon: true,
              polyline: true,
              marker: true,
            }}
          />
        </FeatureGroup>
      </MapContainer>

      <div className="mt-3">
        <label className="font-semibold">Polygon Coordinates:</label>
        <textarea className="w-full p-2 border rounded" rows={4} value={JSON.stringify(polygons, null, 2)} readOnly />

        <label className="font-semibold mt-2">Polyline Coordinates:</label>
        <textarea className="w-full p-2 border rounded" rows={4} value={JSON.stringify(polylines, null, 2)} readOnly />

        <label className="font-semibold mt-2">Marker Coordinates:</label>
        <textarea className="w-full p-2 border rounded" rows={4} value={JSON.stringify(markers, null, 2)} readOnly />
      </div>

      <button onClick={handleSubmit(onSubmit)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </div>
  );
};

export default MapForm;
