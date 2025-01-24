import {
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    getPaginationRowModel,
    PaginationState,
    getSortedRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapTableTypes } from "@/types/tableTypes";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@uidotdev/usehooks";

const MapTable = <T,>({ defaultData, columns, setPosition = null, setZoomLevel = null }: MapTableTypes<T>) => {
    const isHeightBig = useMediaQuery("(min-height: 768px)");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, _setDate] = useState([...defaultData]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            sorting,
            pagination,
        },
    });

    return (
        <div className="table-container flex flex-col overflow-hidden rounded-md bg-white shadow-md transition-colors dark:bg-slateLight-950">
            <div className="h-[calc(100vh-218px)]">
                <Table className="relative">
                    <TableHeader className="sticky top-0">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        // this class code help to differentiate action column
                                        className={cn(
                                            `${
                                                // @ts-ignore  this code helps to ignore types in certain line
                                                header.column.columnDef.meta?.className ?? ""
                                            } !bg-royalBlue !text-white !transition-colors dark:!bg-black`,
                                            `!min-w-[${header?.getSize()}px]`,
                                        )}
                                        key={header.id}
                                        // style={{
                                        //     width: "400px !important", // Dynamically set width
                                        // }}
                                        style={{
                                            minWidth: header.column.columnDef.size,
                                            maxWidth: header.column.columnDef.size,
                                        }}
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) =>
                                // @ts-ignore it is to check whether there is center property in Data element object}
                                setPosition !== null && row?.original?.center ? (
                                    <TableRow
                                        key={row.id}
                                        className="cursor-pointer text-sm hover:bg-slate-500"
                                    >
                                        {row.getVisibleCells().map((cell) =>
                                            // @ts-ignore  Below condition check is to determine where rows are from action column or not
                                            cell.column.columnDef.meta?.className ? (
                                                <TableCell
                                                    className={`${
                                                        // @ts-ignore
                                                        cell.column.columnDef.meta?.className ?? ""
                                                    } `}
                                                    key={cell.id}
                                                    style={{
                                                        minWidth: cell.column.columnDef.size,
                                                        maxWidth: cell.column.columnDef.size,
                                                    }}
                                                    // @ts-ignore
                                                    onClick={() => {
                                                        // @ts-ignore
                                                        setPosition([row.original.center_latitude, row.original.center_longitude]);
                                                    }} //  we added this on click event to set center in map
                                                    // @ts-ignore
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ) : (
                                                <TableCell // this TableCell is not from Action column
                                                    // @ts-ignore
                                                    onClick={() => {
                                                        // @ts-ignore
                                                        setPosition([row.original.center_latitude, row.original.center_longitude]);
                                                    }} //  we added this on click event to set center in map
                                                    key={cell.id}
                                                    style={{
                                                        minWidth: cell.column.columnDef.size,
                                                        maxWidth: cell.column.columnDef.size,
                                                    }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ),
                                        )}
                                    </TableRow>
                                ) : (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => {
                                            // @ts-ignore
                                            setPosition([row.original.center_latitude, row.original.center_longitude]);
                                            // @ts-ignore
                                            setZoomLevel(15);
                                        }} //  we added this on click event to set center in map
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                className={`${
                                                    // @ts-ignore
                                                    cell.column.columnDef.meta?.className ?? ""
                                                } `}
                                                key={cell.id}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ),
                            )
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
            </div>
            <div className="flex-grow p-2">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => table.previousPage()}
                                disabled={!table?.getCanPreviousPage()}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                className="dark:text-white"
                                isActive
                                disabled
                            >
                                {pagination?.pageIndex + 1}
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default MapTable;
