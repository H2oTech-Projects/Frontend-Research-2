import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/PageHeader";
import { useGetAccountParcels } from "@/services/insight";
import MapTable from "@/components/Table/mapTable";
import { ColumnDef } from "@tanstack/react-table";
import { farmUnitColumnProperties, parcelColumnProperties } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

interface initialTableDataTypes {
  search: string;
  page_no: number,
  page_size: number,
  sort: string,
  sort_order: string
}
const initialTableData = {
  search: "",
  page_no: 1,
  page_size: 50,
  sort: '',
  sort_order: ''
}

const columns2: ColumnDef<ParcelData>[] = [
  {
    accessorKey: "parcel_id",
    header: ({ column }) => {
            return (
                <div
                    className="flex gap-2 align-middle cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                   Parcel Id
                    {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
            );
        },
  },
  {
    accessorKey: "legal_ac",
    header: ({ column }) => {
            return (
                <div
                    className="flex gap-2 align-middle justify-end cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Legal Acres
                    {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
            );
        },
  },
  {
    accessorKey: "primary_crop",
    header: ({ column }) => {
            return (
                <div
                    className="flex gap-2 cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Primary Crop
                    {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
            );
        },

  },
  {
    accessorKey: "alloc_af",
    header: ({ column }) => {
            return (
                <div
                    className="flex gap-2 align-middle justify-end cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Allocated (AF)
                    {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
            );
        },
  },
  {
    accessorKey: "carryover_af",
    header: ({ column }) => {
            return (
                <div
                    className="flex gap-2 align-middle justify-end cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Carryover (AF)
                    {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
            );
        },
  },
  {
    accessorKey: "zone_abr",
    header: ({ column }) => {
            return (
                <div
                    className="flex gap-2 cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Zone Abbreviation
                    {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
            );
        },
    size: 200,
  },

];

const WaterAccountingPeriodType = () => {
  const navigate = useNavigate();
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const [searchText, setSearchText] = useState("");
  const {data:accountParcels, isLoading:accountParcelsLoading} = useGetAccountParcels("MAD_MA_50000");
  // const [doFilter, setDoFilter] = useState<Boolean>(false);
  if (accountParcelsLoading)  return null;

  return (
    <div className="flex flex-col gap-1 px-4 pt-2 mb-10">
      <div className="text-xl font-medium text-royalBlue dark:text-white">Water Accounting Period Type</div>
      <div className="pageContain flex flex-grow flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="input h-7 w-52">
              <Search
                size={16}
                className="text-slate-300"
              />
              <input
                name="search"
                id="search"
                placeholder="Search..."
                value={searchText}
                className="w-full bg-transparent text-sm text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                onChange={(e) => {
                  //setSearchText(e.target.value);
                  //debouncedSearch(e.target.value);
                }}
              />
            </div>
            {tableInfo.search && <Button
              variant={"default"}
              className="h-7 w-7"
              onClick={() => { setSearchText(""); setTableInfo({ ...tableInfo, search: "" }) }}
            >
              <X />
            </Button>}
          </div>
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            onClick={() => {
              navigate("/field/addField")
            }}
          >
            <Plus size={4} />
            Add Water Accounting Period Type
          </Button>
        </div>
        <div className="flex flex-grow">
          <div className={cn("w-[100%] pr-3")}>
            <div className={cn("relative h-[300px] w-full")}>
            <MapTable
              defaultData={accountParcels?.data?.parcel_table_data || []}
              columns={columns2}
              doFilter={true}
              filterValue={searchText}
              fullHeight={false}
              columnProperties={parcelColumnProperties}
              tableType={"wap_types"}
              isLoading={accountParcelsLoading}
              useClientPagination={true}
              showPagination={true}
            />
            </div>
          </div>
          </div>
        </div>
      </div>
  );
};

export default WaterAccountingPeriodType;
