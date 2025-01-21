import { ChevronsLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../../utils/cn";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import CustomZoomControl from "../../../../components/MapController";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};
// const columnHelper = createColumnHelper<Person>();

// const columns = [
//     columnHelper.accessor("firstName", {
//         cell: (info) => info.getValue(),
//         footer: (info) => info.column.id,
//     }),
//     columnHelper.accessor((row) => row.lastName, {
//         id: "lastName",
//         cell: (info) => <i>{info.getValue()}</i>,
//         header: () => <span>Last Name</span>,
//         footer: (info) => info.column.id,
//     }),
//     columnHelper.accessor("age", {
//         header: () => "Age",
//         cell: (info) => info.renderValue(),
//         footer: (info) => info.column.id,
//     }),
//     columnHelper.accessor("visits", {
//         header: () => <span>Visits</span>,
//         footer: (info) => info.column.id,
//     }),
//     columnHelper.accessor("status", {
//         header: "Status",
//         footer: (info) => info.column.id,
//     }),
//     columnHelper.accessor("progress", {
//         header: "Profile Progress",
//         footer: (info) => info.column.id,
//     }),
// ];

const Field = () => {
    const ResizeHandler = () => {
        const map = useMap();

        useEffect(() => {
            map.invalidateSize(); // Force the map to resize
        }, [collapse]);

        return null;
    };
    const [collapse, setCollapse] = useState("default");
    const position: [number, number] = [36.7783, -119.4179];
    const tableCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "table" : "default"));
    };
    const mapCollapseBtn = () => {
        setCollapse((prev) => (prev === "default" ? "map" : "default"));
    };
    // const defaultData: Person[] = [
    //     {
    //         firstName: "tanner",
    //         lastName: "linsley",
    //         age: 24,
    //         visits: 100,
    //         status: "In Relationship",
    //         progress: 50,
    //     },
    //     {
    //         firstName: "tandy",
    //         lastName: "miller",
    //         age: 40,
    //         visits: 40,
    //         status: "Single",
    //         progress: 80,
    //     },
    //     {
    //         firstName: "joe",
    //         lastName: "dirte",
    //         age: 45,
    //         visits: 20,
    //         status: "Complicated",
    //         progress: 10,
    //     },
    // ];
    const defaultData: Payment[] = [
        {
            id: "m5gr84i9",
            amount: 316,
            status: "success",
            email: "ken99@yahoo.com",
        },
        {
            id: "3u1reuv4",
            amount: 242,
            status: "success",
            email: "Abe45@gmail.com",
        },
        {
            id: "derv1ws0",
            amount: 837,
            status: "processing",
            email: "Monserrat44@gmail.com",
        },
        {
            id: "5kma53ae",
            amount: 874,
            status: "success",
            email: "Silas22@gmail.com",
        },
        {
            id: "bhqecj4p",
            amount: 721,
            status: "failed",
            email: "carmella@hotmail.com",
        },
    ];
    const [data, _setData] = useState(() => [...defaultData]);

    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return <>Email</>;
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "amount",
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));

                // Format the amount as a dollar amount
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(amount);

                return <div className="text-right font-medium">{formatted}</div>;
            },
        },
        // {
        //     id: "actions",

        //     cell: ({ row }) => {
        //         const payment = row.original;

        //         return <>.....</>;
        //     },
        // },
    ];
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="flex h-full flex-col gap-1 px-6 py-3">
            <div className="flex gap-1 text-xs">
                <Link to="">Home</Link>/<span>Field</span>
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
                            <Table>
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
                            </Table>

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
                            <MapContainer
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
                            </MapContainer>
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
