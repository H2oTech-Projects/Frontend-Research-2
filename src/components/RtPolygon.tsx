import { Polygon } from "react-leaflet";

type RtTypes = {
  pathOptions: Object;
  positions: any;
  color: String;
  polygonEventHandlers: L.LeafletEventHandlerFnMap;
};

const RtPolygon = ({ pathOptions, positions, color, polygonEventHandlers }: RtTypes) => {
    return (
      <Polygon
      pathOptions={pathOptions}
      positions={positions}
      color={color}
      eventHandlers={polygonEventHandlers as L.LeafletEventHandlerFnMap}
  />
    );
};

export default RtPolygon;
