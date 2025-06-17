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
import { MsmtPointDataType } from "@/types/tableTypes";
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
import { useGetMsmtPointList, useGetFieldMapList } from "@/services/water/MsmtPoint";
import { debounce } from "@/utils";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";

interface initialTableDataTypes {
  search:string   ;
  page_no:number,
  page_size:number,
  sort: string  ,
  sort_order: string
}
const initialTableData = {
  search: "",
  page_no:1,
  page_size:50,
  sort: '',
  sort_order:''
}

const FieldMsmtPoint = () => {
  const navigate = useNavigate();
  const [tableInfo,setTableInfo] = useState<initialTableDataTypes>({...initialTableData})
  const [collapse, setCollapse] = useState("default");
  const [selectedFields, setSelectedFields] = useState<any>([]);
  const selectedFieldsRef = useRef(selectedFields);
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], point: [38.86902846413033, -121.729324818604], msmtPointId: "", features: {}, fields:[] });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedField, setClickedField] = useState(null);
  const [searchText, setSearchText] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    selectedFieldsRef.current = selectedFields;
  }, [selectedFields]);

  useEffect(() => {
    if (!!position.fields){
      setSelectedFields(position.fields)
    }
  }, [position.fields]);
  // const [doFilter, setDoFilter] = useState<Boolean>(false);
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };
const {data: msmtPoints, isLoading} = useGetMsmtPointList(tableInfo);
const {data:mapData,isLoading:mapLoading} = useGetFieldMapList();

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );



  const columns: ColumnDef<MsmtPointDataType>[] = [
      {
          accessorKey: "canal",
          // header: "Field ID",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"canal",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Canal {tableInfo?.sort !== "canal" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },

          size: 100, // this size value is in px
          cell: ({ row }) => <div className="capitalize">{row.getValue("canal")}</div>,
          //filterFn: 'includesString',
      },
      {
          accessorKey: "msmtPointId",
          // header: () => {
          //     return <>Field Description</>;
          // },
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo, sort:"msmt_point_id",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
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
                      onClick={() => {setTableInfo({...tableInfo,sort:"msmt_point_name",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                       Msmt Point Name {tableInfo?.sort !== "msmtPointName" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 150,
          cell: ({ row }) => <div className="capitalize">{row.getValue("msmtPointName")}</div>,
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
            showInfo(auxLayer.feature.properties.FieldID);
        },
        mouseout: function (e: any) {
          const auxLayer = e.target;
          removeInfo(auxLayer.feature.properties.FieldID)
        },
        click: function (e: any) {
          const auxLayer = e.target;
          if (selectedFieldsRef.current.includes(auxLayer.feature.properties.FieldID)){
            const arr = selectedFieldsRef.current.filter((item: object) => item !== auxLayer.feature.properties.FieldID);
            setSelectedFields(arr)
          } else {
            setSelectedFields((prev: any) => [...selectedFieldsRef.current, auxLayer.feature.properties.FieldID]);
          }
        }
    });
  }
  const handleMouseDown = () => {
    // Start timer: fire after 3 sec
    timerRef.current = window.setTimeout(() => {
      alert(selectedFields +' associated to \n'+position.msmtPointId + ' msmtPoints.' )
      setSelectedFields([])
    }, 3000);
  };

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
    return (
        <div className="flex h-full flex-col gap-1 px-4 pt-2">
            <PageHeader
                pageHeaderTitle="Field"
                breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
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
                                    debouncedSearch(e.target.value);}}
                            />
                        </div>
                       {tableInfo.search &&  <Button
                            variant={"default"}
                            className="h-7 w-7"
                            onClick={() => {setSearchText(""); setTableInfo({...tableInfo,search:""})}}
                        >
                         <X />
                        </Button>}
                    </div>
                    <Button
                      variant={"default"}
                      className="h-7 w-auto px-2 text-sm"
                      onClick={() => {
                                      navigate("/field/addField")
                                     }}
                    >
                        <Plus size={4} />
                        Add Field
                    </Button>
                </div>
                <div className="flex flex-grow">
                    <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
                        <div className={cn("relative h-[calc(100vh-160px)] w-full")}>
                            <MapTable
                                tableType={"point"}
                                defaultData={msmtPoints?.data || []}
                                columns={columns}
                                setPosition={setPosition as Function}
                                setZoomLevel={setZoomLevel as Function}
                                setClickedField={setClickedField}
                                tableInfo={tableInfo}
                                setTableInfo={setTableInfo}
                                totalData={msmtPoints?.total_records || 1}
                                collapse={collapse}
                                isLoading={isLoading}
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
                                configurations={{'minZoom': 11, 'containerStyle': { height: "100%", width: "100%" , overflow: "hidden", borderRadius: "8px" }}}
                            >
                              <RtGeoJson
                                  key={"fields"}
                                  layerEvents={geoJsonLayerEvents}
                                  style={geoJsonStyle}
                                  data={JSON.parse(mapData['data'])}
                                  color={"#16599a"}
                              />
                              {!!position.point ? (
                                <RtPoint
                                  position={position.point}
                                  handleMouseDown={handleMouseDown}
                                  cancel={cancel}
                                >
                                  <Popup>
                                    <div dangerouslySetInnerHTML={{ __html: "Please press icon for 3 secs to associate." }} />
                                  </Popup>
                                </RtPoint>
                              ) : null}
                            </LeafletMap>)  : (<LeafletMap
                                position={position}
                                zoom={zoomLevel}
                                collapse={collapse}
                                //clickedField={clickedField}
                                configurations={{'minZoom': 11, 'containerStyle': { height: "100%", width: "100%" , overflow: "hidden", borderRadius: "8px" }}}
                            >
                                <div className="absolute top-1/2 left-1/2 right-1/2 z-[800] flex gap-4 -ml-[70px] ">
                                  <div className="flex  rounded-lg bg-[#16599a] text-slate-50 bg-opacity-65 p-2 text-xl h-auto gap-3 ">Loading <Spinner/></div>
                                </div>
                        </LeafletMap>)}
                        <CollapseBtn
                            className="absolute -left-4 top-1/2 z-[11000] m-2 flex size-8 items-center justify-center"
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
