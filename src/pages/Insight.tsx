import $ from "jquery";
import LeafletMap from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { AccountDetails, dummyGroundWaterDataTypes, FarmUnit } from "@/types/tableTypes";
import dummyGroundWaterData from "../../data_demo2.json"
import MapTable from "@/components/Table/mapTable";
import InsightTitle from "@/components/InsightTitle";
import RtGeoJson from "@/components/RtGeoJson";
interface EmailProps {
    value: string;
    label: string;
}
const Insight = () => {
    const defaultData: dummyGroundWaterDataTypes = dummyGroundWaterData as any;
    const [selectedEmailValue, setSelectedEmailValue] = useState<string>("MAD_MA_00001");
    const [groundWaterAccountData, setGroundWaterAccountData] = useState<AccountDetails | null>(null);
    const [position, setPosition] = useState<any>({ center: [36.96830684650072, -120.26398612842706], polygon: [], fieldId: "" });
    const [collapse, setCollapse] = useState("default");
    const tableCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "table" : "default"));
    };
    const mapCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "map" : "default"));
    };
    useEffect(() => {
        setGroundWaterAccountData(defaultData[selectedEmailValue])
        let parcels = Object.keys(defaultData[selectedEmailValue].parcel_geometries);
        let latlong = defaultData[selectedEmailValue].parcel_geometries[parcels[0]][0]
        setPosition((prev: any)=> ({...prev, center: latlong}))
    }, [selectedEmailValue]);

    const emailList: EmailProps[] = [
        {
            value: "MAD_MA_00001",
            label: "johndoe@example.com"
        },
        {
            value: "MAD_MA_00004",
            label: "janesmith@fake.com"
        },
        {
            value: "MAD_MA_00005",
            label: "alice.smith@test.org"
        },
        {
            value: "MAD_MA_00006",
            label: "robert_johnson@dummy.net"
        }
    ]

    const yearList: EmailProps[] = [
        {
            value: "2024",
            label: "2024"
        },
        {
            value: "2023",
            label: "2023"
        },
        {
            value: "2022",
            label: "2022"
        },
        {
            value: "2021",
            label: "2021"
        },
        {
            value: "2020",
            label: "2020"
        }
    ]


    const columns: ColumnDef<FarmUnit>[] = [
        {
            accessorKey: "farm_unit_zone",
            header: "Farm Unit Zone",
            size: 150,
            cell: ({ row }) => <div>{row.getValue("farm_unit_zone")}</div>,
        },
        {
            accessorKey: "fu_sy_ac",
            header: "Sustainable Yield Acreage (AC)",
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_sy_ac")}</div>,
        },
        {
            accessorKey: "fu_tw_ac",
            header: "Total Water Use (AC)",
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_tw_ac")}</div>,
        },
        {
            accessorKey: "fu_alloc_af",
            header: '2024 Allocation (AF)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_alloc_af")}</div>,
        },
        {
            accessorKey: "fu_carryover_af",
            header: 'Carryover (AF)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_carryover_af")}</div>,
        },
        {
            accessorKey: "adjustment",
            header: '2024 Adjustment (AF)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("adjustment")}</div>,
        },
        {
            accessorKey: "fu_total_adjustment_af",
            header: 'Total Adjustment (AF)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_total_adjustment_af")}</div>,
        },
        {
            accessorKey: "fu_etaw_af",
            header: 'ETAW (AF)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_etaw_af")}</div>,
        },
        {
            accessorKey: "fu_remain_af",
            header: 'Remaining (AF)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_remain_af")}</div>,
        },
        {
            accessorKey: "remaining_%",
            header: 'Remaining (%)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("remaining_%")}</div>,
        },

    ];

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
      popup.appendTo("#map2");
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
              showInfo(auxLayer.feature.properties.apn);
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
              removeInfo(auxLayer.feature.properties.apn);
          },
      });
    }

    const geoJsonStyle = (features: any) => {
      return {
          color: "#16599A", // Border color
          fillColor: "lightblue", // Fill color for normal areas
          fillOpacity: 0.5,
          weight: 2,
      };
    }

    console.log(groundWaterAccountData?.geojson_parcels)
    return (
        <div className="flex flex-col px-3 py-2 ">
            <div className="text-xl font-medium text-royalBlue dark:text-white">Madera Allocation Report</div>
            <div className="flex  items-center mt-2 gap-8 dark:text-slate-50 ">
                <div className="flex items-center gap-2">
                    <label>Select an Account : </label>
                    <Select value={selectedEmailValue} onValueChange={(value) => setSelectedEmailValue(value)}>
                        <SelectTrigger className="w-56 h-8 transition-colors ">
                            <SelectValue placeholder="Select an email" />
                        </SelectTrigger>
                        <SelectContent className="!z-[800]">
                            {emailList.map((email) => (
                                <SelectItem key={email.value} value={email.value}>
                                    {email.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2 ">
                    <label>Year : </label>
                    <Select onValueChange={(value) => console.log(value)}>
                        <SelectTrigger className="w-56 h-8 transition-colors">
                            <SelectValue placeholder="Select a year" />
                        </SelectTrigger>
                        <SelectContent className="!z-[800]">
                            {yearList.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                    {year.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-grow mt-2">
                <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
                    <div className={cn("relative h-[calc(100vh-152px)] w-full bg-white dark:bg-slate-500 rounded-[8px]  ")}>

                        <div className="py-2 px-3 overflow-auto h-full">

                            <InsightTitle
                                title="Account Summary"
                                note="Note: For additional information about Account information,
                                contact Madera Country Water and Natural Resources Department at (559) 662-8015
                                or WNR@maderacounty.com for information."
                            />

                            <div className="rounded-[8px] overflow-hidden mt-2 shadow-xl">
                                <Table>
                                    <TableHeader >
                                        <TableRow >
                                            <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none">Description</TableHead>
                                            <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none">Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Account ID :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.account_id}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Account Name :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.account_name}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Mailing Address :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.mailing_address}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Start Date (YYYY-MM-DD) :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.start_date}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                End Date (YYYY-MM-DD) :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.end_date}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Measurement Method :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.msmt_method}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Report Creation Date :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.report_creation_date}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Report Revision Date :
                                            </TableCell>
                                            <TableCell>
                                                {groundWaterAccountData?.report_revision_date}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>


                            <InsightTitle
                                title="Farm Unit Summary"
                                note=" Note: For additional information about Allocations, ETAW, Remaining Allocation, and Carryover Water, contact the Madera County Water and Natural
                                                Resources Department Office at (559) 662-8015 or WNR@maderacounty.com for information. Total Allocation (AF) is equal to the sum of 2024
                                                Allocation (AF), Carryover (AF), and 2024 Adjustment(s) (AF)"
                            />
                            <div className="mt-2">
                                <MapTable
                                    defaultData={groundWaterAccountData?.farm_units as FarmUnit[] || []}
                                    columns={columns}
                                    doFilter={false}
                                    filterValue={""}
                                    fullHeight={false}
                                    showPagination={false}

                                />
                            </div>

                            <InsightTitle title="County Assessor's Farm Unit Information"
                                note="Note: The following information is based on records from the Madera County Assessor's Office. Contact the Madera County Assessor's Office at (559)
                                        675-7710 or assessor@maderacounty.com for information."
                            />
                            <div className="mt-2">
                                {groundWaterAccountData?.farm_units?.map((farmUnit, index) => {
                                    return (<div key={index}>
                                        <div className="text-black dark:text-slate-50 text-sm font-bold">Farm Unit: {farmUnit?.farm_unit_zone}</div>
                                        <div className="text-black dark:text-slate-50 text-sm">Number of Mailing Address: 1</div>
                                        <div className="text-black dark:text-slate-50 text-sm">{groundWaterAccountData?.mailing_address}</div>
                                        <div className="text-black dark:text-slate-50 text-sm">Number of Parcels:{farmUnit?.parcels.length}</div>
                                        {farmUnit?.parcels.map((parcel, index) => {
                                            return <div key={index} className="text-black dark:text-slate-50 text-sm ml-2">Parcel {index + 1} : {parcel}</div>
                                        })}
                                    </div>)
                                })}
                            </div>

                        </div>
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
                        className={cn("relative flex h-[calc(100vh-152px)] w-full")}
                        id="map2"
                    >
                        <LeafletMap
                            position={position}
                            zoom={14}
                            collapse={collapse}
                            configurations={{'minZoom': 4, 'containerStyle': { height: "100%", width: "100vw" }}}
                        >
                          {groundWaterAccountData?.geojson_parcels && <RtGeoJson
                            key={selectedEmailValue}
                            layerEvents={geoJsonLayerEvents}
                            style={geoJsonStyle}
                            data={JSON.parse(groundWaterAccountData?.geojson_parcels)}
                          />
                          }
                        </LeafletMap>
                        {/* <button
                                className="absolute -left-4 top-1/2 z-[800] m-2 flex size-10 h-6 w-6 items-center justify-center rounded-full bg-blue-400"
                                onClick={mapCollapseBtn}
                            >
                                <ChevronsLeft
                                    size={20}
                                    className="rotate-180"
                                />
                            </button> */}
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
    )

};

export default Insight;
