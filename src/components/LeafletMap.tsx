import { MapContainer, TileLayer, useMap, LayersControl, WMSTileLayer } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { Layer } from "recharts";

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
    center: any;
    collapse?: string;
    clickedField?: string | null;
    configurations?: mapConfiguration;
    children?: any;
    viewBound?: any;
};
const geoserverUrl = "https://staging.flowgeos.wateraccounts.com/geoserver/rt_2023/wms";
const sld = `<?xml version="1.0" encoding="UTF-8"?>
    <StyledLayerDescriptor version="1.0.0"
     xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
     xmlns="http://www.opengis.net/sld"
     xmlns:ogc="http://www.opengis.net/ogc"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <!-- a Named Layer is the basic building block of an SLD document -->
      <NamedLayer>
        <Name>rt_2023:default_polygon</Name>
        <UserStyle>
        <!-- Styles can have names, titles and abstracts -->
          <Title>Default Polygon</Title>
          <Abstract>A sample style that draws a polygon</Abstract>
          <!-- FeatureTypeStyles describe how to render different features -->
          <!-- A FeatureTypeStyle for rendering polygons -->
          <FeatureTypeStyle>
            <Rule>
              <Name>rule1</Name>
              <Title>Gray Polygon with Black Outline</Title>
              <Abstract>A polygon with a gray fill and a 1 pixel black outline</Abstract>
              <PolygonSymbolizer>
                <Fill>
                  <CssParameter name="fill">#AAAAAA</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                  <CssParameter name="stroke-width">1</CssParameter>
                </Stroke>
              </PolygonSymbolizer>
            </Rule>
          </FeatureTypeStyle>
        </UserStyle>
      </NamedLayer>
    </StyledLayerDescriptor>
    `
const LeafletMap = ({ zoom, center, collapse, clickedField = null, viewBound, configurations, children }: LeafletMapTypes) => {
  //const configurations = { 'minZoom': 4, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" }}
  const [addedLayers, setAddedLayers] = useState(['rt_2023:wy2023_202309_eta_accumulation_in'])
  const isMenuCollapsed = useSelector((state: any) => state.sideMenuCollapse.sideMenuCollapse)
  const MapHandler = () => {
    const map = useMap();

    useEffect(() => {
      map.invalidateSize(); // Force the map to resize
      map.setView(center); // Force the map to recenter
      if (!!viewBound){
        map.fitBounds(viewBound);
      }
      //map.setZoom(zoom);
    }, [collapse, center, zoom, viewBound]);

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300)


    }, [collapse, isMenuCollapsed]);

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
      return (
        <div className="absolute top-20 right-2 z-[1002] h-auto  w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65">
          <label className="text-center">{layerMapper[addedLayers[addedLayers.length-1]].id}</label>
          <img src={url} alt="Legend" style={{ width: "80px", height: "150px" }} />
        </div>
      )
    }

    const addLayers = () => {
      return (
        <>
          <LayersControl.Overlay checked name="Evapotransiration (ET)">
            <WMSTileLayer
              url={`${geoserverUrl}`}
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
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etaw_accumulation_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Evapotranispiration of Percipitation (ETPR)">
            <WMSTileLayer
              url={`${geoserverUrl}`}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etpr_accumulation_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Precipitation (P)">
            <WMSTileLayer
              url={`${geoserverUrl}`}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_p_total_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
        </>
      )
    }
    //const sld = `<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <NamedLayer> <Name>rt_2023:gg</Name> <UserStyle> <Title>A azure polygon style</Title> <FeatureTypeStyle> <Rule> <Title>azure polygon</Title> <PolygonSymbolizer> <Fill> <CssParameter name="fill">#0033cc </CssParameter> </Fill> <Stroke> <CssParameter name="stroke">#000000</CssParameter> <CssParameter name="stroke-width">0.5</CssParameter> </Stroke> </PolygonSymbolizer> </Rule> </FeatureTypeStyle> </UserStyle> </NamedLayer></StyledLayerDescriptor>`
    console.log('map map')
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            zoomControl={false} // Disable default zoom control
            minZoom={2}
            style={configurations?.containerStyle || { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" }}
        >
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

            </LayersControl>

            {children}
            <CustomZoomControl />
            <MapHandler />
        </MapContainer>
    );
};

export default React.memo(LeafletMap);
