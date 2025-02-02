import { GeoJSON } from "react-leaflet";

type RtGeoJsonTypes = {
  layerEvents: any;
  data: any;
  style: any;
};

const RtGeoJson = ({ layerEvents, data, style }: RtGeoJsonTypes) => {
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
    style={style}
    />
  );
};

export default RtGeoJson;