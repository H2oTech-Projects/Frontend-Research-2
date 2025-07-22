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
import  MapTablePagination  from "./mapTablePagination";
import { DataTablePagination } from "./clientSidePagination";

interface ColumnFilter {
    id: string;
    value: unknown;
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
    tableCSSConfig = {headerFontSize:null , bodyFontSize:null},
    tableType,
    setSelectedFarm=null,
    setSelectedParcel=null,
    isLoading = false,
    totalData,
    tableInfo,
    setTableInfo,
    collapse,
    useClientPagination = false,
    customHeight ="h-[calc(100vh-208px)]",
}: MapTableTypes<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setData] = useState(defaultData?.length > 0 ?  [...defaultData] : []);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 50,
    });
    useEffect(() => {
      setData(defaultData);
    }, [defaultData]);
    useEffect(() => {
    tableInfo?.page_size && setPagination({...pagination, pageSize: tableInfo?.page_size})
    }, [tableInfo?.page_size])
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

    const handleOnClick = ((row: any, type: any) => {
      if (type=="parcel") {
        // @ts-ignore
        setSelectedParcel(row.original?.parcel_id)
        return;
      }
      if (type=="farm") {
        // @ts-ignore
        setSelectedFarm(row.original?.farm_unit_zone)
        return;
      }
      if (type == 'point') {
        const parseData = JSON.parse(row.original.geompoint)
        const coordinates = parseData.coordinates
        // @ts-ignore
        setPosition({
          // @ts-ignore
          center: [coordinates[1], coordinates[0]],
          // @ts-ignore
          point: [coordinates[1], coordinates[0]],
          // @ts-ignore
          msmtPointId: row.original.id || null,
          // @ts-ignore
          features: row.original,
          fields: row.original.fields
        });
        return;
      }
      // @ts-ignore
      setPosition &&  setPosition({
        // @ts-ignore
        center: [row.original?.center_latitude || 38.86902846413033, row.original?.center_longitude || -121.729324818604],
        // @ts-ignore
        polygon: row.original?.coords || [],
        // @ts-ignore
        fieldId: row.original?.FieldID || null,
        // @ts-ignore
        features: row.original
      });
      // @ts-ignore
      setPosition && setZoomLevel(13);
      // @ts-ignore
     setClickedField && setClickedField({id:row.original?.fieldId,viewBounds:row.original?.viewBounds});
    });

    const tableHeader = () => {
      return (table.getHeaderGroups().map((headerGroup) => (
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
      )));
    }

    const tableContent = () => {
      if (table?.getRowModel()?.rows?.length < 1 && !isLoading) {
        return <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
               >
                No results.
              </TableCell>
            </TableRow>

      }
      if (setPosition !==null) {
        return fieldTableContent()
      } else {
        return insightTableContent()
      }
    }

    const emptyTable = () => {
      return <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                  >
                  Data Loading
                </TableCell>
              </TableRow>
            </TableBody>
    }

    const fieldTableContent = () => {
      return table.getRowModel().rows.map((row) =>

        fieldTableRow(row)
      )
    }

    const insightTableContent = () => {
      return table.getRowModel().rows.map((row) =>
        insightTableRow(row)
      )};


    const fieldTableRow = (row: any) => {
      return <TableRow
              key={row.id}
              className="cursor-pointer text-sm hover:bg-slate-500"
            >
              {row.getVisibleCells().map((cell: any) =>
                <TableCell
                  className={`${
                    // @ts-ignore
                    cell.column.columnDef.meta?.className ?? ""
                    } `}
                  key={cell.id}
                  style={{
                      // minWidth: cell.column.columnDef.size,
                      // maxWidth: cell.column.columnDef.size,
                      textAlign: columnProperties ? columnProperties[cell.column.id] == "str"  ? "left" : "right" : textAlign,
                  }}
                  // @ts-ignore
                  onClick={() => { handleOnClick(row, tableType) }} //  we added this on click event to set center in map
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              )}
      </TableRow>
    }

    const insightTableRow = (row: any) => {
      return <TableRow
              key={row.id}
              className={cn(
                // @ts-ignore
               clickedField && clickedField === row.original.FieldID ? "bg-slate-400" : "",
                "cursor-pointer",
              )}
              // @ts-ignore
              onClick={() => { handleOnClick(row, tableType) }} //  we added this on click event to set center in map
             >
              {row.getVisibleCells().map((cell: any) => (
                <TableCell
                  className={`${
                    // @ts-ignore
                    cell.column.columnDef.meta?.className ?? ""
                    // @ts-ignore
                    } ${tableCSSConfig?.bodyFontSize  && tableCSSConfig?.bodyFontSize }`}
                  key={cell.id}
                  // @ts-ignore
                  style={{textAlign: columnProperties ? columnProperties[cell.column.id] == "str"  ? "left" : "right" : textAlign}}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
    }

    const renderPagination = () => {
      // @ts-ignore
      if (!showPagination ) return null
      return <div className="flex flex-grow p-2  justify-center items-center">
                {useClientPagination ?  <DataTablePagination table={table} collapse={collapse!}/> : <MapTablePagination totalData={totalData!} tableInfo={tableInfo!} setTableInfo={setTableInfo!} collapse={collapse!}/>}
            </div>
    }
    const tableHeight = tableType == 'wap_types' ? 'h-[300px]' : fullHeight ? "h-[300px]" : "h-auto"
    return (
      <div className="table-container flex flex-col overflow-hidden rounded-md bg-white shadow-md transition-colors dark:bg-slateLight-500">
        <div className={cn(fullHeight ? customHeight : "h-auto ")}>
          <Table className="relative">
            <TableHeader className="sticky top-0">{tableHeader()}</TableHeader>
              {isLoading ? emptyTable() : tableContent()}
          </Table>
        </div>
          {renderPagination()}
      </div>
    )
};

export default MapTable;
