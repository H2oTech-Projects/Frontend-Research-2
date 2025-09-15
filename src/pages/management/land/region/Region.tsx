import CollapseBtn from '@/components/CollapseBtn';
import LeafletMap from '@/components/LeafletMap';
import PageHeader from '@/components/PageHeader'
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { conveyanceDataType, initialTableDataTypes } from '@/types/tableTypes';
import { cn } from '@/utils/cn';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import $ from "jquery";
import { useNavigate } from 'react-router-dom';
import MapTable from '@/components/Table/mapTable';
import { useQueryClient } from '@tanstack/react-query';
import RtGeoJson from '@/components/RtGeoJson';
import { debounce } from '@/utils';
import { useGetRegionList, useGetRegionMap } from '@/services/region';
import { regionColumnProperties } from '@/utils/constant';
import { createRoot } from 'react-dom/client';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useSwipe } from '@/utils/customHooks/useSwipe';
const initialTableData = {
  search: "",
  page_no: 1,
  page_size: 50,
  sort: '',
  sort_order: ''
}
const SubRegion = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
   const [collapse, setCollapse] = useState(isDesktopDevice ? "default" : "map");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedGeom, setClickedGeom] = useState<any>({ regionId: "", viewBounds: null });
  const [searchText, setSearchText] = useState("");
  const { handleTouchStart, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => setCollapse("table"),
    // onSwipeRight: () => setCollapse("map"),
  });
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );
  const { data: regionData, isLoading: conveyLoading } = useGetRegionList(tableInfo);
  const { data: mapGeoJson, isLoading: isMapLoading } = useGetRegionMap();
  const columns: ColumnDef<conveyanceDataType>[] = [
    {
      accessorKey: "regionId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "region_id", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Region IDs{tableInfo?.sort !== "region_id" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 150,
      cell: ({ row }) => <div className="px-4">{row.getValue("regionId")}</div>,
    },
    {
      accessorKey: "regionName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "region_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Region Name{tableInfo?.sort !== "region_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 150,
      cell: ({ row }) => <div className="px-4">{row.getValue("regionName")}</div>,
    },

  ];
  const tableCollapseBtn = () => {
    if (!isDesktopDevice) {
      setCollapse("map")
    } else {
      setCollapse((prev) => (prev === "default" ? "table" : "default"));
    }
  };
  const mapCollapseBtn = () => {
    if (!isDesktopDevice) {
      setCollapse("table")
    } else {
      setCollapse((prev) => (prev === "default" ? "map" : "default"));
    }
  };

  const showInfo = (label: String, Id: String, name: String) => {
    var popup = $("<div></div>", {
      id: "popup-" + Id,
      class: "absolute top-[12px] left-3 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65",
    });
    // Insert a headline into that popup
    var hed = $("<div></div>", {
      text: ` ${label} : ${name}`,
      // text: `${label}: ` + Id,
      css: { fontSize: "16px", marginBottom: "3px" },
    }).appendTo(popup);
    // Add the popup to the map
    popup.appendTo("#map");
  };

  const removeInfo = (Id: String) => {
    $("[id^='popup-']").remove();
  };

  const geoJsonLayerEvents = (feature: any, layer: any) => {
    const popupDiv = document.createElement('div');
    popupDiv.className = 'popup-map ';
    // @ts-ignore
    popupDiv.style = "width:100%; height:100%; overflow:hidden";
    popupDiv.id = feature.properties?.id;
    layer.bindPopup(popupDiv);
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        createRoot(popupDiv).render(<div className="w-full h-full overflow-y-auto flex flex-col  py-2">
          <div>Region Id: {auxLayer.feature.properties.region_id}</div>
          <div>Region Name: {auxLayer.feature.properties.region_name}</div>
        </div>);
        showInfo("Region", auxLayer.feature.properties.region_id, auxLayer.feature.properties.region_name);
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
        removeInfo(auxLayer.feature.properties.region_id);
      },
    })
  };

  useEffect(() => {
    if (!isDesktopDevice && collapse === "default") {
      setCollapse("map")
    }
  }, [isDesktopDevice])

  const mapConfiguration = useMemo(() => { return { 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } } }, []);

  const ReturnChildren = useMemo(() => {

    const geoJsonStyle = (features: any) => {
      if (features?.properties?.region_id === clickedGeom?.regionId?.toString()) {

        return {
          color: "red", // Border color
          fillColor: "red", // Fill color for the highlighted area
          fillOpacity: 0.7,
          weight: 2,
        };
      }
      return {
        color: "#16599A", // Border color
        fillColor: "transparent", // Fill color for normal areas
        fillOpacity: 0.5,
        weight: 2,
      };
    }

    return (

      <>
        {isMapLoading ? (
          <div className="absolute top-1/2 left-1/2 right-1/2 z-[800] flex gap-4 -ml-[70px] ">
            <div className="flex  rounded-lg bg-[#16599a] text-slate-50 bg-opacity-65 p-2 text-xl h-auto gap-3 ">Loading <Spinner /></div>
          </div>
        ) : (
          mapGeoJson?.data && (
            <RtGeoJson
              layerEvents={geoJsonLayerEvents}
              data={JSON.parse(mapGeoJson?.data)}
              style={geoJsonStyle}
              key={"clientData"}
              color="#9370DB" />
          )
        )}
      </>
    )

  }, [isMapLoading, clickedGeom, mapGeoJson])

  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <PageHeader
        pageHeaderTitle="Regions"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Land", menuPath: "" }]}
      />
      <div className="pageContain flex flex-grow flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="input h-7 w-52">
              <Search
                size={16}
                className="text-slate-300"
              />
              <input
                name="search"
                id="search"
                placeholder="Search..."
                value={searchText}
                className="w-full bg-transparent text-sm text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                onChange={(e) => {
                  setSearchText(e.target.value);
                  debouncedSearch(e.target.value);
                }}
              />
            </div>
            {tableInfo.search && <Button
              variant={"default"}
              className="h-7 w-7"
              onClick={() => { setSearchText(""); setTableInfo({ ...tableInfo, search: "" }) }}
            >
              <X />
            </Button>}
          </div>
        </div>
        <div className="flex flex-grow">
          <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
            <div className={cn("relative h-[calc(100vh-160px)] w-full")}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <MapTable
                defaultData={regionData?.data || []}
                columns={columns}
                setPosition={setPosition as Function}
                setZoomLevel={setZoomLevel as Function}
                setClickedGeom={setClickedGeom as Function}
                tableType={"region"}
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={regionData?.totalRecords || 1}
                collapse={collapse}
                isLoading={conveyLoading}
                columnProperties={regionColumnProperties}
              />
              <CollapseBtn
                className="absolute -right-4 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
                onClick={mapCollapseBtn}
                note={collapse === 'default' ? 'View Full Table' : "Show Map"}
              >
                <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </div>
          </div>

          <div className={cn("w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3")}>
            <div
              className={cn("Mable-Map relative flex h-[calc(100vh-160px)] w-full")}
              id="map"
            >
              <LeafletMap
                position={position}
                zoom={zoomLevel}
                collapse={collapse}
                viewBound={clickedGeom?.viewBound ?? mapGeoJson?.viewBounds}
                configurations={mapConfiguration}
              >
                {ReturnChildren}

              </LeafletMap>
              <CollapseBtn
                className="absolute -left-4 top-1/2 z-[1100] m-2 flex size-8 items-center justify-center"
                onClick={tableCollapseBtn}
                note={collapse === 'default' ? 'View Full Map' : "Show Table"}
              >
                <ChevronsLeft className={cn(collapse === "table" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubRegion
