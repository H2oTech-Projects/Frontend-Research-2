import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, Filter, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import $ from "jquery";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/PageHeader";

const Field = () => {
  const [collapse, setCollapse] = useState("default");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "" });
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Field ID {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}

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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Field Description
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Field Acres
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Irrig Acres
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                  </Button>
              );
          },
          size: 150,
          cell: ({ row }) => <div className="capitalize">{row.getValue("IrrigAcres")}</div>,
      },
      // {
      //     accessorKey: "status",
      //     header: "status",
      //     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
      // },
      {
          accessorKey: "StandbyAcr",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Stand by Acres
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      ParcelID
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      VolRateAdj
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Active Date
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Inactive Date
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Active Status
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Unique Flag ID
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Area Acres
                      {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
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
              className: "sticky right-0 !z-9 !bg-white !transition-colors dark:!bg-slate-500 ",
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
    }),
    [],
  );

  const showInfo = (Id: String) => {
    var popup = $("<div></div>", {
        id: "popup-" + Id,
        css: {
            position: "absolute",
            height: "50px",
            width: "150px",
            top: "0px",
            left: "0px",
            zIndex: 1002,
            backgroundColor: "white",
            //padding: "200px",
            border: "1px solid #ccc",
        },
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
                                    if (!String(e.target.value)) {
                                        setDoFilter(!doFilter);
                                    }
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
                            />
                            <Button
                                className="absolute -right-4 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
                                onClick={mapCollapseBtn}
                            >
                                <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
                            </Button>
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
                              />
                              {!!position.polygon ? (
                                <RtPolygon
                                    pathOptions={{ id: position.fieldId } as Object}
                                    positions={position.polygon}
                                    color={"red"}
                                    eventHandlers={polygonEventHandlers as L.LeafletEventHandlerFnMap}
                                />
                              ) : null}
                            </LeafletMap>
                            <Button
                                className="absolute -left-4 top-1/2 z-[800] m-2 flex size-8 items-center justify-center"
                                onClick={tableCollapseBtn}
                            >
                                <ChevronsLeft className={cn(collapse === "table" ? "rotate-180" : "")} size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Field;
