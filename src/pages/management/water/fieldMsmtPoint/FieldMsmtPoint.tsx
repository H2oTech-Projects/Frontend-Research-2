import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import $ from "jquery";
import { Popup } from "react-leaflet";
import { cn } from "../../../../utils/cn";
import { ColumnDef } from "@tanstack/react-table";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import RtPoint from "@/components/RtPoint";
import RtGeoJson from "@/components/RtGeoJson";
import { Button } from "@/components/ui/button";
import { useGetWaps, useGetMsmtPointFields } from '@/services/timeSeries'
import { toast } from 'react-toastify';
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
import BasicSelect, { GeneralSelect } from "@/components/BasicSelect";
import { useGetMsmtPointList, useClientGetFieldMapList, useMsmtPointFields, useGetApportionMethodType } from "@/services/water/msmtPoint";
import { MsmtPointDataT } from "@/types/apiResponseType";
import { debounce } from "@/utils";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import CustomModal from "@/components/modal/ConfirmModal";
import { set } from "date-fns";
import { z } from "zod";
import { link } from "fs";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormComboBox } from "@/components/FormComponent/FormRTSelect";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/FormComponent/FormInput";

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


const ApportionSchema = z.object({
  apportionMethodType: z.coerce.number(),
  data: z
    .array(
      z.object({
        fieldId: z.string(),
        percent: z.coerce.number().nullable().optional(),
        manualVol: z.coerce.number().nullable().optional(),
      })).optional(),

});

type ApportionFormType = z.infer<typeof ApportionSchema>;

