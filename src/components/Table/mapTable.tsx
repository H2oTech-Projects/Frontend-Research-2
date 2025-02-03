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
}: MapTableTypes<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setDate] = useState([...defaultData]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<any>([]);
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

    const rowCells = (row: any) => {
      return (
        row.getVisibleCells().map((cell: any) => (
          <TableCell
            className={`${
              // @ts-ignore
              cell.column.columnDef.meta?.className ?? ""
              } `}
            key={cell.id}
            style={{ minWidth: cell.column.columnDef.size, maxWidth: cell.column.columnDef.size, }}
          >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))
      )
    }

    const tableBody = () => {
      let tableContent =null;
      if ((table.getRowModel().rows?.length) < 1){
        return (
          <TableBody>
            <TableCell colSpan={columns.length} className="h-24 text-center" > No results. </TableCell>
          </TableBody>
        )
      } else{
        tableContent = <TableBody>
          { table.getRowModel().rows.map((row) => {
            // @ts-ignore
            let className = row?.original?.center ? "cursor-pointer text-sm hover:bg-slate-500" : cn(clickedField === row.original.FieldID ? "bg-slate-400" : "", "cursor-pointer",);
            let rowCellContents = rowCells(row);
            return (
              <TableRow
                key={row.id}
                className={className}
                onClick={() => {
                  // @ts-ignore
                  setPosition({ center: [row.original.center_latitude, row.original.center_longitude], polygon: row.original.coords, fieldId: row.original.FieldID,
                  });
                  // @ts-ignore
                  setZoomLevel(13);
                  // @ts-ignore
                  setClickedField(row.original?.FieldID);
              }} //  we added this on click event to set center in map
              >
                {rowCellContents}
              </TableRow>
            )
          })
        }
        </TableBody>;
      }
      return tableContent;
    }

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
                    {tableBody()}
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
