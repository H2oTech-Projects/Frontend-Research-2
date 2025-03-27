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
import React, { useEffect } from "react"

interface MapTablePaginationProps<TData> {
  tableInfo: initialTableDataTypes;
  setTableInfo:Function;
  totalData:number;
  collapse:string;
}

function MapTablePagination<TData>({
  tableInfo,totalData,setTableInfo,collapse
}: MapTablePaginationProps<TData>) {
  useEffect(() => {
      setTableInfo({...tableInfo,page_no: 1})
}, [tableInfo?.page_size])
  return (
    <div className="flex items-center justify-between px-2 dark:text-white">
      <div className="flex items-center space-x-8 lg:space-x-8 " >
        <div className="flex items-center space-x-1">
          {collapse === "map" && <p className="text-xs font-medium">Rows per page</p>}
          <Select
            value={`${tableInfo.page_size}`}
            onValueChange={(value) => {      
              setTableInfo({...tableInfo,page_size:Number(value)})
            }}
          >
            <SelectTrigger className="h-8 w-[65px] bg-royalBlue text-white dark:bg-royalBlue">
              <SelectValue placeholder={tableInfo.page_size} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[65px]">
              {[50, 100, 150, 200, 250].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {collapse === "map" &&  <div className="flex w-[60px] items-center justify-center text-xs font-medium">
          Page {tableInfo?.page_no  } of{" "}
          {Math.ceil(totalData/tableInfo?.page_size)}
        </div>}
         <div className="flex items-center space-x-1">
          {collapse === 'map' && <p className="text-xs font-medium">Go to page</p>}
          <Select
            value={`${tableInfo?.page_no }`}
            onValueChange={(value) => {
              setTableInfo({...tableInfo,page_no:Number(value)})
            }}
          >
            <SelectTrigger className="h-8 w-[50px]  bg-royalBlue text-white dark:bg-royalBlue">
              <SelectValue placeholder={tableInfo?.page_no} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[50px]">
             
              {[...Array(Math.ceil(totalData/tableInfo?.page_size)).keys()].map((pageIndex) => (
                <SelectItem key={pageIndex} value={`${pageIndex + 1}`}>
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
        <div className="flex items-center space-x-1 ]">
          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex  bg-royalBlue text-white dark:bg-royalBlue"
            onClick={() =>{  setTableInfo({...tableInfo,page_no:1})}}
            disabled={tableInfo?.page_no === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 p-0  bg-royalBlue text-white dark:bg-royalBlue"
            disabled={tableInfo?.page_no === 1}
            onClick={() => { setTableInfo({...tableInfo,page_no:tableInfo?.page_no - 1})}}  
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 p-0  bg-royalBlue text-white dark:bg-royalBlue"
            onClick={() => { setTableInfo({...tableInfo,page_no:tableInfo?.page_no + 1})}} 
            disabled={tableInfo?.page_no === Math.ceil(totalData/tableInfo?.page_size)}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex  bg-royalBlue text-white dark:bg-royalBlue"
            onClick={() => { setTableInfo({...tableInfo,page_no:Number(Math.ceil(totalData/tableInfo?.page_size))})}}
            disabled={tableInfo?.page_no === Math.ceil(totalData/tableInfo?.page_size)}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(MapTablePagination)