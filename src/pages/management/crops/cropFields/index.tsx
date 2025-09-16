import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import $, { data } from "jquery";
import { ColumnDef } from "@tanstack/react-table";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import RtGeoJson from "@/components/RtGeoJson";
import { Button } from "@/components/ui/button";
import { createRoot } from 'react-dom/client';
import {
  Form
} from "@/components/ui/form"
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
import { useGetCustomerFieldDetailByWAP, useGetCustomerFieldListByWAP, useGetCustomerFieldMapByWAP, usePutCustomerField } from "@/services/customerField";
import { MsmtPointInfo } from '@/utils/tableLineChartInfo';
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/FormComponent/FormInput";
import { error } from "console";
import { GET_ALL_CUSTOMER_FIELD, POST_CUSTOMER_FIELD } from "@/services/customerField/constants";
import { de } from "zod/dist/types/v4/locales";
import { set } from "date-fns";
import CustomerFieldModal from "./cropFieldModal";
import { useGetCropFieldDetailByWAP, useGetCropFieldMapByWAP, useGetCropsFieldListByWAP, usePutCropField } from "@/services/crops";
import { GET_ALL_CROP_FIELDS_LIST, GET_ALL_CROP_FIELDS_MAP, PUT_CROPS_FIELD } from "@/services/crops/constants";
import CropFieldModal from "./cropFieldModal";
import { cropFieldColumnProperties } from "@/utils/constant";
import AllFieldList from "./AllFieldList";

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
  crops: z.array(
    z.object({
      fieldName: z.string().optional(),
      cropName: z.string().optional(),
      fieldId: z.coerce.number().optional(),
      cropId: z.coerce.number().optional(),
      pctFarmed: z.coerce.number().optional(), // optional range check
    })
  ),
  comment: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

