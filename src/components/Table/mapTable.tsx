import {
    flexRender,
    getCoreRowModel,
    SortingState,
    useReactTable,
    getPaginationRowModel,
    PaginationState,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapTableTypes } from "@/types/tableTypes";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@uidotdev/usehooks";

interface ColumnFilter {
    id: string;
    value: unknown;
}
interface GlobalFilter {
    globalFilter: any;
}
type ColumnFiltersState = ColumnFilter[];

const MapTable = <T,>({
    defaultData,
    columns,
    doFilter,
    filterValue,
    setPosition = null,
    setZoomLevel = null,
    setClickedField = null,
    clickedField = null,
    fullHeight = true,
    showPagination = true,
    textAlign = "center",
    columnProperties = null,
    tableCSSConfig = {headerFontSize:null , bodyFontSize:null}
}: MapTableTypes<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setDate] = useState([...defaultData]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const [searchText, setSearchText] = useState<any>("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    useEffect(() => {
        setDate(defaultData);
    }, [defaultData]);
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString", // built-in filter function
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            sorting,
            globalFilter,
            pagination,
            columnFilters,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    useEffect(() => {
        //client side filtering
        if (!!filterValue) {
            table.setGlobalFilter(String(filterValue));
        } else {
            table.resetGlobalFilter(true);
        }
    }, [doFilter]);

    return (
        <div className="table-container flex flex-col overflow-hidden rounded-md bg-white shadow-md transition-colors dark:bg-slateLight-500">
            <div className={cn(fullHeight ? "h-[calc(100vh-218px)]" : "h-auto")}>
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
                                            } !bg-royalBlue !text-white !transition-colors dark:!bg-royalBlue`,
                                            `!min-w-[${header?.getSize()}px]`,
                                            ` ${tableCSSConfig?.headerFontSize && tableCSSConfig?.headerFontSize }`,
                                        )}
                                        key={header.id}
                                        // style={{
                                        //     width: "400px !important", // Dynamically set width
                                        // }}
                                        style={{
                                            minWidth: header.column.columnDef.size,
                                            maxWidth: header.column.columnDef.size,
                                            textAlign: columnProperties ? columnProperties[header.id] == "str"  ? "left" : "right" : textAlign
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
                                                    onClick={() => {
                                                        setPosition({
                                                            // @ts-ignore
                                                            center: [row.original?.center_latitude, row.original?.center_longitude],
                                                            // @ts-ignore
                                                            polygon: row.original?.coords,
                                                            // @ts-ignore
                                                            fieldId: row.original?.FieldID,
                                                        });
                                                    }} //  we added this on click event to set center in map
                                                // @ts-ignore
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            
                                        )}
                                    </TableRow>
                                ) : (
                                    <TableRow
                                        key={row.id}
                                        className={cn(
                                            // @ts-ignore
                                            clickedField === row.original.FieldID ? "bg-slate-400" : "",
                                            "cursor-pointer",
                                        )}
                                        onClick={() => {
                                            // @ts-ignore
                                            setPosition({
                                                // @ts-ignore
                                                center: [row.original.center_latitude, row.original.center_longitude],
                                                // @ts-ignore
                                                polygon: row.original.coords,
                                                // @ts-ignore
                                                fieldId: row.original.FieldID,
                                            });
                                            // @ts-ignore
                                            setZoomLevel(13);
                                            // @ts-ignore
                                            setClickedField(row.original?.FieldID);
                                        }} //  we added this on click event to set center in map
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                             <TableCell
                                                className={`${
                                                    // @ts-ignore
                                                    cell.column.columnDef.meta?.className ?? ""
                                                    } ${tableCSSConfig?.bodyFontSize  && tableCSSConfig?.bodyFontSize }`}
                                                key={cell.id}
                                            style={{
                                         
                                            textAlign: columnProperties ? columnProperties[cell.column.id] == "str"  ? "left" : "right" : textAlign
                                        }}
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
            {showPagination && (<div className="flex-grow p-2">
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
            </div>)}
        </div>
    );
};

export default MapTable;
