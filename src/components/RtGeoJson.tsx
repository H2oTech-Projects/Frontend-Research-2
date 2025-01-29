import { Polygon } from "react-leaflet";

import { GeoJSON } from "react-leaflet";

type RtGeoJsonTypes = {
  layerEvents: any;
  data: Object;
};

const RtGeoJson = ({ layerEvents, data }: RtGeoJsonTypes) => {
    return (
      <GeoJSON
        pathOptions={{
          //color: "#9370DB",
          //fillColor: "lightblue",
          fillOpacity: 0,
          opacity: 1,
          weight: 2.5,
        }}
        onEachFeature={layerEvents}
        data={data}
        />
    );
};

export default RtGeoJson;