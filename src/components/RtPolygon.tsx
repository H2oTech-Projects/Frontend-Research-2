import React from "react";
import { Polygon } from "react-leaflet";

type RtTypes = {
  pathOptions: Object;
  positions: any;
  color: string;
  eventHandlers: L.LeafletEventHandlerFnMap;
  children: any;
};

const RtPolygon = ({ pathOptions, positions, color, eventHandlers, children }: RtTypes) => {
    return (
      <Polygon
      pathOptions={pathOptions}
      positions={positions}
      color={color}
      eventHandlers={eventHandlers as L.LeafletEventHandlerFnMap}
  >
    {children}
  </Polygon>
    );
};

export default React.memo(RtPolygon);
