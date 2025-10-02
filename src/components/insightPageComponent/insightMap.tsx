import $ from "jquery";
import React, { useEffect, useState } from 'react'
import LeafletMap from '../LeafletMap'
import L from "leaflet";
import RtGeoJson from '../RtGeoJson'
import RtPolygon from '../RtPolygon'
import { Popup } from 'react-leaflet'
import { AccountDetailType, parcel_id_mapperType } from '@/types/apiResponseType'
import { geoFarmJsonStyle, geoJsonStyle, InsightMapPosition, LeafletMapConfig } from '@/utils/mapConstant'
import { buildPopupMessage } from "@/utils/map";
import { createRoot } from "react-dom/client";
import TableLineChartInfo, {ColusaTableLineChartInfo} from '@/utils/tableLineChartInfo';
import { useMediaQuery } from "@uidotdev/usehooks";
import MobileMapPopup from "@/components/modal/CustomMapModel";

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
const isDesktopDevice = useMediaQuery("(min-width: 768px)");
const [mobilePopupInfo, setMobilePopupInfo] = useState<any>({ isOpen: false, tableInfo: null, chartInfo: [], parcelId: null })
const loggedUser = JSON.parse(localStorage.getItem("auth") as string)?.user_details.user
function hasOnlyZeroPairs(arr: any[]): boolean {
    return Array.isArray(arr) && arr.every(subArr =>
        Array.isArray(subArr) &&
        subArr.length === 2 &&
        subArr[0] === 0 &&
        subArr[1] === 0
    );
}
   const showInfo = (Label: String, Id: String) => {
    var popup = $("<div></div>", {
      id: "popup-" + Id,
      class: "absolute top-2 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-[#16599a] text-slate-50 bg-opacity-65",
    });
    // Insert a headline into that popup
    var hed = $("<div></div>", {
    //  text: "Parcel: " + Id,
      text: `${Label}: ${Id}`,
      css: { fontSize: "16px", marginBottom: "3px" },
    }).appendTo(popup);
    // Add the popup to the map
    popup.appendTo("#map2");
  };

  const removeInfo = (Id: String) => {
    $("[id^='popup-']").remove();
    // $("#popup-" + Id).remove();
  };

  useEffect(() => {
    setMobilePopupInfo({ isOpen: false, tableInfo: null, chartInfo: [], parcelId: null });
  }, [isDesktopDevice])

const geoJsonLayerEvents = (feature: any, layer: any) => {
  if (!isDesktopDevice) {
    layer.on({
      click: (e: any) => {
        const auxLayer = e.target;
        setMobilePopupInfo({ isOpen: true, tableInfo: parcelInfo[auxLayer.feature.properties.parcel_id], chartInfo: [], parcelId: auxLayer.feature.properties.parcel_id })
      },
    });
    return;
  }
  const popupDiv = document.createElement('div');
    popupDiv.className = 'popup-map ';
    // @ts-ignore
    popupDiv.style = "width:100%; height:100%; border-radius:8px; overflow:hidden";
    popupDiv.id = feature.properties?.parcel_id;

    layer.bindPopup(popupDiv,{maxHeight:1000, maxWidth:700, closeOnClick: false ,  autoPan: true,autoPanPaddingBottomRight: L.point(128, 48) });
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        createRoot(popupDiv).render(<ColusaTableLineChartInfo data={{'tableInfo': parcelInfo[auxLayer.feature.properties.parcel_id], 'chartInfo': [], 'parcelId': auxLayer.feature.properties.parcel_id}}/>);
        showInfo('Parcel Id', auxLayer.feature.properties.parcel_id);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        removeInfo(auxLayer.feature.properties.parcel_id);
      },
    });
}
  const polygonEventHandlers: {
    mouseover: (e: L.LeafletMouseEvent) => void;
    mouseout: (e: L.LeafletMouseEvent) => void;
    click: (e: L.LeafletMouseEvent) => void;
  } = {
    mouseover(e: L.LeafletMouseEvent) {
      const { id } = e.target.options;
      showInfo('APN: ',id);
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

  return (<>
    <MobileMapPopup
      isOpen={mobilePopupInfo?.isOpen}
      onClose={() => setMobilePopupInfo({ isOpen: false, tableInfo: null, chartInfo: [], parcelId: null })}
      title={`Parcel Id: ${mobilePopupInfo?.parcelId}`}
      children={
        (['colusa@wateraccounts.com', 'colusagrower@wateraccounts.com', 'madera@wateraccounts.com', 'maderagrower@wateraccounts.com'].includes(loggedUser)) ?
          <ColusaTableLineChartInfo
            data={{
              tableInfo: mobilePopupInfo?.tableInfo,
              chartInfo: [],
              parcelId: mobilePopupInfo?.parcelId,
            }}
          /> :
          <TableLineChartInfo data={{ 'tableInfo': mobilePopupInfo?.tableInfo, 'chartInfo': [] }} />
      } />
    <LeafletMap
      position={InsightMapPosition}
      zoom={14}
      // viewBound={ accountDetail?.data?.view_bounds }
      viewBound={viewBoundFarmGeoJson?.length ?  viewBoundFarmGeoJson : accountDetail?.view_bounds }
      collapse={collapse}
      configurations={{...LeafletMapConfig, enableLayers: true}}
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
    </LeafletMap></>
  )

}

export default React.memo(InsightMap)