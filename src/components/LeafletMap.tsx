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
  'rt_2023:wy2023_202309_eta_accumulation_in': {'id': 'ETA', 'name': 'Evapotranspiration (ET)'},
  'rt_2023:wy2023_202309_etaw_accumulation_in': {'id': 'ETAW', 'name': 'Evapotranspiration of Applied Water (ETAW)'},
  'rt_2023:wy2023_202309_etpr_accumulation_in': {'id': 'ETPR', 'name': 'Evapotranspiration of Precipitation (ETPR)'},
  'rt_2023:wy2023_p_total_in': {'id': 'P_TOTAL', 'name': 'Precipitation (P)'},
  'rt_2023:colusa_ETa_WY2023_EPSG_6414': {'id': 'Colusa ETA', 'name': 'Evapotranspiration (ET)'},
}

type LeafletMapTypes = {
    zoom: number;
    position: any;
    collapse?: string;
    configurations?: mapConfiguration;
    children?: any;
    viewBound?: any;
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
              <ColorMapEntry quantity="0" label="0" color="#9e6212"/>
              <ColorMapEntry quantity="10" label="10" color="#bfa22d"/>
              <ColorMapEntry quantity="20" label="20" color="#d7db47"/>
              <ColorMapEntry quantity="30" label="30" color="#86c456"/>
              <ColorMapEntry quantity="40" label="40" color="#44b26b"/>
              <ColorMapEntry quantity="50" label="50" color="#4dc2a3"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`

const colusaSld =`<StyledLayerDescriptor version="1.0.0">
  <NamedLayer>
    <Name>rt_2023:colusa_ETa_WY2023_EPSG_6414</Name> <!-- Replace with actual layer name -->
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="ramp">
              <ColorMapEntry quantity="0" label="0" color="#9e6212"/>
              <ColorMapEntry quantity="10" label="10" color="#bfa22d"/>
              <ColorMapEntry quantity="20" label="20" color="#d7db47"/>
              <ColorMapEntry quantity="30" label="30" color="#86c456"/>
              <ColorMapEntry quantity="40" label="40" color="#44b26b"/>
              <ColorMapEntry quantity="50" label="50" color="#4dc2a3"/>
              <ColorMapEntry quantity="60" label="60" color="#4c87bd"/>
              <ColorMapEntry quantity="70" label="70" color="#077fec"/>
              <ColorMapEntry quantity="80" label="80" color="#1a6db9"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`

const removeLineBars = <style>{`
      .noUi-handle::before, .noUi-handle::after
        { display: none;}
      .noUi-horizontal .noUi-handle {
        width: 10px;
        height: 14px;
        right: -8px;
        top: -6px;
      }
      .noUi-target { width: 100%}
      `}</style>

const LeafletMap = ({ zoom, position, collapse, viewBound, configurations = {'minZoom': 11, 'containerStyle': {}, enableLayers: false}, children }: LeafletMapTypes) => {
  const { center } = position;
  const loggedUser = JSON.parse(localStorage.getItem("auth") as string)?.user
  const [addedLayers, setAddedLayers] = useState(['rt_2023:wy2023_202309_eta_accumulation_in'])
  const [opacity, setOpacity] = useState(1)
  const isMenuCollapsed = useSelector((state: any) => state.sideMenuCollapse.sideMenuCollapse)
  const [defaultLayer, setDefaultLayer] = useState<string>("Evapotranspiration (ET)")
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
      let selectedLayer = addedLayers[addedLayers.length-1]
      if (loggedUser == 'colusa@wateraccounts.com') {
        selectedLayer = 'rt_2023:colusa_ETa_WY2023_EPSG_6414'
      }
      const url = `${geoserverUrl}?service=WMS&request=GetLegendGraphic&format=image/png&layer=${selectedLayer}`;
      // if ((selectedLayer != 'rt_2023:wy2023_202309_eta_accumulation_in') || (selectedLayer != 'rt_2023:colusa_ETa_WY2023_EPSG_6414')) {
      //   return (
      //     <div className="absolute top-20 right-2 z-[1002] h-auto  w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65">
      //     <label className="text-center">{layerMapper[selectedLayer].id}</label>
      //     <img src={url} alt="Legend" style={{ width: "80px", height: "150px" }} />
      //     </div>
      //   )
      // }
      const additionalLegendsColusa = <>
        <div className="flex flex-row pb-1">
              <span style={{position: 'absolute',display: 'block',left: '35px'}}>80</span>
              <i style={{
              background: "#1a6db9",
              height: "17px",
              width: "17px",
              }}
              ></i>
            </div>
        <div className="flex flex-row pb-1">
          <span style={{position: 'absolute',display: 'block',left: '35px'}}>70</span>
          <i style={{
          background: "#077fec",
          height: "17px",
          width: "17px",
          }}
          ></i>
        </div>
        <div className="flex flex-row pb-1">
          <span style={{position: 'absolute',display: 'block',left: '35px'}}>60</span>
          <i style={{
          background: "#4c87bd",
          height: "17px",
          width: "17px",
          }}
          ></i>
        </div>
      </>
      return (
        <div className="flex flex-row justify-between  absolute top-20 right-2 z-[1002] h-auto  w-[100px] p-2 m-1 rounded-[8px] bg-black text-slate-50">
        <div  className="flex flex-col">
          {loggedUser == "colusa@wateraccounts.com" &&  additionalLegendsColusa || ''}
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>50</span>
            <i style={{
              background: "#4dc2a3",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
            <div className="flex flex-row pb-1">
              <span style={{position: 'absolute',display: 'block',left: '35px'}}>40</span>
              <i style={{
              background: "#44b26b",
              height: "17px",
              width: "17px",
              }}
              ></i>
            </div>
            <div className="flex flex-row pb-1">
              <span style={{position: 'absolute',display: 'block',left: '35px'}}>30</span>
              <i style={{
                background: "#86c456",
                height: "17px",
                width: "17px",
              }}></i>
            </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>20</span>
            <i style={{
            background: "#d7db47",
            height: "17px",
            width: "17px",
            }}
            ></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>10</span>
            <i style={{
              background: "#bfa22d",
              height: "17px",
              width: "17px",
            }}></i>
          </div>
          <div className="flex flex-row pb-1">
            <span style={{position: 'absolute',display: 'block',left: '35px'}}>0</span>
            <i style={{
            background: "#9e6212",
            height: "17px",
            width: "17px",
            }}
            ></i>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <p className="[writing-mode:vertical-rl] text-center">Cumulative ET (IN)</p>
        </div>
      </div>
      )
    }

    const addSlider = () => {
      return (
        <div
          className="flex flex-col absolute bottom-[2rem] right-[7rem] z-[1002] h-[20px]  w-[200px] p-2 m-2 rounded-[8px] bg-green text-slate-50">
          <Nouislider
            connect= {[true, false]}
            start={100}
            tooltips= {false}
            range= {{ min: 0, max: 100 }}
            step= {25}
            onUpdate={(num) => {setOpacity(parseFloat(num[0])/100)}}
          />
        </div>
      )
    }

    const colusaRaster = () => {
      return <>
      <LayersControl.Overlay name="Evapotranspiration (ET)" checked={defaultLayer=='Evapotranspiration (ET)'}>
        <WMSTileLayer
          url={`${geoserverUrl}`}
          opacity= {opacity}
          params={{
            format:"image/png",
            layers:"rt_2023:colusa_ETa_WY2023_EPSG_6414",
            transparent: true,
            ...( { sld_body: colusaSld } as Record<string, any> ),
          }}
        />
      </LayersControl.Overlay>
    </>
    }
    const addLayers = () => {
      if (loggedUser == "colusa@wateraccounts.com") {
        return colusaRaster()
      }
      return (
        <>
          <LayersControl.Overlay name="Evapotranspiration (ET)" checked={defaultLayer=='Evapotranspiration (ET)'}>
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_eta_accumulation_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
              eventHandlers={{
                add: () => setDefaultLayer("Evapotranspiration (ET)"),
                remove: () => console.log(''),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Evapotranspiration of Applied Water (ETAW)" checked={defaultLayer=='Evapotranspiration of Applied Water (ETAW)'}>
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etaw_accumulation_in",
                transparent: true,
                //...( { sld_body: sld } as Record<string, any> ),
              }}
              eventHandlers={{
                add: () => setDefaultLayer("Evapotranspiration of Applied Water (ETAW)"),
                remove: () => console.log(''),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Evapotranspiration of Precipitation (ETPR)" checked={defaultLayer=='Evapotranspiration of Precipitation (ETPR)'}>
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etpr_accumulation_in",
                transparent: true,
                //...( { sld_body: sld } as Record<string, any> ),
              }}
              eventHandlers={{
                add: () => setDefaultLayer("Evapotranspiration of Precipitation (ETPR)"),
                remove: () => console.log(''),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Precipitation (P)" checked={defaultLayer=='Precipitation (P)'}>
            <WMSTileLayer
              url={`${geoserverUrl}`}
              opacity= {opacity}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_p_total_in",
                transparent: true,
                // ...( { SLD_BODY: sld } as Record<string, any> ),
              }}
              eventHandlers={{
                add: () => setDefaultLayer("Precipitation (P)"),
                remove: () => console.log(''),
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
            {removeLineBars}
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
