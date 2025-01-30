import LeafletMap from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Info } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ColumnDef } from "@tanstack/react-table";
import { FarmUnit } from "@/types/tableTypes";
import dummyGroundWaterData from "../../data_demo2.json"
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
    // console.log(Object.keys(dummyGroundWaterData))

    const columns: ColumnDef<FarmUnit>[] = [
        {
            accessorKey: "farm_unit_zone",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Farm Unit Zone {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 200,
            cell: ({ row }) => <div>{row.getValue("farm_unit_zone")}</div>,
        },
        {
            accessorKey: "fu_sy_ac",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Sustainable Yield Acreage (AC) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_sy_ac")}</div>,
        },
        {
            accessorKey: "fu_tw_ac",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Transitional Water Acreage (AC) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_tw_ac")}</div>,
        },
        {
            accessorKey: "fu_alloc_af",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    2024 Allocation (AF) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_alloc_af")}</div>,
        },
        {
            accessorKey: "fu_carryover_af",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Carryover (AF) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_carryover_af")}</div>,
        },
        {
            accessorKey: "adjustment",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    2024 Adjustment (AF) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("adjustment")}</div>,
        },
        {
            accessorKey: "fu_total_adjustment_af",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Total Allocation (AF) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_total_adjustment_af")}</div>,
        },
        {
            accessorKey: "fu_etaw_af",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    ETAW (AF) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_etaw_af")}</div>,
        },
        {
            accessorKey: "fu_remain_af",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Remaining (AF) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("fu_remain_af")}</div>,
        },
        {
            accessorKey: "remaining_%",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Remaining (%) {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            ),
            size: 150,
            cell: ({ row }) => <div>{row.getValue("remaining_%")}</div>,
        },

    ];
    return (
        <div className="flex flex-col px-3 py-2 ">
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
        </div>
    )

};

export default Insight;
