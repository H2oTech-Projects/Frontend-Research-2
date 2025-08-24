import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import $ from "jquery";
import { ColumnDef } from "@tanstack/react-table";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import RtGeoJson from "@/components/RtGeoJson";
import { Button } from "@/components/ui/button";
import { createRoot } from 'react-dom/client';
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
import { debounce } from "@/utils";
import Spinner from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import BasicSelect from "@/components/BasicSelect";
import { useGetWaps } from "@/services/timeSeries";
import { showErrorToast } from "@/utils/tools";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useGetCustomerFieldDetailByWAP, useGetCustomerFieldListByWAP, useGetCustomerFieldMapByWAP, usePutCustomerField } from "@/services/customerField";
import { MsmtPointInfo } from '@/utils/tableLineChartInfo';
import { z } from "zod";
import { GET_ALL_CUSTOMER_FIELD, POST_CUSTOMER_FIELD } from "@/services/customerField/constants";
import CustomerFieldModal from "./customerFieldModal";

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
      fieldId: z.coerce.number().optional(),
      customerId: z.coerce.number().optional(),
      pctFarmed: z.coerce.number().optional(), // optional range check
    })
  ),
  comment: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

const CustomerField = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const timerRef = useRef<number | null>(null);
  const [selectedFields, setSelectedFields] = useState<any>([]);
  const selectedFieldsRef = useRef(selectedFields);
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const [collapse, setCollapse] = useState("default");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  // const [clickedField, setClickedField] = useState({ id: "", viewBounds: null });
  const [geojson, setGeojson] = useState<any>({ id: null, fieldGeojson: null, msmtPoint: null, viewBounds: null, existingFieldIds:[], existingPcts:[], customerName: "", fieldIids: []})
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
  const { data: customerFieldData, isLoading } = useGetCustomerFieldListByWAP(tableInfo, defaultWap);
  const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetCustomerFieldMapByWAP(defaultWap);
  const { data: fieldCustomerData, isLoading: isFieldCustomerDataLoading, refetch } = useGetCustomerFieldDetailByWAP(defaultWap!, id!)
  const { mutate: updateCustomerField, isPending: isCustomerFieldUpdating } = usePutCustomerField();
  const { data: wapsOptions, isLoading: wapsLoading } = useGetWaps()
  const [conflictFields, setConflictFields] = useState([]);
  const [processConflictFields, setProcessConflictFields] = useState(false)

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );

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
      cell: ({ row }) => <div>{row.getValue("customerName")}</div>,
    },
    {
      accessorKey: "fieldPctFarmed",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "field_pct_farmed", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Fields   {tableInfo?.sort !== "field_pct_farmed" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }:any) => <div className=" flex flex-wrap h-auto w-auto">{row.getValue("fieldPctFarmed")?.map((item:any)=>{return <div key={item}>{item},</div>})}</div>,
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
            {/* <DropdownMenuItem onClick={() => { navigate(`/customer-field/waps/${defaultWap}/edit/${row.original.fieldId}`) }}> */}
            <DropdownMenuItem onClick={() => { setId(row.original.customerId); setOpen(true) }} >
              <FilePenLine /> Edit
            </DropdownMenuItem>

            {/* <DropdownMenuItem onClick={() => { setId(String(row.original.id!)); setOpen(true) }}>
              <Trash2 />
              Delete
            </DropdownMenuItem> */}
            <DropdownMenuItem >
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

  const geoJsonLayerEvents = (feature: any, layer: any) => {
    // layer.bindPopup(buildPopupMessage(feature.properties));

    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
          //color: "#800080"
        });
        showInfo("FieldID: ", auxLayer.feature.properties.field_id);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          fillOpacity: 0.5,
        });
        removeInfo(auxLayer.feature.properties.field_id);
      },
      click: function (e: any) {
        const auxLayer = e.target;
        removeInfo(auxLayer.feature.properties.field_id)
        if (selectedFieldsRef.current.includes(auxLayer.feature.properties.field_id)) {
          const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.field_id);
          selectedFieldsRef.current = arr
          setSelectedFields(arr)
        } else {
          const arr = [...selectedFieldsRef.current, auxLayer.feature.properties.field_id]
          selectedFieldsRef.current = arr
          setSelectedFields((prev: any) => arr);
        }
      }
    });
  }

  const fieldJsonLayerEvents = (feature: any, layer: any) => {
    // layer.bindPopup(buildPopupMessage(feature.properties));
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
          //color: "#800080"
        });
        showInfo("FieldID: ", auxLayer.feature.properties.customer_field_ids);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          fillColor: "red",
          fillOpacity: 0.3,
        });
        removeInfo(auxLayer.feature.properties.customer_field_ids);
      },
      click: function (e: any) {
        const auxLayer = e.target;
        removeInfo(auxLayer.feature.properties.field_pct_farmed)
        if (selectedFieldsRef.current.includes(auxLayer.feature.properties.field_pct_farmed)) {
          const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.field_pct_farmed);
          setSelectedFields(arr)
        } else {
          setSelectedFields((prev: any) => [...selectedFieldsRef.current, auxLayer.feature.properties.field_pct_farmed]);
        }
      }
    });
  }
  const pointLayerEvents = (feature: any, layer: any) => {
    // layer.bindPopup(buildPopupMessage(feature.properties));
    const popupDiv = document.createElement('div');
    popupDiv.className = 'popup-map';
    // @ts-ignore
    popupDiv.style = "border-radius:8px; overflow:hidden";
    popupDiv.id = feature.properties?.msmt_point_id;
    layer.bindPopup(popupDiv, { maxHeight: 30, maxWidth: 70, className: 'customer-field-msmtpoint' });

    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
        });
        createRoot(popupDiv).render(<MsmtPointInfo mpId={auxLayer.feature.properties.mp_id} msmtPointId={auxLayer.feature.properties.msmt_point_id} wapId={defaultWap} />);
        showInfo('MsmtPoint: ', auxLayer.feature.properties.msmt_point_id);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2,
        });
        removeInfo(auxLayer.feature.properties.msmt_point_id);
      },
    });
  }
  useEffect(() => {
    if (!!geojson.fieldGeojson){
      setSelectedFields(geojson.existingFieldIds)
      selectedFieldsRef.current = geojson.existingFieldIds;
      setId(geojson.id)
    }
  }, [geojson])

  useEffect(() => {
    if (!!selectedFields){
      selectedFieldsRef.current = selectedFields;
    }
  }, [selectedFields])

  useEffect(() => {
    setGeojson({ fieldGeojson: null, msmtPoint: null, viewBounds: null, existingFieldIds: [], customerName: "" })
  }, [defaultWap])

  const geoJsonStyle = (feature: any) => {
    if (selectedFields.includes(feature.properties.field_id)) {
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
  }
  const fieldGeojsonStyle = (feature: any) => {
    if (selectedFields.includes(feature.properties.field_id)) {
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
  }
  const pointGeojsonStyle = (features: any) => {
    return {
      color: "white",
      fillColor: "blue", // Fill color for normal areas
      fillOpacity: 1,
      weight: 2,
    };
  }

  // }, [mapLoading, mapData, geojson, selectedFields])

  const mapConfiguration = useMemo(() => { return { 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } } }, []);

  useEffect(() => {
    if (!!wapsOptions) {
      if (location.state?.wapId) {
        setDefaultWap(location.state.wapId)
      } else {
        setDefaultWap(wapsOptions?.currentWap?.value)
      }
    }
  }, [wapsOptions])

  const handleAssociatePopUp2 = () => {
    if (selectedFields.length < 1) {
      showErrorToast({"Error": ["None Field is selected."]});
      return;
    };
    const fieldPctMapper: { [key: string]: any } = {};
    const fieldIdMapper: { [key: string]: any } = {};
    geojson.existingFieldIds.forEach((key: string, index: number) => {
      fieldPctMapper[key.toString()] = geojson.existingPcts[index];
      fieldIdMapper[key.toString()] = geojson.fieldIids[index];
    });
    let data = selectedFields.map((field: string) => {
      let pctFarmed = fieldPctMapper.hasOwnProperty(field) ? fieldPctMapper[field] : 100
      let farmIid = fieldIdMapper.hasOwnProperty(field) ? fieldIdMapper[field] : 100
      return ({'field_name': field,'pct_farmed': pctFarmed, 'field_id': farmIid})
    })
    const formData ={wapId:defaultWap, customerId: geojson.id, data: {customers: data, checkValidation: true}}
    updateCustomerField(formData, {
    onSuccess: (data: any) => {
      if (!data?.success){
        setConflictFields(data?.data)
        setProcessConflictFields(true)
        setOpen(true)
      } else{
        queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] })
        queryClient.invalidateQueries({ queryKey: [GET_ALL_CUSTOMER_FIELD] });
        refetchMap();
        refetch();
        toast.success(data?.message);
        setId("");
      }
    },
    onError: (error) => {
      showErrorToast(error?.response?.data?.message || "Failed to create Link");
      queryClient.invalidateQueries({ queryKey: [POST_CUSTOMER_FIELD] });
    },
  });
  }

  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">

      <PageHeader
        pageHeaderTitle="Customer-Field"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Customers", menuPath: "" }]}
      />
      {/* <EditModel /> */}
      {open && <CustomerFieldModal
        customerId={id || geojson.id}
        wap_id={defaultWap}
        customerfields={processConflictFields ? conflictFields : fieldCustomerData?.data}
        isConflictFields={processConflictFields}
        setOpen={setOpen}
        refetchMap={refetchMap}
        refetch={refetch}
        setId={setId}
        setConflictFields={setConflictFields}
        setProcessConflictFields={setProcessConflictFields}
        customerName={processConflictFields ? geojson.customerName : ""}
      />}
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
            onClick={handleAssociatePopUp2}
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
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={customerFieldData?.totalRecords || 1}
                collapse={collapse}
                isLoading={isLoading}
                customHeight="h-[calc(100vh-312px)]"
                setGeojson={setGeojson as Function}
                tableType={"relation"}
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
                viewBound={geojson?.viewBounds ?? mapData?.viewBounds}
              >
                {mapData?.data && <RtGeoJson
                    key={"fields"}
                    layerEvents={geoJsonLayerEvents}
                    style={geoJsonStyle}
                    data={JSON.parse(mapData['data'])}
                    color={"#16599a"}
                  />}
                  {geojson?.fieldGeojson && <RtGeoJson
                    key={"customerFields"}
                    layerEvents={fieldJsonLayerEvents}
                    style={fieldGeojsonStyle}
                    data={JSON.parse(geojson?.fieldGeojson)}
                    color={"#16599a"}
                  />}
                  {geojson?.msmtPoint && <RtGeoJson
                    key={"msmtPoints"}
                    layerEvents={pointLayerEvents}
                    style={pointGeojsonStyle}
                    data={JSON.parse(geojson?.msmtPoint)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerField;
