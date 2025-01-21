import { ChevronsLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../../utils/cn";
import { ColumnDef } from "@tanstack/react-table";

import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

const Field = () => {
    const [collapse, setCollapse] = useState("default");
    const position: [number, number] = [36.7783, -119.4179];
    const tableCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "table" : "default"));
    };
    const mapCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "map" : "default"));
    };
    const defaultData: Person[] = [
        {
            firstName: "tanner",
            lastName: "linsley",
            age: 24,
            visits: 100,
            status: "In Relationship",
            progress: 50,
        },
        {
            firstName: "tandy",
            lastName: "miller",
            age: 40,
            visits: 40,
            status: "Single",
            progress: 80,
        },
        {
            firstName: "joe",
            lastName: "dirte",
            age: 45,
            visits: 20,
            status: "Complicated",
            progress: 10,
        },
    ];

    const columns: ColumnDef<Person>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: ({ row }) => <div className="capitalize">{row.getValue("firstName")}</div>,
        },
        {
            accessorKey: "lastName",
            header: () => {
                return <>Last Name</>;
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("lastName")}</div>,
        },
        {
            accessorKey: "age",
            header: "Age",
            cell: ({ row }) => <div className="capitalize">{row.getValue("age")}</div>,
        },
        {
            accessorKey: "visits",
            header: "visits",
            cell: ({ row }) => <div className="capitalize">{row.getValue("visits")}</div>,
        },
        {
            accessorKey: "status",
            header: "status",
            cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
        },
        {
            accessorKey: "progress",
            header: "Progress",
            cell: ({ row }) => <div className="capitalize">{row.getValue("progress")}</div>,
        },
    ];

    return (
        <div className="flex h-full flex-col gap-1 px-6 py-3">
            <div className="flex gap-1 text-xs">
                <Link to="">Management</Link>/<span>Field</span>
            </div>
            <div className="pageTitle text-lg font-normal text-black">Field</div>
            <div className="pageContain flex flex-grow flex-col gap-3">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <div className="search">
                            <input type="text" />
                        </div>
                        <button>Filter</button>
                    </div>
                    <button>Add Field</button>
                </div>
                <div className="flex flex-grow">
                    <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
                        <div className="relative h-[558px] w-full border">
                            {/* <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table> */}
                            <MapTable
                                defaultData={defaultData}
                                columns={columns}
                            />
                            {/* <table></table> */}
                            <button
                                className="absolute -right-4 top-1/2 z-[800] m-2 flex size-10 h-6 w-6 items-center justify-center rounded-full bg-blue-400"
                                onClick={tableCollapseBtn}
                            >
                                <ChevronsLeft size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={cn("w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3")}>
                        <div className="relative flex h-[558px] w-full bg-slate-500">
                            {/* <MapContainer
                                center={position}
                                zoom={12}
                                scrollWheelZoom={true}
                                zoomControl={false} // Disable default zoom control
                                minZoom={5}
                                style={{ height: "100%", width: "100%", overflow: "hidden" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <CustomZoomControl />
                                <ResizeHandler />
                            </MapContainer> */}
                            <LeafletMap
                                position={position}
                                collapse={collapse}
                            />
                            <button
                                className="absolute -left-4 top-1/2 z-[800] m-2 flex size-10 h-6 w-6 items-center justify-center rounded-full bg-blue-400"
                                onClick={mapCollapseBtn}
                            >
                                <ChevronsLeft
                                    size={20}
                                    className="rotate-180"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Field;
