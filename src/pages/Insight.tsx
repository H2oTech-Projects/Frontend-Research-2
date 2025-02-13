import $ from "jquery";
import LeafletMap from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { AccountDetails, dummyGroundWaterDataTypes, FarmUnit } from "@/types/tableTypes";
import dummyGroundWaterData from "../../data3.json"
import parcelsData from "../../parcels.json"
import MapTable from "@/components/Table/mapTable";
import InsightTitle from "@/components/InsightTitle";
import RtGeoJson from "@/components/RtGeoJson";
import RtSelect from "@/components/RtSelect";
import BasicSelect from "@/components/BasicSelect";
import { buildPopupMessage } from "@/utils/map";
import CollapseBtn from "@/components/CollapseBtn";
import StackedBarChart from "@/components/charts/stackedBarChart";

interface EmailProps {
    value: string;
    label: string;
}

const Insight = () => {
    const defaultData: dummyGroundWaterDataTypes = dummyGroundWaterData as any;
    const parcels: any = parcelsData as any;
    const objectKeys = Object.keys(defaultData);
    const emailList: EmailProps[] = []
    objectKeys.sort().forEach((item) => {
  if (item !== "column_properties") {
        emailList.push({
            value: item,
            label: item
        })
    }}
)
    const [selectedEmailValue, setSelectedEmailValue] = useState<string>(emailList[0].value);
    const [selectedYearValue, setSelectedYearValue] = useState<string>("2024");
    const [selectedReportTypeValue, setSelectedReportTypeValue] = useState<string>("Account Farm Unit Summary");
    const [groundWaterAccountData, setGroundWaterAccountData] = useState<AccountDetails | null>(null);
    const [position, setPosition] = useState<any>({ center: [36.96830684650072, -120.26398612842706], polygon: [], fieldId: "", viewBound: [] });
    const [collapse, setCollapse] = useState("map");
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
        setPosition((prev: any)=> ({...prev, center: latlong, viewBound: defaultData[selectedEmailValue].view_bounds}))
    }, [selectedEmailValue]);

//   for (let key in objectKeys.sort()) {

