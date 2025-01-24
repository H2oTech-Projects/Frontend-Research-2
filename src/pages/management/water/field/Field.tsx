import { ChevronsLeft, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../../utils/cn";
import { ColumnDef, ColumnMeta } from "@tanstack/react-table";
import dayjs from "dayjs";
import MapTable from "@/components/Table/mapTable";
import LeafletMap from "@/components/LeafletMap";
import DummyData from "../../../../../mapleData.json";
import { DummyDataType } from "@/types/tableTypes";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@uidotdev/usehooks";
import swmcFields from "../../../../geojson/SMWC_Fields.json";

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
    center?: [number, number];
};

const Field = () => {
    const isHeightBig = useMediaQuery("(min-height: 768px)");

    const [collapse, setCollapse] = useState("default");
    const [position, setPosition] = useState<[number, number]>([38.86902846413033, -121.729324818604]);
    const [zoomLevel, setZoomLevel] = useState(10);
    const [searchText, setSearchText] = useState<String>('')
    const [doFilter, setDoFilter] = useState<Boolean>(false)
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
            header: "Field ID",
            size: 50, // this size value is in px
            cell: ({ row }) => <div className="capitalize">{row.getValue("FieldID")}</div>,
            //filterFn: 'includesString',
        },
        {
            accessorKey: "FieldDesc",
            header: () => {
                return <>Field Description</>;
            },
            size: 300,
            cell: ({ row }) => <div className="lowercase">{row.getValue("FieldDesc")}</div>,
        },
        {
            accessorKey: "FieldAcres",
            header: "FieldAcres",
            size: 100,
            cell: ({ row }) => <div className="capitalize">{row.getValue("FieldAcres")}</div>,
        },
        {
            accessorKey: "IrrigAcres",
            header: "IrrigAcres",
            size: 100,
            cell: ({ row }) => <div className="capitalize">{row.getValue("IrrigAcres")}</div>,
        },
        // {
        //     accessorKey: "status",
        //     header: "status",
        //     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
        // },
        {
            accessorKey: "StandbyAcr",
            header: "StandbyAcr",
            size: 100,
            cell: ({ row }) => <div>{row.getValue("StandbyAcr")}</div>,
        },
        {
            accessorKey: "ParcelID",
            header: "ParcelID",
            size: 300,
            cell: ({ row }) => <div>{row.getValue("ParcelID")}</div>,
        },
        {
            accessorKey: "VolRateAdj",
            header: "VolRateAdj",
            size: 100,
            cell: ({ row }) => <div>{row.getValue("VolRateAdj")}</div>,
        },
        {
            accessorKey: "ActiveDate",
            header: "Active Date",
            size: 150,
            cell: ({ row }) => <div>{dayjs(row.getValue("ActiveDate")).format("MM/DD/YYYY")}</div>,
        },
        {
            accessorKey: "InactiveDa",
            header: "Inactive Date",
            size: 150,
            cell: ({ row }) => <div>{dayjs(row.getValue("InactiveDa")).format("MM/DD/YYYY")}</div>,
        },
        {
            accessorKey: "ActiveFlag",
            header: "Active status ",
            cell: ({ row }) => <div>{row.getValue("ActiveFlag")}</div>,
        },
        {
            accessorKey: "unq_fld_id",
            header: "Unique Flag Id",
            cell: ({ row }) => <div>{row.getValue("unq_fld_id")}</div>,
        },
        {
            accessorKey: "AreaAC",
            header: "Area (Ac)",
            cell: ({ row }) => <div>{row.getValue("AreaAC")}</div>,
        },
        {
            id: "actions",
            header: "",
            size: 50,
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                >
                    <span className="sr-only">Open menu</span>
                    <MoreVertical />
                </Button>
            ),
            meta: {
                className: "sticky right-0 !z-9 !bg-slateLight-100 dark:!bg-slateLight-950 ",
            },
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
                            <input
                              type="text"
                              value={String(searchText)}
                              onChange={e => {
                                setSearchText(String(e.target.value))
                                if (!String(e.target.value)) {
                                  setDoFilter(!doFilter)
                                }
                              }}
                            />
                        </div>
                        <button onClick={() => setDoFilter(!doFilter)}>Filter</button>
                    </div>
                    <button>Add Field</button>
                </div>
                <div className="flex flex-grow">
                    <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
                        <div className={cn("relative h-[calc(100vh-160px)] w-full border")}>
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
                                doFilter={doFilter}
                                filterValue={searchText}
                                setPosition={setPosition as Function}
                                setZoomLevel={setZoomLevel as Function}
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
                        <div
                            className={cn("relative flex h-[calc(100vh-160px)] w-full")}
                            id="map"
                        >
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
                                zoom={zoomLevel}
                                collapse={collapse}
                                geojson={swmcFields}
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
