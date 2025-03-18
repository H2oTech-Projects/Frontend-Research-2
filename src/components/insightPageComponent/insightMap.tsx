import React from 'react'
import LeafletMap from '../LeafletMap'
import RtGeoJson from '../RtGeoJson'
import RtPolygon from '../RtPolygon'
import { buildPopupMessage } from '@/utils/map'
import { Popup } from 'react-leaflet'
import { AccountDetailType } from '@/types/apiResponseType'

interface InsightMapProps {
  position: any;
  viewBoundFarmGeoJson:[number,number][];
  accountDetail:AccountDetailType;
  collapse:string;
  LeafletMapConfig:{
      minZoom: number;
      containerStyle: {
          height: string;
          width: string;
          overflow: string;
          borderRadius: string;
      };
  };
  selectedEmailValue:string | null;
  geoJsonLayerEvents:Function;
  geoJsonStyle:{
    color: string;
    fillColor: string;
    fillOpacity: number;
    weight: number;
  };
  selectedFarmGeoJson:string;
  selectedFarm:string;
  geoFarmJsonStyle:{
    color: string;
    fillColor: string;
    fillOpacity: number;
    weight: number;
  };
  selectedParcel:string;
  selectedParcelGeom:[];
  polygonEventHandlers: {
  mouseover: (e: L.LeafletMouseEvent) => void;
  mouseout: (e: L.LeafletMouseEvent) => void;
  click: (e: L.LeafletMouseEvent) => void;
}
}

const InsightMap =({
position,
viewBoundFarmGeoJson,
accountDetail,
collapse,
LeafletMapConfig,
selectedEmailValue,
geoJsonLayerEvents,
geoJsonStyle,
selectedFarmGeoJson,
selectedFarm,
geoFarmJsonStyle,
selectedParcel,
selectedParcelGeom,
polygonEventHandlers}:InsightMapProps)=>{

  return (<LeafletMap
              position={position}
              zoom={14}
              // viewBound={ accountDetail?.data?.view_bounds }
              viewBound={viewBoundFarmGeoJson?.length ?  viewBoundFarmGeoJson : accountDetail?.view_bounds}
              collapse={collapse}
              configurations={LeafletMapConfig}
            >
       
              {accountDetail?.geojson_parcels && <RtGeoJson
                key={selectedEmailValue as string}
                layerEvents={geoJsonLayerEvents}
                style={geoJsonStyle}
                data={JSON.parse(accountDetail?.geojson_parcels)}
                color={"#16599a"}
              />
              }
              {
                !!selectedFarmGeoJson && <RtGeoJson
                key={selectedFarm}
                layerEvents={geoJsonLayerEvents}
                style={geoFarmJsonStyle}
                data={JSON.parse(selectedFarmGeoJson)}
                color={"red"}
              />
              }

              {
                !!selectedParcel &&
                <RtPolygon
                  pathOptions={{ id: selectedParcel } as Object}
                  positions={selectedParcelGeom}
                  color={"red"}
                  eventHandlers={polygonEventHandlers as L.LeafletEventHandlerFnMap}
                >
                  <Popup>
                    <div dangerouslySetInnerHTML={{ __html: buildPopupMessage(position.features) }} />
                  </Popup>
                </RtPolygon>
              }
            </LeafletMap>)

}

export default React.memo(InsightMap)