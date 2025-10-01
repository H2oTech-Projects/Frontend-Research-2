import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import $, { data } from "jquery";
import { ColumnDef } from "@tanstack/react-table";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import RtGeoJson from "@/components/RtGeoJson";
import { Button } from "@/components/ui/button";
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
import { useSelector } from 'react-redux';
import PermissionCheckWrapper from "@/components/wrappers/PermissionCheckWrapper";
import { debounce } from "@/utils";
import Spinner from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import BasicSelect from "@/components/BasicSelect";
import { useGetWaysOptions } from "@/services/timeSeries";
import CustomModal from "@/components/modal/ConfirmModal";
import { showErrorToast, AgroItems } from "@/utils/tools";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useGetCustomerParcelListByWAY, usePutCustomerParcel } from "@/services/customerParcel";
import { useGetParcelMapByWAY } from "@/services/water/parcel";
// import { MsmtPointInfo } from '@/utils/tableLineChartInfo';
import { z } from "zod";
import { GET_ALL_CUSTOMER_FIELD, POST_CUSTOMER_FIELD } from "@/services/customerField/constants";
import { customerParcelColumnProperties } from "@/utils/constant";
import { useMableCollapse } from "@/utils/customHooks/useMableCollapse";
import SearchInput from "@/components/SearchInput";
import { useTableData } from "@/utils/customHooks/useTableData";
import { MableBodyWrapper, MableContainerWrapper, MableHeaderWrapper, MablePageWrapper, MapWrapper, TableDropdownWrapper, TableOnlyWrapper, TableWrapper, TableWrapperWithWapWay } from '@/components/wrappers/mableWrappers';

const MAX_ITEMS_LENGTH = 5;
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

