import $ from "jquery";
import React from 'react'
import LeafletMap from '../LeafletMap'
import RtGeoJson from '../RtGeoJson'
import RtPolygon from '../RtPolygon'
import { Popup } from 'react-leaflet'
import { AccountDetailType, parcel_id_mapperType } from '@/types/apiResponseType'
import { geoFarmJsonStyle, geoJsonStyle, InsightMapPosition, LeafletMapConfig } from '@/utils/mapConstant'
import { buildPopupMessage } from "@/utils/map";
import { createRoot } from "react-dom/client";

interface InsightMapProps {
  viewBoundFarmGeoJson:[number,number][] | null;
  accountDetail:AccountDetailType;
  collapse:string;
  selectedEmailValue:string | null;
  selectedFarmGeoJson:string | null;
  selectedFarm:string | null | null;
  selectedParcel:string | null;
  selectedParcelGeom:[] | null;
  parcelInfo: parcel_id_mapperType;
}

const InsightMap =({
  viewBoundFarmGeoJson,
  accountDetail,
  collapse,
  selectedEmailValue,
  selectedFarmGeoJson,
  selectedFarm,
  selectedParcel,
  selectedParcelGeom,
  parcelInfo
}:InsightMapProps)=>{
function hasOnlyZeroPairs(arr: any[]): boolean {
    return Array.isArray(arr) && arr.every(subArr =>
        Array.isArray(subArr) &&
        subArr.length === 2 &&
        subArr[0] === 0 &&
        subArr[1] === 0
    );
}
   const showInfo = (Id: String) => {
    var popup = $("<div></div>", {
      id: "popup-" + Id,
      class: "absolute top-2 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-[#16599a] text-slate-50 bg-opacity-65",
    });
    // Insert a headline into that popup
    var hed = $("<div></div>", {
    //  text: "Parcel: " + Id,
      text: "Parcel: XXX-XXX-XXX",
      css: { fontSize: "16px", marginBottom: "3px" },
    }).appendTo(popup);
    // Add the popup to the map
    popup.appendTo("#map2");
  };

  const removeInfo = (Id: String) => {
    $("#popup-" + Id).remove();
  };

  const geoJsonLayerEvents = (feature: any, layer: any) => {
        const popupDiv = document.createElement('div');
    popupDiv.className = 'popup-map ';
    // @ts-ignore
    popupDiv.style = "width:100%; height:100%; overflow:hidden";
    popupDiv.id = feature.properties?.apn;
    layer.bindPopup(popupDiv);
    // layer.bindPopup(buildPopupMessage(parcelInfo[feature.properties.apn]));
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        // auxLayer.setStyle({
        //   weight: 4,
        //   //color: "#800080"
        // });
        createRoot(popupDiv).render(<div className="w-full h-full overflow-y-auto flex flex-col  py-2">
        {/* <div>Parcel ID: {parcelInfo[feature.properties.apn]?.parcel_id}</div>
        <div>Primary Crop: {parcelInfo[feature.properties.apn]?.primary_crop}</div> */}
          <div>Parcel ID: XXX-XXX-XXX</div>
          <div>Primary Crop: {parcelInfo[feature.properties.apn]?.primary_crop}</div>
            <div>Total Allocation (AF): 66.5</div>
            <div>ETAW (AF): 46.5</div>
            <div>Remaining (AF): 19.7</div>
            <div>Remaining (%): 29.7</div>
            <div>Sustainable Yield Acreage (AC): 20.1</div>
            <div>Transitional Water Acreage (AC): 19.3</div>
            <div>2024 Allocation (AF): 45.9</div>
            <div>Carryover (AF): 20.3</div>
            <div> Zone Abbreviation: MEN</div>
</div>);
        showInfo(auxLayer.feature.properties.apn);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        // auxLayer.setStyle({
        //   weight: 2.5,
        //   //color: "#9370DB",
        //   //fillColor: "lightblue",
        //   fillOpacity: 0,
        //   opacity: 1,
        // });
        removeInfo(auxLayer.feature.properties.apn);
      },
    })};

  const polygonEventHandlers: {
    mouseover: (e: L.LeafletMouseEvent) => void;
    mouseout: (e: L.LeafletMouseEvent) => void;
    click: (e: L.LeafletMouseEvent) => void;
  } = {
    mouseover(e: L.LeafletMouseEvent) {
      const { id } = e.target.options;
      showInfo(id);
    },
    mouseout(e: L.LeafletMouseEvent) {
      const { id } = e.target.options;
      removeInfo(id);
    },
    click(e: L.LeafletMouseEvent) {
      // e.target.openPopup(); // Opens popup when clicked
    },
  };

  if(hasOnlyZeroPairs(viewBoundFarmGeoJson!))
    {
      return (<LeafletMap
            position={InsightMapPosition}
            zoom={14}
            // viewBound={ accountDetail?.data?.view_bounds }

            collapse={collapse}
            configurations={LeafletMapConfig}
          ></LeafletMap>)

    }

  return (<LeafletMap
            position={InsightMapPosition}
            zoom={14}
            // viewBound={ accountDetail?.data?.view_bounds }
            viewBound={viewBoundFarmGeoJson?.length ?  viewBoundFarmGeoJson : accountDetail?.view_bounds }
            collapse={collapse}
            configurations={LeafletMapConfig}
          >

            {
              accountDetail?.geojson_parcels &&
                <RtGeoJson
                  key={selectedEmailValue as string}
                  layerEvents={geoJsonLayerEvents}
                  style={geoJsonStyle}
                  data={JSON.parse(accountDetail?.geojson_parcels)}
                  color={"#16599a"}
                />
            }
            {
              !!selectedFarmGeoJson &&
              <RtGeoJson
                key={selectedFarm as string}
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
                  <div dangerouslySetInnerHTML={{ __html: "test" }} />
                </Popup>
              </RtPolygon>
            }
    </LeafletMap>
  )

}

export default React.memo(InsightMap)