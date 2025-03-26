import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, Filter, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import $ from "jquery";
import { Popup } from "react-leaflet";
import { cn } from "../../../../utils/cn";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import RtPolygon from "@/components/RtPolygon";
import RtGeoJson from "@/components/RtGeoJson";
import DummyData from "../../../../../mapleData.json";
import { DummyDataType } from "@/types/tableTypes";
import { Button } from "@/components/ui/button";
import swmcFields from "../../../../geojson/SMWC_Fields.json";
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

const Field = () => {
  const [tableInfo,setTableInfo] = useState<initialTableDataTypes>({...initialTableData})
  const [collapse, setCollapse] = useState("default");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedField, setClickedField] = useState(null);
  const [searchText, setSearchText] = useState<String>("");
  const [doFilter, setDoFilter] = useState<Boolean>(false);
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };

const defaultData: DummyDataType[] = DummyData?.data as DummyDataType[];

  const columns: ColumnDef<DummyDataType>[] = [
      {
          accessorKey: "FieldID",
          // header: "Field ID",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"FieldID",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Field ID {tableInfo?.sort !== "FieldID" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },

          size: 100, // this size value is in px
          cell: ({ row }) => <div className="capitalize">{row.getValue("FieldID")}</div>,
          //filterFn: 'includesString',
      },
      {
          accessorKey: "FieldDesc",
          // header: () => {
          //     return <>Field Description</>;
          // },
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"FieldDesc",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Field Description {tableInfo?.sort !== "FieldDesc" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 300,
          cell: ({ row }) => <div className="lowercase">{row.getValue("FieldDesc")}</div>,
      },
      {
          accessorKey: "FieldAcres",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"FieldAcres",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                       Field Acres {tableInfo?.sort !== "FieldAcres" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 150,
          cell: ({ row }) => <div className="capitalize">{row.getValue("FieldAcres")}</div>,
      },
      {
          accessorKey: "IrrigAcres",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"IrrigAcres",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                       Irrig Acres {tableInfo?.sort !== "IrrigAcres" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 150,
          cell: ({ row }) => <div className="capitalize">{row.getValue("IrrigAcres")}</div>,
      },
      {
          accessorKey: "StandbyAcr",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"StandbyAcr",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Stand by Acres {tableInfo?.sort !== "StandbyAcr" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 200,
          cell: ({ row }) => <div>{row.getValue("StandbyAcr")}</div>,
      },
      {
          accessorKey: "ParcelID",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                        onClick={() => {setTableInfo({...tableInfo,sort:"ParcelID",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      ParcelID
                     {tableInfo?.sort !== "ParcelID" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 300,
          cell: ({ row }) => <div>{row.getValue("ParcelID")}</div>,
      },
      {
          accessorKey: "VolRateAdj",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                       onClick={() => {setTableInfo({...tableInfo,sort:"VolRateAdj",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      VolRateAdj
                      {tableInfo?.sort !== "VolRateAdj" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 150,
          cell: ({ row }) => <div>{row.getValue("VolRateAdj")}</div>,
      },
      {
          accessorKey: "ActiveDate",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"ActiveDate",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Active Date
                       {tableInfo?.sort !== "ActiveDate" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 150,
          cell: ({ row }) => <div>{dayjs(row.getValue("ActiveDate")).format("MM/DD/YYYY")}</div>,
      },
      {
          accessorKey: "InactiveDa",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                       onClick={() => {setTableInfo({...tableInfo,sort:"InactiveDa",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Inactive Date
                      {tableInfo?.sort !== "InactiveDa" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 150,
          cell: ({ row }) => <div>{dayjs(row.getValue("InactiveDa")).format("MM/DD/YYYY")}</div>,
      },
      {
          accessorKey: "ActiveFlag",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"ActiveFlag",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Active Status
                      {tableInfo?.sort !== "ActiveFlag" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          cell: ({ row }) => <div>{row.getValue("ActiveFlag")}</div>,
      },
      {
          accessorKey: "unq_fld_id",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => {setTableInfo({...tableInfo,sort:"unq_fld_id",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Unique Flag ID
                      {tableInfo?.sort !== "unq_fld_id" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          cell: ({ row }) => <div>{row.getValue("unq_fld_id")}</div>,
      },
      {
          accessorKey: "AreaAC",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                     onClick={() => {setTableInfo({...tableInfo,sort:"AreaAC",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                  >
                      Area Acres
                     {tableInfo?.sort !== "AreaAC" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          cell: ({ row }) => <div>{row.getValue("AreaAC")}</div>,
      },
      {
          id: "actions",
          header: "",
          size: 40,
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
            showInfo(auxLayer.feature.properties.FieldID);
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
            removeInfo(auxLayer.feature.properties.FieldID);
        },
    });
  }

  const geoJsonStyle = (features: any) => {
    if (features?.properties?.FieldID === clickedField) {
        return {
            color: "red", // Border color
            fillColor: "#16599A", // Fill color for the highlighted area
            fillOpacity: 0.5,
            weight: 2,
        };
    }
    return {
        color: "#16599A", // Border color
        fillColor: "lightblue", // Fill color for normal areas
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
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search..."
                                className="w-full bg-transparent text-sm text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                                value={String(searchText)}
                                onChange={(e) => {
                                    setSearchText(String(e.target.value));
                                    setDoFilter(!doFilter);

                                }}
                            />
                        </div>
                        <Button
                            variant={"default"}
                            className="h-7 w-7"
                            onClick={() => setDoFilter(!doFilter)}
                        >
                            <Filter />
                        </Button>
                    </div>
                    <Button
                        variant={"default"}
                        className="h-7 w-auto px-2 text-sm"
                    >
                        <Plus size={4} />
                        Add Field
                    </Button>
                </div>
                <div className="flex flex-grow">
                    <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
                        <div className={cn("relative h-[calc(100vh-160px)] w-full")}>
                            <MapTable
                                defaultData={defaultData}
                                columns={columns}
                                doFilter={doFilter}
                                filterValue={searchText}
                                setPosition={setPosition as Function}
                                setZoomLevel={setZoomLevel as Function}
                                setClickedField={setClickedField}
                                clickedField={clickedField}
                                tableInfo={tableInfo}
                                setTableInfo={setTableInfo}
                                totalData={defaultData?.length}
                                collapse={collapse}
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
                            <LeafletMap
                                position={position}
                                zoom={zoomLevel}
                                collapse={collapse}
                                clickedField={clickedField}
                                configurations={{'minZoom': 11, 'containerStyle': { height: "100%", width: "100%" , overflow: "hidden", borderRadius: "8px" }}}
                            >
                              <RtGeoJson
                                  key={"fields"}
                                  layerEvents={geoJsonLayerEvents}
                                  style={geoJsonStyle}
                                  data={swmcFields}
                                  color={"#16599a"}
                              />
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
                            </LeafletMap>
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

export default Field;
