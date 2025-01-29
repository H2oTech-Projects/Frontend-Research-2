import LeafletMap from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { ChevronsLeft, ChevronsRight, Info } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
interface EmailProps {
    value: string;
    label: string;
}
const Insight = () => {
    const [selectedEmail, setSelectedEmail] = useState<string>("");
    const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "" });
    const [collapse, setCollapse] = useState("default");
    const tableCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "table" : "default"));
    };
    const mapCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "map" : "default"));
    };
    const dummyData = [{
        "MAD_MA_00250": {
            "account_id": "MAD_MA_00250",
            "account_name": "Gerald Cederquist 1",
            "mailing_address": "8606 North Fuller Avenue, Fresno, CA 93720",
            "start_date": "2024-01-01",
            "end_date": "2024-11-30",
            "msmt_method": "IrriWatch", //Measurement Method: 
            "report_creation_date": "01-02-2025",
            "report_revision_date": "-",

            "farm_units": [
                {
                    "farm_unit_zone": "Chowchilla Subbasin Madera County GSA East", //Farm Unit
                    "fu_sy_ac": 307.9, // Sustainable Yield Acreage (AC)
                    "fu_tw_ac": 305.9, // Transitional Water Acreage (AC)
                    "fu_alloc_af": 651.3, // 2024vAllocationv (AF)
                    "fu_carryover_af": "525.2", // Carryover (AF) 
                    "adjustment": 0, //2024 Adjustment (s) (AF)
                    "fu_total_adjustment_af": 1176.5, //Total Allocation (AF)
                    "fu_etaw_af": 615.6,// ETAW (AF)
                    "fu_remain_af": 560.9, //Remaining (AF)
                    "remaining_%": 47.7, // calculated by (fu_remain_af/ fu_total_adjustment_af)*100
                    "parcels": ["030-032-015", "030-031-017", "030-032-011"],
                    "parcel_geometries": {
                        "030-032-015": [[-120.13266934604674, 37.09983618811289], [-120.13266617641497, 37.10016575452752], [-120.132429063436, 37.09983470523583]],
                        "030-031-017": [[-120.13266934604674, 37.09983618811289], [-120.13266617641497, 37.10016575452752], [-120.132429063436, 37.09983470523583]],
                        "030-032-011": [[-120.13266934604674, 37.09983618811289], [-120.13266617641497, 37.10016575452752], [-120.132429063436, 37.09983470523583]]
                    }
                },
                {
                    "farm_unit_zone": "Madera Subbasin Madera County GSA East - Northern",
                    "fu_sy_ac": 307.9,
                    "fu_tw_ac": 305.9,
                    "fu_alloc_af": 651.3,
                    "fu_carryover_af": "525.2",
                    "adjustment": 0,
                    "fu_total_adjustment_af": 1176.5,
                    "fu_etaw_af": 615.6,
                    "fu_remain_af": 560.9,
                    "remaining_%": 47.7,
                    "parcels": ["030-032-015", "030-031-017", "030-032-011"],
                    "parcel_geometries": {
                        "030-032-015": [[-120.13266934604674, 37.09983618811289], [-120.13266617641497, 37.10016575452752], [-120.132429063436, 37.09983470523583]],
                        "030-031-017": [[-120.13266934604674, 37.09983618811289], [-120.13266617641497, 37.10016575452752], [-120.132429063436, 37.09983470523583]],
                        "030-032-011": [[-120.13266934604674, 37.09983618811289], [-120.13266617641497, 37.10016575452752], [-120.132429063436, 37.09983470523583]]
                    }
                }
            ]
        }
    }]
    const emailList: EmailProps[] = [
        {
            value: "johndoe@example.com",
            label: "johndoe@example.com"
        },
        {
            value: "janesmith@fake.com",
            label: "janesmith@fake.com"
        },
        {
            value: "alice.smith@test.org",
            label: "alice.smith@test.org"
        },
        {
            value: "robert_johnson@dummy.net",
            label: "robert_johnson@dummy.net"
        },
        {
            value: "sarah.miller@mock.io",
            label: "sarah.miller@mock.io"
        },
    ]
    return <div className="flex flex-col px-3 py-2 ">
        <div className="text-xl font-medium text-royalBlue dark:text-white">Madera Allocation Report</div>
        <div className="flex  items-center mt-2 gap-8 dark:text-slate-50">
            <div className="flex items-center gap-2">
                <label>Select an Account : </label>
                <Select onValueChange={(value) => setSelectedEmail(value)}>
                    <SelectTrigger className="w-56 h-8 transition-colors">
                        <SelectValue placeholder="Select an email" />
                    </SelectTrigger>
                    <SelectContent>
                        {emailList.map((email) => (
                            <SelectItem key={email.value} value={email.value}>
                                {email.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <label>Year : </label>
                <Select onValueChange={(value) => setSelectedEmail(value)}>
                    <SelectTrigger className="w-56 h-8 transition-colors">
                        <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent>
                        {emailList.map((email) => (
                            <SelectItem key={email.value} value={email.value}>
                                {email.label}
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
                        <div className="text-black dark:text-white text-md font-semibold ">
                            Account Summary
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger> <Info className="inline-block items-baseline ml-2" size={24} /></TooltipTrigger>
                                    <TooltipContent side="right" align="center" sideOffset={10}>
                                        <div className="text-black text-sm dark:text-white w-[300px]">
                                            Note: For additional information about Account information, contact Madera Country Water and Natural Resources Department at (559) 662-8015 or WNR@maderacounty.com for information.
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </div>

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
                                            MAD_MA_00250
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Account ID :
                                        </TableCell>
                                        <TableCell>
                                            MAD_MA_00250
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Account ID :
                                        </TableCell>
                                        <TableCell>
                                            MAD_MA_00250
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Account Name :
                                        </TableCell>
                                        <TableCell>
                                            Gerald Cederquist 1
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Mailing Address :
                                        </TableCell>
                                        <TableCell>
                                            8606 North Fuller Avenue, Fresno, CA 93720
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Start Date (YYYY-MM-DD) :
                                        </TableCell>
                                        <TableCell>
                                            2024-01-01
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            End Date (YYYY-MM-DD) :
                                        </TableCell>
                                        <TableCell>
                                            2024-11-30
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Measurement Method :
                                        </TableCell>
                                        <TableCell>
                                            IrriWatch
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Report Creation Date :
                                        </TableCell>
                                        <TableCell>
                                            01-02-2025
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Report Revision Date
                                        </TableCell>
                                        <TableCell>
                                            -
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div >
                            <div className="text-black dark:text-white text-md font-semibold mt-2">
                                Farm Unit Summary
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger> <Info className="inline-block items-baseline ml-2" size={24} /></TooltipTrigger>
                                        <TooltipContent side="right" align="center" sideOffset={10}>
                                            <div className="text-black text-sm dark:text-white w-[300px]">
                                                Note: For additional information about Allocations, ETAW, Remaining Allocation, and Carryover Water, contact the Madera County Water and Natural
                                                Resources Department Office at (559) 662-8015 or WNR@maderacounty.com for information. Total Allocation (AF) is equal to the sum of 2024
                                                Allocation (AF), Carryover (AF), and 2024 Adjustment(s) (AF)
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

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
                    id="map"
                >
                    <LeafletMap
                        position={position}
                        zoom={10}
                        collapse={collapse}
                        geojson={[]}

                    />
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
    </div>;
};

export default Insight;
