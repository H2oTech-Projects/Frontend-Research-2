import CollapseBtn from '@/components/CollapseBtn';
import LeafletMap from '@/components/LeafletMap';
import PageHeader from '@/components/PageHeader'
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { useDeleteConveyance, useGetConveyanceList, useGetConveyanceMap } from '@/services/convayance';
import { conveyanceDataType, initialTableDataTypes } from '@/types/tableTypes';
import { cn } from '@/utils/cn';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MapTable from '@/components/Table/mapTable';
import { GET_CONVEYANCE_LIST, GET_CONVEYANCE_MAP } from '@/services/convayance/constants';
import { showErrorToast } from '@/utils/tools';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CustomModal from '@/components/modal/ConfirmModal';
import RtGeoJson from '@/components/RtGeoJson';
import { conveyColumnProperties } from '@/utils/constant';
import { createRoot } from 'react-dom/client';
import $ from "jquery";
import PermissionCheckWrapper from '@/components/wrappers/PermissionCheckWrapper';
import { useMableCollapse } from '@/utils/customHooks/useMableCollapse';
import { useTableData } from '@/utils/customHooks/useTableData';
import SearchInput from '@/components/SearchInput';
import { MableBodyWrapper, MableContainerWrapper, MableHeaderWrapper, MablePageWrapper, MapWrapper, TableWrapper } from '@/components/wrappers/mableWrappers';

const initialTableData = {
  search: "",
  page_no: 1,
  page_size: 50,
  sort: '',
  sort_order: ''
}
const Conveyances = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { tableInfo, setTableInfo, searchText, handleClearSearch, handleSearch } = useTableData({ initialTableData });
  const { collapse, tableCollapseBtn, mapCollapseBtn } = useMableCollapse();
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedGeom, setClickedGeom] = useState<any>({ id: "", viewBounds: null });
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const { data: conveyData, isLoading: conveyLoading } = useGetConveyanceList(tableInfo);
  const { mutate: deleteConveyance, isPending: isConveyanceDeleting } = useDeleteConveyance();
  const { data: mapGeoJson, isLoading: isMapLoading } = useGetConveyanceMap();
  const columns: ColumnDef<conveyanceDataType>[] = [

    {
      accessorKey: "conveyName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "convey_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Convey Name{tableInfo?.sort !== "convey_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 150,
      cell: ({ row }) => <div className="px-4">{row.getValue("conveyName")}</div>,
    },
    {
      accessorKey: "conveyId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "convey_id", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Convey ID{tableInfo?.sort !== "convey_id" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 150,
      cell: ({ row }) => <div className="px-4">{row.getValue("conveyId")}</div>,
    },
    {
      accessorKey: "conveyTypeName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "convey_type_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Convey Type Name{tableInfo?.sort !== "convey_type_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="px-4">{row.getValue("conveyTypeName")}</div>,
    },
    {
      accessorKey: "conveyParentName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "convey_parent_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Parent Name{tableInfo?.sort !== "convey_parent_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="px-4">{row.getValue("conveyParentName")}</div>,
    },
    {
      accessorKey: "conveySeepageCms",        // header: "Field ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "convey_seepage_cms", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Seepage{tableInfo?.sort !== "convey_seepage_cms" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 150,
      cell: ({ row }) => <div className="px-4">{row.getValue("conveySeepageCms")}</div>,
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
            <PermissionCheckWrapper name="EditConveyance">
              <DropdownMenuItem onClick={() => { navigate(`/conveyances/${row.original.id}/edit`) }}>
                <FilePenLine /> Edit
              </DropdownMenuItem>
            </PermissionCheckWrapper>
            <PermissionCheckWrapper name="EditConveyance">
              <DropdownMenuItem onClick={() => { setId(row.original.id); setOpen(true) }}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </PermissionCheckWrapper>
            <PermissionCheckWrapper name="ViewConveyance">
              <DropdownMenuItem onClick={() => { navigate(`/conveyances/${row.original.id}/view`) }}>
                <Eye />
                View
              </DropdownMenuItem>
            </PermissionCheckWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: {
        className: "sticky right-0 !z-9 !bg-white !transition-colors dark:!bg-slateLight-500 ",
      },
    },
  ];

  const handleDelete = () => {
    deleteConveyance(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_LIST] })
        queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_MAP] })
        toast.success("Client deleted successfully");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
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
          <div>Conveyance Id: {auxLayer.feature.properties.convey_id}</div>
          <div>Conveyance Name: {auxLayer.feature.properties.convey_name}</div>
          <div>Seepage: {auxLayer.feature.properties.convey_seepage_cms}</div>
        </div>);
        showInfo("Conveyance Name", auxLayer.feature.properties.convey_id, auxLayer.feature.properties.convey_name);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          //fillColor: "lightblue",
          fillOpacity: 0,
          opacity: 1,
        });
        removeInfo(auxLayer.feature.properties.convey_id);
      },
    })
  };

  const mapConfiguration = useMemo(() => { return { 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } } }, []);

  const ReturnChildren = useMemo(() => {
    const geoJsonStyle = (features: any) => {
      if (features?.properties?.convey_id === clickedGeom?.id?.toString()) {

        return {
          color: "red", // Border color
          fillColor: "transparent", // Fill color for the highlighted area
          fillOpacity: 0.5,
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
          mapGeoJson?.data?.geojson && (
            <RtGeoJson
              layerEvents={geoJsonLayerEvents}
              data={JSON.parse(mapGeoJson?.data?.geojson)}
              style={geoJsonStyle}
              key={"clientData"}
              color="#9370DB" />
          )
        )}
      </>
    )

  }, [isMapLoading, clickedGeom, mapGeoJson])

  return (
    <MablePageWrapper>
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Client"
        description="Are you sure you want to delete this conveyance? This action cannot be undone."
        onConfirm={handleDelete}
      />
      <PageHeader
        pageHeaderTitle="Conveyances"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
      <MableContainerWrapper>
        <MableHeaderWrapper>
          <SearchInput
            value={searchText}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder='Search Conveyance' />
          <PermissionCheckWrapper name="AddConveyance">
            <Button
              variant={"default"}
              className="h-7 w-auto px-2 text-sm"
              onClick={() => {
                navigate("/conveyances/add", {
                  state: { mode: "Add" },
                });
              }}
            >
              <Plus size={4} />
              Add Conveyance
            </Button>
          </PermissionCheckWrapper>
        </MableHeaderWrapper>
        <MableBodyWrapper>
          <TableWrapper collapse={collapse}>
            <MapTable
              defaultData={conveyData?.data || []}
              columns={columns}
              setPosition={setPosition as Function}
              setZoomLevel={setZoomLevel as Function}
              setClickedGeom={setClickedGeom as Function}
              tableType={"conveyance"}
              tableInfo={tableInfo}
              setTableInfo={setTableInfo}
              totalData={conveyData?.totalRecords || 1}
              collapse={collapse}
              isLoading={conveyLoading}
              columnProperties={conveyColumnProperties}
            />
            <CollapseBtn
              className="absolute -right-4 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
              onClick={mapCollapseBtn}
              note={collapse === 'default' ? 'View Full Table' : "Show Map"}
            >
              <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
            </CollapseBtn>
          </TableWrapper>

          <MapWrapper collapse={collapse}>
            <LeafletMap
              position={position}
              zoom={zoomLevel}
              collapse={collapse}
              viewBound={clickedGeom?.viewBound ?? mapGeoJson?.data?.viewBounds}
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
          </MapWrapper>
        </MableBodyWrapper>
      </MableContainerWrapper>
    </MablePageWrapper>
  )
}

export default Conveyances
