import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  collapse: string;
}

export function DataTablePagination<TData>({
  table,collapse
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 dark:text-white">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-1">
            {collapse === "map" && <p className="text-xs font-medium">Rows per page</p>}
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] bg-royalBlue text-white dark:bg-royalBlue">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[50, 100, 150, 200, 250].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
       {collapse == "map" &&  <div className="flex w-[60px] items-center justify-center text-xs font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>}
   <div className="flex items-center space-x-2">
           {collapse === 'map' && <p className="text-xs font-medium">Go to page</p>}
          <Select
            value={`${table.getState().pagination.pageIndex }`}
            onValueChange={(value) => {
              table.setPageIndex(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[60px]  bg-royalBlue text-white dark:bg-royalBlue">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[60px]">

              {[...Array(table.getPageCount()).keys()].map((pageIndex) => (
                <SelectItem key={pageIndex} value={`${pageIndex}`}>
                  {pageIndex + 1}
                </SelectItem>
              ))}
              {/* {[20, 40, 60, 80, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex  bg-royalBlue text-white dark:bg-royalBlue"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 p-0  bg-royalBlue text-white dark:bg-royalBlue"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 p-0  bg-royalBlue text-white dark:bg-royalBlue"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex  bg-royalBlue text-white dark:bg-royalBlue"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}