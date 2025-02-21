import { MapContainer, TileLayer, useMap, LayersControl, WMSTileLayer } from "react-leaflet";
import CustomZoomControl from "./MapController";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Layer } from "recharts";

type mapConfiguration = {
    minZoom: number;
    containerStyle: {};
    enableLayers?: boolean;
};

type LeafletMapTypes = {
    zoom: number;
    position: any;
    collapse?: string;
    clickedField?: string | null;
    configurations?: mapConfiguration;
    children?: any;
    viewBound?: any;
};

const LeafletMap = ({ zoom, position, collapse, clickedField = null, viewBound, configurations = {'minZoom': 11, 'containerStyle': {}, enableLayers: false}, children }: LeafletMapTypes) => {
  const { center } = position;
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

        return null;
    };

    const addLayers = () => {
      return (
        <>
          <LayersControl.Overlay name="ETA">
            <WMSTileLayer
              url={`https://staging.flowgeos.wateraccounts.com/geoserver/rt_2023/wms`}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_eta_accumulation_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="ETAW">
            <WMSTileLayer
              url={`https://staging.flowgeos.wateraccounts.com/geoserver/rt_2023/wms`}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etaw_accumulation_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="ETPR">
            <WMSTileLayer
              url={`https://staging.flowgeos.wateraccounts.com/geoserver/rt_2023/wms`}
              params={{
                format:"image/png",
                layers:"rt_2023:wy2023_202309_etpr_accumulation_in",
                transparent: true,
                ...( { sld_body: sld } as Record<string, any> ),
              }}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="P_TOTAL">
            <WMSTileLayer
              url={`https://staging.flowgeos.wateraccounts.com/geoserver/rt_2023/wms`}
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

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            zoomControl={false} // Disable default zoom control
            minZoom={2}
            style={configurations.containerStyle || { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" }}
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
                {configurations.enableLayers && addLayers()}
            </LayersControl>
            {children}
            <CustomZoomControl />
            <MapHandler />
        </MapContainer>
    );
};

export default LeafletMap;
