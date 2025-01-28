import LeafletMap from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

                    <div className="p-2  overflow-auto h-full">
                        <div className="text-black dark:text-white text-md font-semibold ">
                            Account Summary
                        </div>
                        <div className="text-black text-sm dark:text-white">
                            Note: For additional information about Account information, contact Madera Country Water and Natural Resources Department at (559) 662-8015 or WNR@maderacounty.com for information.
                        </div>
                        <div className=" mt-2">
                            <Table>
                                <TableHeader >
                                    <TableRow className="bg-royalBlue !text-white hover:bg-none">
                                        <TableHead>Description</TableHead>
                                        <TableHead>Value</TableHead>
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