//     emailList.push({
//       value: key,
//       label:key
// })}

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

  const ReportTypeList :EmailProps[] = [
{
  label:"Account Farm Unit Summary",
  value:"Account Farm Unit Summary"
},
{
  label:"Farm Unit Parcel Summary",
  value:"Farm Unit Parcel Summary"
},
{
  label:"Measurement Detail Report",
  value:"Measurement Detail Report",
},

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
            header: "Transitional Water Acreage (AC)",
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
            accessorKey: "fu_total_alloc_af",
            header: 'Total Allocation (AF)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_total_alloc_af")}</div>,
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
            accessorKey: "remaining",
            header: 'Remaining (%)',
            size: 150,
            cell: ({ row }) => <div>{row.getValue("remaining")}</div>,
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
      popup.appendTo("#map2");
    };

    const removeInfo = (Id: String) => {
      $("#popup-" + Id).remove();
    };

    const geoJsonLayerEvents = (feature: any, layer: any) => {
      layer.bindPopup(buildPopupMessage(parcels[feature.properties.apn]));
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

    if (!groundWaterAccountData){
      return "";
    }

    const IntroTable = () => {
      return (
      <Table>
       <TableHeader >
          <TableRow >
            <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none text-left w-64">Description</TableHead>
            <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none text-left">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="!text-left">
              Account ID :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.account_id}
            </TableCell>
          </TableRow>

          <TableRow >
            <TableCell className="!text-left">
              Account Name :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.account_name}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="!text-left">
              Mailing Address :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.mailing_address}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="!text-left w-auto">
              Start Date (YYYY-MM-DD) :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.start_date}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="!text-left w-auto">
              End Date (YYYY-MM-DD) :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.end_date}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="!text-left">
              Measurement Method :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.msmt_method}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="!text-left">
              Report Creation Date :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.report_creation_date}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="!text-left">
              Report Revision Date :
            </TableCell>
            <TableCell className="!text-left">
              {groundWaterAccountData?.report_revision_date}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    }

    return (
        <div className="flex flex-col px-3 py-2 ">
            <div className="text-xl font-medium text-royalBlue dark:text-white">Madera Allocation Report</div>
            <div className="flex flex-col items-start  mt-2 gap-2 dark:text-slate-50 ">
                <RtSelect selectedValue={selectedEmailValue} dropdownList={emailList} label="Account" setSelectedValue={setSelectedEmailValue}/>
                <RtSelect selectedValue={selectedReportTypeValue} dropdownList={ReportTypeList} label="Report Type" setSelectedValue={setSelectedReportTypeValue} showSearch={false}/>
                <RtSelect selectedValue={selectedYearValue} dropdownList={yearList} label="Year" setSelectedValue={setSelectedYearValue} showSearch={false} />
            </div>
            <div className="flex flex-grow mt-2">
                <div className={cn("relative h-[calc(100vh-232px)] w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
                    <div className={cn("h-auto w-full bg-white dark:bg-slate-500 rounded-[8px]  ")}>

                        <div className="pb-2 px-3 overflow-auto h-full">
                        <div className={`rounded-[8px] h-[${150* groundWaterAccountData?.chart_data.length}px] pb-[25px] my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)]`}>
                            <InsightTitle
                                title="Farm Unit Allocation Summary"
                                note="Note: For additional information about Account information,
                                contact Madera Country Water and Natural Resources Department at (559) 662-8015
                                or WNR@maderacounty.com for information."
                            />
                            <StackedBarChart
                              data={groundWaterAccountData?.chart_data}
                              config={{margin: { top: 20, right: 30, left: 40, bottom: 5 }}}
                              layout={'vertical'}
                              stack1={'remaining'}
                              stack2={'allocation_used'}
                            />
                          </div>

                            <InsightTitle
                                title="Account Summary"
                                note="Note: For additional information about Account information,
                                contact Madera Country Water and Natural Resources Department at (559) 662-8015
                                or WNR@maderacounty.com for information."
                            />
                            <div className="rounded-[8px] overflow-hidden my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)] ">
                               <IntroTable/>
                            </div>

                            <InsightTitle
                                title="Farm Unit Summary"
                                note=" Note: For additional information about Allocations, ETAW, Remaining Allocation, and Carryover Water, contact the Madera County Water and Natural
                                                Resources Department Office at (559) 662-8015 or WNR@maderacounty.com for information. Total Allocation (AF) is equal to the sum of 2024
                                                Allocation (AF), Carryover (AF), and 2024 Adjustment(s) (AF)"
                            />
                            <div className="my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)]">
                                <MapTable
                                    defaultData={groundWaterAccountData?.farm_units as FarmUnit[] || []}
                                    columns={columns}
                                    doFilter={false}
                                    filterValue={""}
                                    fullHeight={false}
                                    showPagination={false}
                                    textAlign="left" // this aligns the text to the left in the table, if not provided it will be center
                                    columnProperties={defaultData['column_properties']}
                                />
                            </div>

                            <InsightTitle title="County Assessor's Farm Unit Information"
                                note="Note: The following information is based on records from the Madera County Assessor's Office. Contact the Madera County Assessor's Office at (559)
                                        675-7710 or assessor@maderacounty.com for information."
                            />
                            <div className="rounded-[8px] overflow-hidden my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)]">
                                {groundWaterAccountData?.farm_units?.map((farmUnit, index) => {
                                    return (<div key={index} className="pl-[20px] py-[10px]">
                                        <div className="text-black dark:text-slate-50 text-sm font-bold mt-[15px]">Farm Unit:{farmUnit?.farm_unit_zone}</div>
                                        <tbody>
                                        <tr className="text-black dark:text-slate-50 text-sm"><td className="flex justify-between w-[190px]"><span>Number of Mailing Address</span><span className="text-right">:</span></td> <td><span className="pl-[5px] italic">1</span></td></tr>
                                        <tr className="text-black dark:text-slate-50 text-sm"><td className="flex justify-between w-[190px]"><span>Owner Mailing Address</span><span className="text-right">:</span></td><td><span className="pl-[5px] italic">{groundWaterAccountData?.mailing_address}</span></td></tr>
                                        <tr className="text-black dark:text-slate-50 text-sm"><td className="flex justify-between w-[190px]"><span>Number of Parcels</span><span className="text-right">:</span></td><td><span className="pl-[5px] italic">{farmUnit?.parcels.length}</span></td></tr>
                                        <tr className="text-black dark:text-slate-50 text-sm"><td className="w-[190px]"></td><td><ul className="list-inside list-disc">{farmUnit?.parcels.map((parcel, index) => {
                                            return <li key={index} className="text-black dark:text-slate-50 text-sm italic">Parcel {index + 1} : {parcel}</li>
                                        })}</ul></td></tr>
                                        </tbody>
                                    </div>
                                    )
                                })}
                            </div>

                        </div>

                    </div>
                     <CollapseBtn
                            className="absolute -right-1 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
                            onClick={mapCollapseBtn}
                            note={collapse === 'default' ? 'View Full Table' : "Show Map"}
                        >
                          <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
                      </CollapseBtn>
                </div>

                <div className={cn("w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3")}>
                    <div
                        className={cn("relative flex h-[calc(100vh-232px)] w-full")}
                        id="map2"
                    >
                        <LeafletMap
                            position={position}
                            zoom={14}
                            viewBound={groundWaterAccountData?.view_bounds}
                            collapse={collapse}
                            configurations={{'minZoom': 4, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" }}}
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
    )

};

export default Insight;