const FieldMsmtPoint = () => {
  const navigate = useNavigate();
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const [collapse, setCollapse] = useState("default");
  const [selectedFields, setSelectedFields] = useState<any>([]);
  const selectedFieldsRef = useRef(selectedFields);
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], point: [38.86902846413033, -121.729324818604], msmtPointId: "", features: {}, fields: [] });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedField, setClickedField] = useState(null);
  const [searchText, setSearchText] = useState("");
  const timerRef = useRef<number | null>(null);
  const [defaultWap, setDefaultWap] = useState<any>("")
  const [viewBound, setViewBound] = useState<any>()
  const [enableLink, setEnableLink] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");

  const form = useForm<any>({
    resolver: zodResolver(ApportionSchema),
    defaultValues: {
      apportionMethodType: undefined,
      data: []
    },
    shouldUnregister: true,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "data"
  });

  const { data: msmtPoints, isLoading, refetch: refetchMsmtPoints } = useGetMsmtPointList(tableInfo, defaultWap);
  const { data: mapData, isLoading: mapLoading } = useClientGetFieldMapList();
  const { data: msmtPointFields, refetch: refetchmsmtPointFields } = useGetMsmtPointFields(position?.msmtPointId || null, defaultWap)
  const { data: ways, isLoading: waysLoading } = useGetWaps()
  const { mutate: updateMsmtPointField, isPending: isClientUpdating } = useMsmtPointFields()
  const { data: apportionMethodType, isLoading: methodTypeLoading } = useGetApportionMethodType()

  useEffect(() => {
    if (apportionMethodType && !methodTypeLoading) {
      form.setValue("apportionMethodType", apportionMethodType?.data?.options[0]?.value)
    }

  }, [apportionMethodType])

  useEffect(() => {
    selectedFieldsRef.current = selectedFields;
    setEnableLink(detectFieldChange())
  }, [selectedFields]);

  useEffect(() => {
    if (!!mapData && !!mapData['data']['view_bounds'])
      setViewBound(mapData['data']['view_bounds'])
  }, [mapData]);

  useEffect(() => {
    if (!!ways) {
      setDefaultWap(ways['data'][0]["value"])
    }
  }, [ways])

  useEffect(() => {
    if (!!defaultWap) {
      refetchMsmtPoints()
    }
  }, [defaultWap])

  useEffect(() => {
    if (!!position) {
      !!position?.msmtPointId && defaultWap && refetchmsmtPointFields()
      setSelectedFields(position.fields)
      // setEnableLink(false)
    }
  }, [position])

  useEffect(() => {
    if (!!msmtPointFields) {
      setSelectedFields(msmtPointFields.data)
      setViewBound(msmtPointFields.viewBounds)
    }
  }, [msmtPointFields])

  const detectFieldChange = () => {
    const sorted1 = [...selectedFields].sort();
    const sorted2 = [...position.fields].sort();
    return sorted1.length != sorted2.length || !sorted1.every((value, index) => value === sorted2[index])
  }
  // const [doFilter, setDoFilter] = useState<Boolean>(false);
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );

  const columns: ColumnDef<MsmtPointDataT>[] = [
    {
      accessorKey: "msmtPointId",
      // header: () => {
      //     return <>Field Description</>;
      // },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "msmt_point_id", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Msmt Point ID {tableInfo?.sort !== "msmtPointId" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 300,
      cell: ({ row }) => <div className="lowercase">{row.getValue("msmtPointId")}</div>,
    },
    {
      accessorKey: "msmtPointName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "msmt_point_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Msmt Point Name {tableInfo?.sort !== "msmtPointName" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 150,
      cell: ({ row }) => <div className="capitalize">{row.getValue("msmtPointName")}</div>,
    },
    {
      accessorKey: "fields",
      // header: "Field ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
          >
            Fields {tableInfo?.sort !== "canal" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      size: 100, // this size value is in px
      cell: ({ row }) => <div className="capitalize">{row.getValue("fields")}</div>,
      //filterFn: 'includesString',
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
            <DropdownMenuItem>
              <FilePenLine /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Trash2 />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>
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
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        // showInfo(auxLayer.feature.properties.FieldID);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        // removeInfo(auxLayer.feature.properties.FieldID)
      },
      click: function (e: any) {
        const auxLayer = e.target;
        if (selectedFieldsRef.current.includes(auxLayer.feature.properties.FieldID)) {
          const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.FieldID);
          setSelectedFields(arr)
        } else {
          setSelectedFields((prev: any) => [...selectedFieldsRef.current, auxLayer.feature.properties.FieldID]);
        }
      }
    });
  }
  const handleMouseDown = () => {
    // Start timer: fire after 2 sec
    timerRef.current = window.setTimeout(() => {
      updateMsmtPointField({ id: position.msmtPointId, wapId: defaultWap, fields: selectedFields }, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          toast.success("successfully linked.");
        },
        onError: (error) => {
          toast.error("Not linked.");
        },
      })
    }, 2000);
  };

  const associateFieldMsmtpoint = () => {
    updateMsmtPointField({ id: position.msmtPointId, wapId: defaultWap, fields: selectedFields }, {
      onSuccess: (data: any) => {
        // Invalidate and refetch
        toast.success("successfully linked.");
        setPosition({ ...position, fields: selectedFields })
        setEnableLink(false)
      },
      onError: (error) => {
        toast.error("Not linked.");
      },
    })
  }

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const geoJsonStyle = (feature: any) => {
    if (selectedFields.includes(feature.properties.FieldID)) {
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
  }

  const onSubmit = (data: ApportionFormType) => {
    console.log(position.msmtPointId)
    const formData = {
      id: position.msmtPointId, wapId: defaultWap, linkedFields: selectedFields,
      apportion_method_type_id: data?.apportionMethodType,
      fields: apportionMethodType?.data?.apportionVolPercentIds.includes(form.watch("apportionMethodType")) ? data?.data : null
    }
    updateMsmtPointField(formData, {
      onSuccess: (data: any) => {
        // Invalidate and refetch
        toast.success("successfully linked.");
        setPosition({ ...position, fields: selectedFields })
        setEnableLink(false)
        setOpen(false)
      },
      onError: (error) => {
        toast.error("Not linked.");
      },
    })
  };

  const handleConfirm = () => {
    console.log("hello")


  };

  const handleAssociatePopUp = () => {
    const dividedPercentage = 100 / selectedFields.length
    const fieldData = selectedFields?.map((item: any) => {
      return {
        fieldId: item,
        percent: dividedPercentage,
        manualVol: null

      }
    })
    append(fieldData)
    setOpen(true)
  }

  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <PageHeader
        pageHeaderTitle="Measurement Point-Field"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
      <CustomModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
          setPosition({ ...position, fields: selectedFields })
          setEnableLink(true)
          form.reset()
          remove(fields.map((_, index) => index));
        }}
        title="Link Measurement Point and Fields"
        confirmText="Link"
        onConfirm={handleConfirm}
        isDeleteModal={false}
        showActionButton={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-[508px]" >
            <FormComboBox
              control={form.control}
              name='apportionMethodType'
              label='Apportion Method'
              placeholder='Select Apportion Method'
              options={apportionMethodType?.data?.options} />
            {
              apportionMethodType?.data?.apportionVolPercentIds.includes(form.watch("apportionMethodType")) && <div className="flex flex-col gap-2 h-[350px] overflow-auto">

                <div className="flex gap-3 items-center " >
                  <div className="w-1/4 flex justify-start">Field IDs</div>
                  <div className="">Percent (%)</div>
                  <div>Manual Volume (M3)</div>
                </div>
                {
                  fields?.map((item: any, index) => {
                    return (<div className="flex gap-3 items-center" key={item?.id}>
                      {item?.fieldId} :
                      <FormInput
                        control={form.control}
                        name={`data.${index}.percent`}
                        label='Percent (%)'
                        placeholder='Enter Percentage'
                        type='number'
                        showLabel={false}
                      />


                      <FormInput
                        control={form.control}
                        name={`data.${index}.manualVol`}
                        label='Manual Volume'
                        placeholder='Enter manual'
                        type='number'
                        showLabel={false}
                      />

                      <></>
                    </div>)
                  })
                }

              </div>
            }
            <div className="flex items-center justify-center gap-3 ">
              <Button variant={"default"} type="submit" >Link</Button> <Button onClick={() => {
                setOpen(false)
                setPosition({ ...position, fields: selectedFields })
                setEnableLink(true)
                form.reset()
                remove(fields.map((_, index) => index));
              }} variant={"destructive"} type="button">Cancel</Button>

            </div>
          </form>
        </Form>
      </CustomModal>
      <div className="pageContain flex flex-grow flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex justify-left gap-2">

            <div className="flex gap-2">

              <div className="input h-7 w-100">

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
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            disabled={!enableLink}
            onClick={handleAssociatePopUp}
          >
            <Plus size={4} />
            Link MsmtPoint-Field
          </Button>
        </div>
        <div className="flex flex-grow">
          <div className={cn("relative w-1/2 flex flex-col gap-3 h-[calc(100vh-160px)]", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
            <div className='flex flex-col gap-2 bg-white p-2  dark:text-slate-50 dark:bg-slate-600 rounded-lg shadow-xl transition-colors '>
              <div className='text-lg text-royalBlue dark:text-slate-50 '>Select Water Accounting Year</div>
              <div className="px-2"><BasicSelect setValue={setDefaultWap} Value={defaultWap!} itemList={ways?.data} showLabel={false} label="wap" /></div>
            </div>
            <div className={cn(" h-[calc(100vh-260px) w-full")}>
              <MapTable
                tableType={"point"}
                defaultData={msmtPoints?.data || []}
                columns={columns}
                setPosition={setPosition as Function}
                setZoomLevel={setZoomLevel as Function}
                setClickedField={setClickedField}
                clickedField={clickedField}
                tableInfo={tableInfo}
                setTableInfo={setTableInfo}
                totalData={msmtPoints?.totalRecords || 1}
                collapse={collapse}
                isLoading={isLoading}
                customHeight="h-[calc(100vh-308px)]" // increase h-[calc(100vh-160px)] to h-[calc(100vh-308px)] by adding 48px
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
                //clickedField={clickedField}
                viewBound={viewBound}
                configurations={{ 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } }}
              >
                <RtGeoJson
                  key={"fields"}
                  layerEvents={geoJsonLayerEvents}
                  style={geoJsonStyle}

                  data={JSON.parse(mapData['data']['geojson'])}
                  color={"#16599a"}
                />
                {!!position.point && !!position.msmtPointId ? (
                  <RtPoint
                    position={position.point}
                    handleMouseDown={handleMouseDown}
                    cancel={cancel}
                  >
                    {/* <Popup>
                                    <div dangerouslySetInnerHTML={{ __html: "Please press icon for 3 secs to associate." }} />
                                  </Popup> */}
                  </RtPoint>
                ) : null}
              </LeafletMap>) : (<LeafletMap
                position={position}
                zoom={zoomLevel}
                collapse={collapse}
                //clickedField={clickedField}
                configurations={{ 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } }}
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

export default FieldMsmtPoint;
