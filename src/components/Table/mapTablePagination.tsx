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
import { initialTableDataTypes } from "@/types/tableTypes"

interface MapTablePaginationProps<TData> {
  table: Table<TData>
  tableInfo: initialTableDataTypes;
  setTableInfo:Function;
  totalData:number;
}

export function MapTablePagination<TData>({
  table,tableInfo,totalData,setTableInfo
}: MapTablePaginationProps<TData>) {
  console.log(totalData,Math.ceil(totalData/tableInfo?.page_size))
  return (
    <div className="flex items-center justify-between px-2 dark:text-white">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${tableInfo.page_size}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
              setTableInfo({...tableInfo,page_size:Number(value)})
            }}
          >
            <SelectTrigger className="h-8 w-[70px] bg-royalBlue text-white dark:bg-royalBlue">
              <SelectValue placeholder={tableInfo.page_size} />
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
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.ceil(totalData/tableInfo?.page_size)}
        </div>
   <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Go to page</p>
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
             
              {[...Array(Math.ceil(totalData/tableInfo?.page_size)).keys()].map((pageIndex) => (
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
            onClick={() =>{ table.setPageIndex(0); setTableInfo({...tableInfo,page_no:1})}}
            disabled={!table.getCanPreviousPage() }
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
            onClick={() => {table.setPageIndex(table.getPageCount() - 1); setTableInfo({...tableInfo,page_no:Number(Math.ceil(totalData/tableInfo?.page_size))})}}
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