const formSchema = z.object({
  customers: z.array(
    z.object({
      fieldName: z.string().optional(),
      customerName: z.string().optional(),
      parcelId: z.coerce.number().optional(),
      customerId: z.coerce.number().optional(),
      pctFarmed: z.coerce.number().optional(), // optional range check
      parcelIds: z.string().optional(),
    })
  ),
  comment: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

const CustomerParcel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const timerRef = useRef<number | null>(null);
  const [selectedFields, setSelectedFields] = useState<any>([]);
  const UserRole = useSelector((state: any) => state.auth?.userRole);
  const selectedFieldsRef = useRef(selectedFields);
  const { tableInfo, setTableInfo, searchText, handleClearSearch, handleSearch } = useTableData({ initialTableData });
  const { collapse, tableCollapseBtn, mapCollapseBtn } = useMableCollapse();
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], parcelId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  // const [clickedField, setClickedField] = useState({ id: "", viewBounds: null });
  const [geojson, setGeojson] = useState<any>({ id: null, parcelGeojson: null, msmtPoint: null, viewBounds: null, existingFieldIds: [], existingPcts: [], customerName: "" })
  // const [clickedGeom,setClickedGeom] = useState<any>({id: "", viewBounds: null});
  const [defaultWay, setDefaultWay] = useState<any>("")
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [agroItems, setAgroItems] = useState<any>(null)
  const { data: customerFieldData, isLoading } = useGetCustomerParcelListByWAY(tableInfo, defaultWay);
  //const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetCustomerFieldMapByWAP(defaultWay);
  const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetParcelMapByWAY(defaultWay);
  // const { data: fieldCustomerData, isLoading: isFieldCustomerDataLoading, refetch } = useGetCustomerFieldDetailByWAP(defaultWay!, id!)
  const { mutate: updateCustomerParcel, isPending: updatingCustomerParcels } = usePutCustomerParcel();
  const { data: waysOptions, isLoading: waysLoading } = useGetWaysOptions()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "customerName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "customer_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Customer Name {tableInfo?.sort !== "customer_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="px-3" >{row.getValue("customerName")}</div>,
    },
    {
      accessorKey: "parcelIds",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "parcel_ids", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Parcels   {tableInfo?.sort !== "parcel_ids" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      size: 180,
      // @ts-ignore
      cell: ({ row }: any) =>
        <div className=" flex flex-wrap gap-3 text-sm h-auto w-auto">
          <div className="flex gap-2">
            {row.getValue("parcelIds")?.slice(0, MAX_ITEMS_LENGTH)?.join(", ")}
            {row.getValue("parcelIds")?.length > MAX_ITEMS_LENGTH && <button type={"button"} className="text-blue-500 underline text-xs" onClick={() => { setAgroItems(row.original) }}>View All</button>}
          </div>
        </div>,
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
            {/* <DropdownMenuItem onClick={() => { navigate(`/customer-field/waps/${defaultWay}/edit/${row.original.fieldId}`) }}> */}
            <PermissionCheckWrapper name="EditCustomerParcel">
              <DropdownMenuItem onClick={() => { setId(row.original.customerId); setOpen(true) }} >
                <FilePenLine /> Edit
              </DropdownMenuItem>
            </PermissionCheckWrapper>

            {/* <DropdownMenuItem onClick={() => { setId(String(row.original.id!)); setOpen(true) }}>
              <Trash2 />
              Delete
            </DropdownMenuItem> */}
            <PermissionCheckWrapper name="ViewCustomerParcel">
              <DropdownMenuItem >
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


  const showInfo = (Label: String, Id: String) => {
    var popup = $("<div></div>", {
      id: "popup-" + Id,
      class: "absolute top-2 left-2 z-[1002] h-auto w-auto p-2 rounded-[8px] bg-royalBlue text-slate-50 bg-opacity-65",
    });
    // Insert a headline into that popup
    var hed = $("<div></div>", {
      text: `${Label} ${Id}`,
      css: { fontSize: "16px", marginBottom: "3px" },
    }).appendTo(popup);
    // Add the popup to the map
    popup.appendTo("#map");
  };

  const removeInfo = (Id: String) => {
    $("[id^='popup-']").remove();
  };

  const geoJsonLayerEvents = useCallback((feature: any, layer: any) => {
    // layer.bindPopup(buildPopupMessage(feature.properties));

    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
          //color: "#800080"
        });
        showInfo("parcelID: ", auxLayer.feature.properties.parcel_id);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          fillOpacity: 0.5,
        });
        removeInfo(auxLayer.feature.properties.parcel_id);
      },
      click: function (e: any) {
        const auxLayer = e.target;
        removeInfo(auxLayer.feature.properties.parcel_id)
        if (selectedFieldsRef.current.includes(auxLayer.feature.properties.parcel_id)) {
          const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.parcel_id);
          setSelectedFields(arr)
        } else {
          setSelectedFields((prev: any) => [...selectedFieldsRef.current, auxLayer.feature.properties.parcel_id]);
        }
      }
    });
  },[])

  const fieldJsonLayerEvents = useCallback((feature: any, layer: any) => {
    // layer.bindPopup(buildPopupMessage(feature.properties));
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
          //color: "#800080"
        });
        showInfo("parcelID: ", auxLayer.feature.properties.parcel_id);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          fillColor: "red",
          fillOpacity: 0.3,
        });
        removeInfo(auxLayer.feature.properties.parcel_id);
      },
      click: function (e: any) {
        const auxLayer = e.target;
        removeInfo(auxLayer.feature.properties.parcel_id)
        if (selectedFieldsRef.current.includes(auxLayer.feature.properties.parcel_id)) {
          const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.parcel_id);
          setSelectedFields(arr)
        } else {
          setSelectedFields((prev: any) => [...selectedFieldsRef.current, auxLayer.feature.properties.parcel_id]);
        }
      }
    });
  },[])

  useEffect(() => {
    if (!!geojson.parcelGeojson) {
      setSelectedFields(geojson.existingParcelIds)
      selectedFieldsRef.current = geojson.existingParcelIds;
      setId(geojson.id)
    }
  }, [geojson])

  useEffect(() => {
    if (!!selectedFields) {
      selectedFieldsRef.current = selectedFields;
    }
  }, [selectedFields])

  useEffect(() => {
    setGeojson({ parcelGeojson: null, viewBounds: null, existingParcelIds: [], customerName: "" })
  }, [defaultWay])

  const geoJsonStyle = useCallback((feature: any) => {
    if (selectedFields.includes(feature.properties.parcel_id)) {
      return {
        color: "#16599A", // Border color
        fillColor: "red", // Fill color for the highlighted area
        fillOpacity: .4,
        weight: 2,
      };
    }
    return {
      color: "#16599A", // Border color
      fillColor: "transparent", // Fill color for normal areas
      fillOpacity: 0.5,
      weight: 2,
    };
  },[selectedFields])
  const fieldGeojsonStyle = useCallback((feature: any) => {
    if (selectedFields.includes(feature.properties.parcel_id)) {
      return {
        color: "#16599A", // Border color
        fillColor: "red", // Fill color for the highlighted area
        fillOpacity: .4,
        weight: 2,
        zIndex: 150, // Ensure it is above the RtPoint
      };
    }
    return {
      color: "#16599A", // Border color
      fillColor: "transparent", // Fill color for normal areas
      fillOpacity: 0.5,
      weight: 2,
    };
  },[selectedFields])

  // }, [mapLoading, mapData, geojson, selectedFields])

  const mapConfiguration = useMemo(() => { return { 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } } }, []);

  useEffect(() => {
    if (!!waysOptions) {
      if (location.state?.wayId) {
        setDefaultWay(location.state.wayId)
      } else {
        setDefaultWay(waysOptions?.data[0]?.value)
      }
    }
  }, [waysOptions])

  const handleAssociatePopUp2 = () => {
    if (selectedFields.length < 1) return;

    const formData = { wayId: defaultWay, customerId: geojson.id, data: { parcels: selectedFields } }
    updateCustomerParcel(formData, {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] })
        queryClient.invalidateQueries({ queryKey: [GET_ALL_CUSTOMER_FIELD] });
        refetchMap();
        //refetch();
        toast.success(data?.message);
        setId("");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data?.message || "Failed to create Link");
        queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] });
      },
    });
  }

  return (
    <MablePageWrapper>
      <PageHeader
        pageHeaderTitle="Customer-Parcel"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Customers", menuPath: "/customers" }]}
      />
      <CustomModal
        isOpen={!!(agroItems)}
        onClose={() => setAgroItems(null)}
        title={`Linked with ${agroItems?.customerName}`}
        showActionButton={false}
        children={<AgroItems data={agroItems?.parcelIds} name={"Parcels"} />}
      />
      <MableContainerWrapper>
        <MableHeaderWrapper>
          <SearchInput
            value={searchText}
            onChange={handleSearch}
            onClear={handleClearSearch}
            placeholder='Search' />
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            onClick={handleAssociatePopUp2}
            disabled={UserRole !== 'Admin' || updatingCustomerParcels}
          >
            <Plus size={4} />
            Add Links
          </Button>
        </MableHeaderWrapper>
        <MableBodyWrapper>
          <TableWrapperWithWapWay collapse={collapse}>
            <TableDropdownWrapper>
              <div className='text-lg text-royalBlue dark:text-slate-50 '>Select Water Accounting Year</div>
              <div className="px-2"><BasicSelect setValue={setDefaultWay} Value={defaultWay!} itemList={waysOptions?.data} showLabel={false} label="wap" /></div>
            </TableDropdownWrapper>
            <TableOnlyWrapper>
              <MapTable
                defaultData={customerFieldData?.data || []}
                columns={columns}
                setPosition={setPosition as Function}
                setZoomLevel={setZoomLevel as Function}
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={customerFieldData?.totalRecords || 1}
                collapse={collapse}
                isLoading={isLoading}
                customHeight="h-[calc(100vh-312px)]"
                setGeojson={setGeojson as Function}
                tableType={"customerParcel"}
                idType={'customerId'}
                clickedField={geojson}
                columnProperties={customerParcelColumnProperties}
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
              viewBound={geojson?.viewBounds ?? mapData?.viewBounds}
            >
              {mapData?.data && <RtGeoJson
                key={"fields"}
                layerEvents={geoJsonLayerEvents}
                style={geoJsonStyle}
                data={JSON.parse(mapData['data'])}
                color={"#16599a"}
              />}
              {geojson?.parcelGeojson && <RtGeoJson
                key={"customerFields"}
                layerEvents={fieldJsonLayerEvents}
                style={fieldGeojsonStyle}
                data={JSON.parse(geojson?.parcelGeojson)}
                color={"#16599a"}
              />}
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

export default CustomerParcel;
