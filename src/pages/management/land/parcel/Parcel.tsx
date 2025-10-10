import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import $ from "jquery";
import { Popup } from "react-leaflet";
import { cn } from "../../../../utils/cn";
import { ColumnDef } from "@tanstack/react-table";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import RtPolygon from "@/components/RtPolygon";
import RtGeoJson from "@/components/RtGeoJson";
import { DummyDataType } from "@/types/tableTypes";
import { Button } from "@/components/ui/button";
import { buildPopupMessage } from "@/utils/map";
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
import { deleteParcelByWAY, useGetParcelListByWAY, useGetParcelMapByWAY } from "@/services/water/parcel";
import { debounce, UnitSystemName } from "@/utils";
import Spinner from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import BasicSelect from "@/components/BasicSelect";
import { useGetWaysOptions } from "@/services/timeSeries";
import { showErrorToast } from "@/utils/tools";
import CustomModal from "@/components/modal/ConfirmModal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { parcelPageColumnProperties } from "@/utils/constant";
import { createRoot } from "react-dom/client";
import { DELETE_PARCEL_KEY_BY_WAY, GET_PARCEL_MAP_KEY_BY_WAY } from "@/services/water/parcel/constant";
import PermissionCheckWrapper from "@/components/wrappers/PermissionCheckWrapper";
import { useMableCollapse } from "@/utils/customHooks/useMableCollapse";
import { useTableData } from "@/utils/customHooks/useTableData";
import SearchInput from "@/components/SearchInput";
import { MableBodyWrapper, MableContainerWrapper, MableHeaderWrapper, MablePageWrapper, MapWrapper, TableDropdownWrapper, TableOnlyWrapper, TableWrapper, TableWrapperWithWapWay } from '@/components/wrappers/mableWrappers';
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