const CropField = () => {
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
  const [geojson, setGeojson] = useState<any>({ id: null, fieldGeojson: null, msmtPoint: null, viewBounds: null, existingFieldIds: [], existingPcts: [], cropName: "" })
  // const [clickedGeom,setClickedGeom] = useState<any>({id: "", viewBounds: null});
  const [defaultWap, setDefaultWap] = useState<any>("")
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [fields,setFields] = useState<any>(null)
  // const [doFilter, setDoFilter] = useState<Boolean>(false);
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };
  const { data: cropsFieldData, isLoading } = useGetCropsFieldListByWAP(tableInfo, defaultWap);
  const { data: mapData, isLoading: mapLoading, refetch: refetchMap } = useGetCropFieldMapByWAP(defaultWap);
  const { data: fieldCropData, isLoading: isFieldCustomerDataLoading, refetch } = useGetCropFieldDetailByWAP(defaultWap!, id!)
  const { mutate: updateCropField, isPending: isCustomerFieldUpdating } = usePutCropField();
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
      accessorKey: "cropName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Crop Name {tableInfo?.sort !== "crop_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="lowercase">{row.getValue("cropName")}</div>,
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
 cell: ({ row }: any) => <div className=" flex flex-wrap gap-3 text-sm h-auto w-auto">{<div className="flex gap-2">{row.getValue("fieldPctFarmed")?.slice(0,5)?.join(", ")} {row.getValue("fieldPctFarmed")?.length > 5 && <button type={"button"}  className="text-blue-500 underline text-xs" onClick={()=>{setFields(row.original)}}>View All</button>}  </div>}</div>,
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
            <DropdownMenuItem onClick={() => { setId(row.original.cropId); setOpen(true) }} >
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
          // fillOpacity: 0.5,
        });
        removeInfo(auxLayer.feature.properties.field_id);
      },
      click: function (e: any) {
        const auxLayer = e.target;
        if (selectedFieldsRef.current.includes(auxLayer.feature.properties.field_id)) {
          const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.field_id);
          setSelectedFields(arr)
        } else {
          setSelectedFields((prev: any) => [...selectedFieldsRef.current, auxLayer.feature.properties.field_id]);
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
        showInfo("FieldID: ", auxLayer.feature.properties.crop_field_ids);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          // fillColor: "red",
          // fillOpacity: 0.3,
        });
        removeInfo(auxLayer.feature.properties.crop_field_ids);
      },
      click: function (e: any) {
        const auxLayer = e.target;

        if (selectedFieldsRef.current.includes(auxLayer.feature.properties.field_pct_farmed.split(' ')[0])) {
          const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.field_pct_farmed.split(' ')[0]);
          selectedFieldsRef.current = arr
          setSelectedFields(arr)
        } else {
          const arr = [...selectedFieldsRef.current, auxLayer.feature.properties.field_pct_farmed.split(' ')[0]]
          setSelectedFields((prev: any) => arr);
        }
      }
    });
  }

  useEffect(() => {
    if (!!geojson.fieldGeojson) {
      setSelectedFields(geojson.existingFieldIds)
      selectedFieldsRef.current = geojson.existingFieldIds;
      setId(geojson.id)
    }
  }, [geojson])

  useEffect(() => {
    if (!!selectedFields) {
      selectedFieldsRef.current = selectedFields;
    }
  }, [selectedFields])
  useEffect(() => {
    setGeojson({ fieldGeojson: null, msmtPoint: null, viewBounds: null, existingFieldIds: [], cropName: "" })
  }, [defaultWap])

  const geoJsonStyle = (feature: any) => {
    if (selectedFields.includes(feature.properties.crop_field_ids || feature.properties.field_id)) {
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
    if (selectedFields.includes(feature.properties.crop_field_ids)) {
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
    geojson.existingFieldIds.forEach((key: string, index: number) => {
      fieldPctMapper[key.toString()] = geojson.existingPcts[index];
    });

    let data = selectedFields.map((field: string) => {
      let pctFarmed = fieldPctMapper.hasOwnProperty(field) ? fieldPctMapper[field] : 100
      return ({ 'field_id': field, 'pct_farmed': pctFarmed })
    })
    console.log(geojson.id, defaultWap, data,"test")
    const formData = { wapId: defaultWap, cropId: geojson.id, data: { crops: data, checkValidation: true }  }
    updateCropField(formData, {
      onSuccess: (data: any) => {
        if (!data?.success) {
          setConflictFields(data?.data)
          setProcessConflictFields(true)
          setOpen(true)
        } else {
          queryClient.invalidateQueries({ queryKey: [PUT_CROPS_FIELD] })
          queryClient.invalidateQueries({ queryKey: [GET_ALL_CROP_FIELDS_LIST] });
          queryClient.invalidateQueries({ queryKey: [GET_ALL_CROP_FIELDS_MAP] });
          refetchMap();
          refetch();
          toast.success(data?.message);
          setProcessConflictFields(false)
          setId("");
        }
      },
      onError: (error) => {
        showErrorToast(error?.response?.data?.message || "Failed to create Link");
        queryClient.invalidateQueries({ queryKey: [PUT_CROPS_FIELD] });
      },
    });
  }

  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">

      <PageHeader
        pageHeaderTitle="Crop-Field"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Crops", menuPath: "/crops" }]}
      />
      <CustomModal
        isOpen={fields ? true : false}
        onClose={() => setFields(null)}
        title={`Linked with ${fields?.cropName}`}
        showActionButton={false}
        children={<AllFieldList fields={fields}/>}
      />
      {/* <EditModel /> */}
      {open && <CropFieldModal
        cropId={id || geojson.id}
        wap_id={defaultWap}
        cropfields={processConflictFields ? conflictFields : fieldCropData?.data}
        isConflictFields={processConflictFields}
        setOpen={setOpen}
        refetchMap={refetchMap}
        refetch={refetch}
        setId={setId}
        setConflictFields={setConflictFields}
        setProcessConflictFields={setProcessConflictFields}
        cropName={processConflictFields ? geojson.cropName : ""}
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
                defaultData={cropsFieldData?.data || []}
                columns={columns}
                setPosition={setPosition as Function}
                setZoomLevel={setZoomLevel as Function}
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={cropsFieldData?.totalRecords || 1}
                collapse={collapse}
                isLoading={isLoading}
                customHeight="h-[calc(100vh-312px)]"
                setGeojson={setGeojson as Function}
                tableType={"cropField"}
                columnProperties={cropFieldColumnProperties}
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
                  key={"cropFields"}
                  layerEvents={fieldJsonLayerEvents}
                  style={fieldGeojsonStyle}
                  data={JSON.parse(geojson?.fieldGeojson)}
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

export default CropField;
