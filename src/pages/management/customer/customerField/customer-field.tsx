import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import $ from "jquery";
import { Circle, Popup } from "react-leaflet";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
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
import { useDeleteFieldByWAP, useGetFieldList, useGetFieldListByWAP, useGetFieldMapByWAP, useGetFieldMapList } from "@/services/water/field";
import { debounce, UnitSystemName } from "@/utils";
import Spinner from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import BasicSelect from "@/components/BasicSelect";
import { useGetWaps, useGetWaysOptions } from "@/services/timeSeries";
import { showErrorToast } from "@/utils/tools";
import CustomModal from "@/components/modal/ConfirmModal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DELETE_FIELD_KEY_BY_FIELD, GET_FIELD_LIST_KEY_BY_WAP } from "@/services/water/field/constant";
import { cn } from "@/lib/utils";
import { useGetCustomerFieldListByWAP } from "@/services/customerField";

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

const CustomerField = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient()
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const [collapse, setCollapse] = useState("default");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedField, setClickedField] = useState({ id: "", viewBounds: null });
  // const [clickedGeom,setClickedGeom] = useState<any>({id: "", viewBounds: null});
  const [defaultWap, setDefaultWap] = useState<any>("")
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  // const [doFilter, setDoFilter] = useState<Boolean>(false);
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };
  // const { data: fieldData, isLoading } = useGetFieldList(tableInfo);
  const { data: customerFieldData, isLoading } = useGetCustomerFieldListByWAP(tableInfo, defaultWap);
  const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetFieldMapByWAP(defaultWap);
  //  const { data: mapData, isLoading: mapLoading } = useGetFieldMapList();
  const { data: wapsOptions, isLoading: wapsLoading } = useGetWaps()
  const { mutate: deleteField, isPending: isFieldDeleting } = useDeleteFieldByWAP()
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "fieldId",
      // header: "Field ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "field_id", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Field ID {tableInfo?.sort !== "FieldID" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      size: 100, // this size value is in px
      cell: ({ row }) => <div className="capitalize">{row.getValue("fieldId")}</div>,
      //filterFn: 'includesString',
    },
    {
      accessorKey: "fieldName",
      // header: () => {
      //     return <>Field Description</>;
      // },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "field_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Field Name {tableInfo?.sort !== "fieldName" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="lowercase">{row.getValue("fieldName")}</div>,
    },
    {
      accessorKey: "customers",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "field_irrig_ha", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Customers({UnitSystemName()})  {tableInfo?.sort !== "fieldIrrigHa" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="capitalize">{row.getValue("customers")}</div>,
    },
    // {
    //   accessorKey: "fieldLegalHa",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => { setTableInfo({ ...tableInfo, sort: "field_legal_ha", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
    //       >
    //         Stand by Acres ({UnitSystemName()}) {tableInfo?.sort !== "fieldLegalHa" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
    //       </Button>
    //     );
    //   },
    //   size: 180,
    //   cell: ({ row }) => <div className="capitalize">{row.getValue("fieldLegalHa")}</div>,
    // },
    // {
    //   accessorKey: "fieldActBool",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => { setTableInfo({ ...tableInfo, sort: "field_act_bool", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
    //       >
    //         Active Status
    //         {tableInfo?.sort !== "fieldActBool" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => <div className="flex justify-center items-center">{row.getValue("fieldActBool") ? <div className="w-3 h-3 rounded-full bg-green-500 "></div> : <div className="w-3 h-3 rounded-full bg-red-500"></div>}</div>,
    // },
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
            <DropdownMenuItem onClick={() => { navigate(`/customer-field/waps/${defaultWap}/edit/${row.original.id}`) }}>
              <FilePenLine /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => { setId(String(row.original.id!)); setOpen(true) }}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { navigate(`/customer-field/waps/${defaultWap}/view/${row.original.id}`) }}>
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

  const handleDelete = () => {
    deleteField({ fieldId: id, wapId: defaultWap }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [GET_FIELD_LIST_KEY_BY_WAP] })
        refetchMap();
        queryClient.invalidateQueries({ queryKey: [DELETE_FIELD_KEY_BY_FIELD] });
        toast.success("Client deleted successfully");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  };

  const polygonEventHandlers = useMemo(
    () => ({
      mouseover(e: any) {
        const { id } = e.target.options;
        showInfo(id);
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

  const showInfo = (Id: String) => {
    var popup = $("<div></div>", {
      id: "popup-" + Id,
      class: "absolute top-2 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65",
    });
    // Insert a headline into that popup
    var hed = $("<div></div>", {
      text: "FieldID: " + Id,
      css: { fontSize: "16px", marginBottom: "3px" },
    }).appendTo(popup);
    // Add the popup to the map
    popup.appendTo("#map");
  };

  const removeInfo = (Id: String) => {
    $("#popup-" + Id).remove();
  };

  const geoJsonLayerEvents = (feature: any, layer: any) => {
    layer.bindPopup(buildPopupMessage(feature.properties));
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
          //color: "#800080"
        });
        showInfo(auxLayer.feature.properties.field_id);
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
        removeInfo(auxLayer.feature.properties.field_id);
      },
    });
  }

  // const geoJsonStyle = (features: any) => {
  //   if (features?.properties?.FieldID === clickedField) {
  //     return {
  //       color: "red", // Border color
  //       fillColor: "#transparent", // Fill color for the highlighted area
  //       fillOpacity: 0.5,
  //       weight: 2,
  //     };
  //   }
  //   return {
  //     color: "#16599A", // Border color
  //     fillColor: "transparent", // Fill color for normal areas
  //     fillOpacity: 0.5,
  //     weight: 2,
  //   };
  // }

  useEffect(() => {
    setClickedField({ id: "", viewBounds: null })
  }, [defaultWap])

  const ReturnChildren = useMemo(() => {

    const geoJsonStyle = (features: any) => {
      // console.log(features?.properties?.field_id,clickedField?.id?.toString(),"test")
      if (features?.properties?.field_id === clickedField?.id?.toString()) {

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
      {mapData && <RtGeoJson
        key={"fields"}
        layerEvents={geoJsonLayerEvents}
        style={geoJsonStyle}
        data={JSON.parse(mapData['data'])}
        color={"#16599a"}
      />}
      {!!position.polygon ? (
        <RtPolygon
          pathOptions={{ id: position.fieldId } as Object}
          positions={position.polygon}
          color={"red"}
          eventHandlers={polygonEventHandlers as L.LeafletEventHandlerFnMap}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ __html: buildPopupMessage(position.features) }} />
          </Popup>
        </RtPolygon>
      ) : null}
    </>
  )

  }, [mapLoading, position, mapData])

  const mapConfiguration = useMemo(() => { return { 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } } }, []);

  useEffect(() => {
    if (!!wapsOptions) {
      if (location.state?.wapId) {
        setDefaultWap(location.state.wapId)
      } else {
        setDefaultWap(wapsOptions?.data[0]?.value)
      }
    }
  }, [wapsOptions])



  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">

      <PageHeader
        pageHeaderTitle="Customer-Field"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" },{ menuName: "Customers", menuPath: "" }]}
      />
<CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Field"
        description="Are you sure you want to delete this Field? This action cannot be undone."
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
              navigate(`/customer-field/add`)
            }}
          >
            <Plus size={4} />
            Add Links
          </Button>
        </div>
        <div className="flex flex-grow">
          <div className={cn("relative w-1/2 flex flex-col gap-3 h-[calc(100vh-160px)]", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
         <div className='flex flex-col gap-2 bg-white p-2  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors '>
              <div className='text-lg text-royalBlue dark:text-slate-50 '>Select Water Accounting Period</div>
              <div className="px-2"><BasicSelect setValue={setDefaultWap} Value={defaultWap!} itemList={wapsOptions?.data} showLabel={false} label="wap" /></div>
            </div>
            <div className={cn(" h-[calc(100vh-312px) w-full")}>
              <MapTable
                defaultData={customerFieldData?.data || []}
                columns={columns}
                setPosition={setPosition as Function}
                setZoomLevel={setZoomLevel as Function}
                setClickedField={setClickedField}
                clickedField={clickedField}
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={customerFieldData?.totalRecords || 1}
                collapse={collapse}
                isLoading={isLoading}
                customHeight="h-[calc(100vh-312px)]"
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
              className={cn("relative flex h-[calc(100vh-160px)] w-full")}
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

export default CustomerField;
