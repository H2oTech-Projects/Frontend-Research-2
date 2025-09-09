import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import $ from "jquery";
import { cn } from "../../../../utils/cn";
import { ColumnDef } from "@tanstack/react-table";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import RtGeoJson from "@/components/RtGeoJson";
import { DummyDataType } from "@/types/tableTypes";
import { Button } from "@/components/ui/button";
import { buildPopupMessage } from "@/utils/map";
import RtPoint from "@/components/RtPoint";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/PageHeader";
import CollapseBtn from "@/components/CollapseBtn";
import { useGetClientMsmtPoints, useGetClientMsmtPoinMap, useDeletemsmtPoint } from "@/services/water/msmtPoint";
import { debounce } from "@/utils";
import Spinner from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import CustomModal from "@/components/modal/ConfirmModal";
import { useQueryClient } from "@tanstack/react-query";
import { measurementPointColumnProperties } from "@/utils/constant";
import { createRoot } from "react-dom/client";
import { showErrorToast } from "@/utils/tools";
import { toast } from "react-toastify";
import { DELETE_MSMTPOINT } from "@/services/water/msmtPoint/constant";

interface initialTableDataTypes {
  search: string;
  page_no: number,
  page_size: number,
  sort: string,
  sort_order: string
}
const initialTableData = {
  search: "",
  page_no: 1,
  page_size: 50,
  sort: '',
  sort_order: ''
}

