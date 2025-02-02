import { Polygon } from "react-leaflet";

type RtTypes = {
  pathOptions: Object;
  positions: any;
  color: string;
  eventHandlers: L.LeafletEventHandlerFnMap;
};

const RtPolygon = ({ pathOptions, positions, color, eventHandlers }: RtTypes) => {
    return (
      <Polygon
      pathOptions={pathOptions}
      positions={positions}
      color={color}
      eventHandlers={eventHandlers as L.LeafletEventHandlerFnMap}
  />
    );
};

export default RtPolygon;
