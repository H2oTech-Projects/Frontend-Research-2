import { MapContainer, TileLayer, useMap, LayersControl, WMSTileLayer } from "react-leaflet";
import { Link } from "lucide-react";
import CustomZoomControl from "./MapController";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Layer } from "recharts";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import "./sliderDesign.css"

type mapConfiguration = {
    minZoom: number;
    containerStyle: {};
    enableLayers?: boolean;
};

const layerMapper: any ={
  'rt_2023:wy2023_202309_eta_accumulation_in': {'id': 'ETA', 'name': 'Evapotransiration (ET)'},
  'rt_2023:wy2023_202309_etaw_accumulation_in': {'id': 'ETAW', 'name': 'Evapotranspiration of Applied Water (ETAW)'},
  'rt_2023:wy2023_202309_etpr_accumulation_in': {'id': 'ETPR', 'name': 'Evapotranispiration of Percipitation (ETPR)'},
  'rt_2023:wy2023_p_total_in': {'id': 'P_TOTAL', 'name': 'Precipitation (P)'},
}

type LeafletMapTypes = {
    zoom: number;
    position: any;
    collapse?: string;
    configurations?: mapConfiguration;
    children?: any;
    viewBound?: any;
    associateFieldMsmtpoint?: any;
};
const geoserverUrl = "https://staging.flowgeos.wateraccounts.com/geoserver/rt_2023/wms";
const sld =`<StyledLayerDescriptor version="1.0.0">
  <NamedLayer>
    <Name>rt_2023:wy2023_202309_eta_accumulation_in</Name> <!-- Replace with actual layer name -->
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="ramp">
              <ColorMapEntry quantity="0.82677167654036998" label="0.8268" color="#9e6212"/>
              <ColorMapEntry quantity="9.1027560192347003" label="9.1028" color="#bfa22d"/>
              <ColorMapEntry quantity="17.378740361929033" label="17.3787" color="#d7db47"/>
              <ColorMapEntry quantity="25.654724704623366" label="25.6547" color="#86c456"/>
              <ColorMapEntry quantity="33.930709047317691" label="33.9307" color="#44b26b"/>
              <ColorMapEntry quantity="42.206693390012028" label="42.2067" color="#4dc2a3"/>
              <ColorMapEntry quantity="50.482677732706357" label="50.4827" color="#50bdc1"/>
              <ColorMapEntry quantity="58.122047895193433" label="58.1220" color="#3b788f"/>
              <ColorMapEntry quantity="64.488189697265994" label="64.4882" color="#2a3f65"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`
const LeafletMap = ({ zoom, position, collapse, viewBound, configurations = {'minZoom': 11, 'containerStyle': {}, enableLayers: false}, children }: LeafletMapTypes) => {
  const { center } = position;
  const [addedLayers, setAddedLayers] = useState(['rt_2023:wy2023_202309_eta_accumulation_in'])
  const [opacity, setOpacity] = useState(1)
  const isMenuCollapsed = useSelector((state: any) => state.sideMenuCollapse.sideMenuCollapse)
  const MapHandler = () => {
    const map = useMap();

  useEffect(() => {
    map.whenReady(() => {
      map.invalidateSize(); // Ensure proper sizing
      map.setView(center);  // Recenter
      if (viewBound) {
        map.fitBounds(viewBound);
      }
    });
  }, [collapse, center, zoom, map,viewBound]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [collapse, isMenuCollapsed, map]);
    useEffect(() => {
      const handleLayerAdd = (event: any) => {
        let OldaddedLayers = addedLayers.slice();
        // @ts-ignore
        OldaddedLayers.push(event.layer.options.layers);
        setAddedLayers(OldaddedLayers)
      };

      const handleLayerRemove = (event: any) => {
        let OldaddedLayers = addedLayers.slice();
        // @ts-ignore
        OldaddedLayers = OldaddedLayers.filter((layer) => layer != event.layer.options.layers)
        setAddedLayers(OldaddedLayers)
      };

      map.on('overlayadd', handleLayerAdd);
      map.on('overlayremove', handleLayerRemove);

      // Cleanup on unmount
      return () => {
        map.off('overlayadd', handleLayerAdd);
        map.off('overlayremove', handleLayerRemove);
      };
    }, [map]);

        return null;
    };

    const addLegends = () => {
      if (addedLayers.length <= 0) return ;
      const url = `${geoserverUrl}?service=WMS&request=GetLegendGraphic&format=image/png&layer=${addedLayers[addedLayers.length-1]}`;
      if (addedLayers[addedLayers.length-1] != 'rt_2023:wy2023_202309_eta_accumulation_in') {
        return (
          <div className="absolute top-20 right-2 z-[1002] h-auto  w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65">
          <label className="text-center">{layerMapper[addedLayers[addedLayers.length-1]].id}</label>
          <img src={url} alt="Legend" style={{ width: "80px", height: "150px" }} />
          </div>
        )
      }
      return (
        <div className="flex flex-col absolute top-20 right-2 z-[1002] h-auto  w-[100px] p-2 m-2 rounded-[8px] bg-black text-slate-50">
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>0.8</span>
            <i style={{
            background: "#9e6212",
            height: "17px",
            width: "17px",
            }}
            ></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>9.1</span>
            <i style={{
              background: "#bfa22d",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>17.3</span>
            <i style={{
            background: "#d7db47",
            height: "17px",
            width: "17px",
            }}
            ></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>25.6</span>
            <i style={{
              background: "#86c456",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>33.9</span>
            <i style={{
            background: "#44b26b",
            height: "17px",
            width: "17px",
            }}
            ></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>42.2</span>
            <i style={{
              background: "#4dc2a3",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>50.4</span>
            <i style={{
              background: "#50bdc1",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>58.1</span>
            <i style={{
              background: "#3b788f",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>64.4</span>
            <i style={{
              background: "#2a3f65",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
        </div>
      )
    }

    const addSlider = () => {
      return (
        <div
          className="flex flex-col absolute bottom-[2rem] right-[-5rem] z-[1002] h-auto  w-[500px] p-2 m-2 rounded-[8px] bg-green text-slate-50">
          <Nouislider
            connect= {[true, false]}
            start={100}
            tooltips= {true}
            range= {{ min: 0, max: 100 }}
            pips= {{ mode: 'steps'}}
            step= {20}
            onUpdate={(num) => {setOpacity(parseFloat(num[0])/100)}}
          />
        </div>
      )
    }


    const addLayers = () => {
      return (
        <>
          <LayersControl.Overlay checked name="Evapotransiration (ET)">
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_eta_accumulation_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Evapotranspiration of Applied Water (ETAW)">
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etaw_accumulation_in",
                transparent: true,
                //...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Evapotranispiration of Percipitation (ETPR)">
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etpr_accumulation_in",
                transparent: true,
                //...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Precipitation (P)">
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_p_total_in",
                transparent: true,
                // ...( { SLD_BODY: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
        </>
      )
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            zoomControl={false} // Disable default zoom control
            minZoom={2}
            style={configurations?.containerStyle || { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" }}
        >
            { configurations.enableLayers && addSlider() }
            <LayersControl position="bottomleft">

                <LayersControl.BaseLayer
                    checked
                    name="Satellite"
                >
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Street Map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </LayersControl.BaseLayer>
                {configurations.enableLayers && addLayers()}
            </LayersControl>
            {configurations.enableLayers && addLegends()}
            {children}
            <CustomZoomControl />
            <MapHandler />
        </MapContainer>
    );
};

export default React.memo(LeafletMap);