const measurementPoint = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const [collapse, setCollapse] = useState("default");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], point: [38.86902846413033, -121.729324818604], msmtPointId: "", fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedField, setClickedField] = useState({ id: "", viewBounds: null });
  const [defaultWap, setDefaultWap] = useState<any>("")
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };
  const { data: msmtPointData, isLoading,refetch } = useGetClientMsmtPoints(tableInfo);
  const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetClientMsmtPoinMap();
  const { mutate: deleteMsmtPoint } = useDeletemsmtPoint();
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );

  const columns: ColumnDef<DummyDataType>[] = [
    {
      accessorKey: "conveyName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "convey_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Convey Name {tableInfo?.sort !== "convey_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      size: 150, // this size value is in px
      cell: ({ row }) => <div className="px-4" >{row.getValue("conveyName")}</div>,
    },
    {
      accessorKey: "msmtPointId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "msmt_point_id", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            MsmtPoint ID {tableInfo?.sort !== "msmt_point_id" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="px-4">{row.getValue("msmtPointId")}</div>,
    },
    {
      accessorKey: "msmtPointName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "msmt_point_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            MsmtPoint Name {tableInfo?.sort !== "msmt_point_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="px-4" >{row.getValue("msmtPointName")}</div>,
    },
    {
      id: "actions",
      header: "",
      size: 60,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { navigate(`/measurementPoints/${row.original.id}/edit`) }}>
              <FilePenLine /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => { setId(String(row.original.id!)); setOpen(true) }}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { navigate(`/measurementPoints/${row.original.id}/view`) }}>
              <Eye />
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: {
        className: "sticky right-0 !z-9 !bg-white !transition-colors dark:!bg-slateLight-500 ",
      },
    },
  ];

  const showInfo = (Label: String, Id: String) => {
    var popup = $("<div></div>", {
      id: `popup-${Id}`,
      class: "absolute top-2 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65",
    });
    // Insert a headline into that popup
    var hed = $("<div></div>", {
      text: "MsmtPoint ID: " + Id,
      css: { fontSize: "16px", marginBottom: "3px" },
    }).appendTo(popup);
    // Add the popup to the map
    popup.appendTo("#map");
  };

  const removeInfo = (Id: String) => {
    // $("#popup-" + Id).remove();
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
        auxLayer.setStyle({
          weight: 4,
          color: "#16599A",
          fillColor: "#5a76a380",
          opacity: 1,
        });
           createRoot(popupDiv).render(<div className="w-full h-full overflow-y-auto flex flex-col  py-2">
                            <div>Measurement Point Id: { auxLayer.feature.properties.msmt_point_id}</div>                            
                  </div>);
        showInfo("MsmtPoint ID: ",auxLayer.feature.properties.msmt_point_id);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2,
          color: "#16599A",
          fillColor: "#5a76a380",
          opacity: 1,
        });
        removeInfo(auxLayer.feature.properties.msmt_point_id);
      },
    });
  }

  useEffect(() => {
    setClickedField({ id: "", viewBounds: null })
  }, [defaultWap])

  const geoJsonStyle = (features: any) => {
    // console.log(features?.properties?.field_id,clickedField?.id?.toString(),"test")
    return {
      color: "#16599A", // Border color
      fillColor: "#5a76a380", // Fill color for normal areas
      fillOpacity: 1,
      weight: 2,
    };
  }
  const ReturnChildren = useMemo(() => {
    return (
      <>
      {mapData?.data && <RtGeoJson
        key={"fields"}
        layerEvents={geoJsonLayerEvents}
        style={geoJsonStyle}
        data={JSON.parse(mapData['data'])}
        color={"#16599a"}
      />}
        { !!position.point && !!position.msmtPointId ? (
          <RtPoint
            position={position.point}
          >
          </RtPoint>
          ) : null}
    </>
  )

  }, [mapLoading, position, mapData])

  const handleDelete = () => {
    deleteMsmtPoint(id, {
      onSuccess: () => {
        refetch();
        refetchMap();
        queryClient.invalidateQueries({ queryKey: [DELETE_MSMTPOINT] });
        toast.success("Measurement Point deleted successfully");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  };

  const mapConfiguration = useMemo(() => { return { 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } } }, []);
  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">

      <PageHeader
        pageHeaderTitle="Measurement Points"
        breadcrumbPathList={[{ menuName: "Water", menuPath: "" }]}
      />
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Measurement Point"
        description="Are you sure you want to delete this Measurement Point? This action cannot be undone."
        onConfirm={handleDelete}
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
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            onClick={() => {
              navigate(`/measurementPoints/add`)
            }}
          >
            <Plus size={4} />
            Add MsmtPoint
          </Button>
        </div>
        <div className="flex flex-grow">
          <div className={cn("relative w-1/2 flex flex-col gap-3 h-[calc(100vh-160px)]", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
            <div className={cn(" h-[calc(100vh-180px) w-full")}>
              <MapTable
                defaultData={msmtPointData?.data || []}
                columns={columns}
                setPosition={setPosition as Function}
                setZoomLevel={setZoomLevel as Function}
                setClickedField={setClickedField}
                clickedField={clickedField}
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={msmtPointData?.totalRecords || 1}
                collapse={collapse}
                isLoading={isLoading}
                customHeight="h-[calc(100vh-210px)]"
                tableType={"clientPoint"}
                columnProperties={measurementPointColumnProperties}
              />
              <CollapseBtn
                className="absolute -right-1 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
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
              {!mapLoading ? (<LeafletMap
                position={position}
                zoom={zoomLevel}
                collapse={collapse}
                // clickedField={clickedField}
                configurations={mapConfiguration}
                viewBound={clickedField?.viewBounds ?? mapData?.viewBounds}
              >
                {ReturnChildren}
              </LeafletMap>) : (<LeafletMap
                position={position}
                zoom={zoomLevel}
                collapse={collapse}
                // clickedField={clickedField}
                configurations={mapConfiguration}
              >
                <div className="absolute top-1/2 left-1/2 right-1/2 z-[800] flex gap-4 -ml-[70px] ">
                  <div className="flex  rounded-lg bg-[#16599a] text-slate-50 bg-opacity-65 p-2 text-xl h-auto gap-3 ">Loading <Spinner /></div>
                </div>
              </LeafletMap>)}
              <CollapseBtn
                className="absolute -left-4 top-1/2 z-[800] m-2 flex size-8 items-center justify-center"
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
  );
};

export default measurementPoint;