const Parcel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient()
  const { tableInfo, setTableInfo, searchText, handleClearSearch, handleSearch } = useTableData({ initialTableData })
  const { collapse, tableCollapseBtn, mapCollapseBtn } = useMableCollapse();
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedField, setClickedField] = useState({ id: "", viewBounds: null });
  const [defaultWay, setDefaultWay] = useState<any>("")
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const { data: fieldData, isLoading, refetch: refetchParcel } = useGetParcelListByWAY(tableInfo, defaultWay);
  const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetParcelMapByWAY(defaultWay);
  const { data: ways, isLoading: waysLoading } = useGetWaysOptions()
  const { mutate: deleteParcel, isPending: isFieldDeleting } = deleteParcelByWAY()

  const columns: ColumnDef<DummyDataType>[] = [
    {
      accessorKey: "parcelId",
      // header: "Field ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "parcel_id", sort_order: !tableInfo.sort_order || tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Parcel ID {tableInfo?.sort !== "parcel_id" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      size: 150, // this size value is in px
      cell: ({ row }) => <div className="capitalize">{row.getValue("parcelId")}</div>,
      //filterFn: 'includesString',
    },
    {
      accessorKey: "parcelName",
      // header: "Field ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "parcel_name", sort_order: !tableInfo.sort_order || tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Parcel Name {tableInfo?.sort !== "parcel_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      size: 150, // this size value is in px
      cell: ({ row }) => <div className="capitalize">{row.getValue("parcelName")}</div>,
      //filterFn: 'includesString',
    },
    {
      accessorKey: "parcelGeomHa",
      // header: () => {
      //     return <>Field Description</>;
      // },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "parcel_geom_ha", sort_order: !tableInfo.sort_order || tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Geom Area ({UnitSystemName()}) {tableInfo?.sort !== "parcel_geom_ha" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="lowercase">{row.getValue("parcelGeomHa")}</div>,
    },
    {
      accessorKey: "parcelIrrigHa",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "parcel_irrig_ha", sort_order: !tableInfo.sort_order || tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Irrig Area ({UnitSystemName()})  {tableInfo?.sort !== "parcel_irrig_ha" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="capitalize">{row.getValue("parcelIrrigHa")}</div>,
    },
    {
      accessorKey: "parcelLegalHa",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "parcel_legal_ha", sort_order: !tableInfo.sort_order || tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Legal Area ({UnitSystemName()}) {tableInfo?.sort !== "parcel_legal_ha" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="capitalize">{row.getValue("parcelLegalHa")}</div>,
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
            <PermissionCheckWrapper name="EditParcel">
              <DropdownMenuItem onClick={() => { navigate(`/parcels/${row.original.id}/edit/${defaultWay}`) }}>
                <FilePenLine /> Edit
              </DropdownMenuItem>
            </PermissionCheckWrapper>
            <PermissionCheckWrapper name="EditParcel">
              <DropdownMenuItem onClick={() => { setId(String(row.original.id!)); setOpen(true) }}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </PermissionCheckWrapper>
            <PermissionCheckWrapper name="ViewParcel">
              <DropdownMenuItem onClick={() => { navigate(`/parcels/${row.original.id}/view/${defaultWay}`) }}>
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
    deleteParcel({ parcelId: id, wayId: defaultWay }, {
      onSuccess: () => {
        refetchParcel();
        queryClient.invalidateQueries({ queryKey: [GET_PARCEL_MAP_KEY_BY_WAY] });
        queryClient.invalidateQueries({ queryKey: [DELETE_PARCEL_KEY_BY_WAY] });
        setClickedField({ id: "", viewBounds: null })
        toast.success("Parcel deleted successfully");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
        queryClient.invalidateQueries({ queryKey: [DELETE_PARCEL_KEY_BY_WAY] });
      },
    });
  };

  const polygonEventHandlers = useMemo(
    () => ({
      mouseover(e: any) {
        const { id } = e.target.options;
        showInfo('ParcelID: ', id);
      },
      mouseout(e: any) {
        const { id } = e.target.options;
        removeInfo(id);
      },
      click: (e: any) => {
        e.target.openPopup(); // Opens popup when clicked
      }
    }),
    [],
  );

  const showInfo = (Label: String, Id: String) => {
    var popup = $("<div></div>", {
      id: `popup-${Id}`,
      class: "absolute top-2 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65",
    });
    // Insert a headline into that popup
    var hed = $("<div></div>", {
      text: "ParcelID: " + Id,
      css: { fontSize: "16px", marginBottom: "3px" },
    }).appendTo(popup);
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
        createRoot(popupDiv).render(
          <div className="w-full h-full overflow-y-auto flex flex-col  py-2">
            <div>Parcel Id: {auxLayer.feature.properties.parcel_id}</div>
            <div>Irrig Area: {auxLayer.feature.properties.field_irrig_ha}</div>
            <div>Legal Area: {auxLayer.feature.properties.field_legal_ha}</div>
            <div>Geom Area: {auxLayer.feature.properties.field_geom_ha}</div>
            <div>Status: {auxLayer.feature.properties.field_act_bool ? "Active" : "Inactive"}</div>
          </div>);
        showInfo("ParcelID: ", auxLayer.feature.properties.parcel_id);
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
        removeInfo(auxLayer.feature.properties.parcel_id);
      },
    });
  }

  useEffect(() => {
    setClickedField({ id: "", viewBounds: null })
  }, [defaultWay])

  const ReturnChildren = useMemo(() => {

    const geoJsonStyle = (features: any) => {
      if (features?.properties?.parcel_id.toString() === clickedField?.id?.toString()) {
        return {
          color: "black", // Border color
          fillColor: "red", // Fill color for the highlighted area
          fillOpacity: 0.4,
          weight: 0,
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
        {mapData?.data && <RtGeoJson
          key={"parcels"}
          layerEvents={geoJsonLayerEvents}
          style={geoJsonStyle}
          data={JSON.parse(mapData['data'])}
          color={"#16599a"}
        />}
        {!!position.polygon ? (
          <RtPolygon
            pathOptions={{ id: position.parcelId } as Object}
            positions={position.polygon}
            color={"red"}
            eventHandlers={polygonEventHandlers as L.LeafletEventHandlerFnMap}
          >
            <Popup>
              <div key={position.parcelId} dangerouslySetInnerHTML={{ __html: buildPopupMessage(position.features) }} />
            </Popup>
          </RtPolygon>
        ) : null}
      </>
    )

  }, [mapLoading, position, mapData])

  const mapConfiguration = useMemo(() => { return { 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } } }, []);

  useEffect(() => {
    if (!!ways) {
      if (location.state?.wayId) {
        setDefaultWay(location.state.wayId)
      } else {
        setDefaultWay(ways?.data[0]?.value)
      }
    }
  }, [ways])


  return (
    <MablePageWrapper>
      <PageHeader
        pageHeaderTitle="Parcels"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Parcel"
        description="Are you sure you want to delete this Parcel? This action cannot be undone."
        onConfirm={handleDelete}
      />
      <MableContainerWrapper>
        <MableHeaderWrapper>
          <SearchInput
            value={searchText}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder='Search Parcel' />
          <PermissionCheckWrapper name="AddParcel">
            <Button
              variant={"default"}
              className="h-7 w-auto px-2 text-sm"
              onClick={() => {
                navigate(`/parcels/add`, { state: { wayId: defaultWay } })
              }}
            >
              <Plus size={4} />
              Add Parcel
            </Button>
          </PermissionCheckWrapper>
        </MableHeaderWrapper>
        <MableBodyWrapper>
          <TableWrapperWithWapWay collapse={collapse}>
            <TableDropdownWrapper>
              <div className='text-lg text-royalBlue dark:text-slate-50 '>Select Water Accounting Year</div>
              <div className="px-2"><BasicSelect setValue={setDefaultWay} Value={defaultWay!} itemList={ways?.data} showLabel={false} label="wap" /></div>
            </TableDropdownWrapper>
            <TableOnlyWrapper>
              <MapTable
                defaultData={fieldData?.data || []}
                columns={columns}
                setPosition={setPosition as Function}
                setZoomLevel={setZoomLevel as Function}
                setClickedField={setClickedField}
                clickedField={clickedField}
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={fieldData?.totalRecords || 1}
                collapse={collapse}
                isLoading={isLoading}
                idType={"parcelId"}
                customHeight="h-[calc(100dvh-312px)]"
                columnProperties={parcelPageColumnProperties}
              />
              <CollapseBtn
                className="absolute -right-1 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
                onClick={mapCollapseBtn}
                note={collapse === 'default' ? 'View Full Table' : "Show Map"}
              >
                <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </TableOnlyWrapper>
          </TableWrapperWithWapWay>

          <MapWrapper collapse={collapse}>
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
          </MapWrapper>
        </MableBodyWrapper>
      </MableContainerWrapper>
    </MablePageWrapper>
  );
};

export default Parcel;
