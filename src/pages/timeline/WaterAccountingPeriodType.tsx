import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "@/components/ui/button";

import { useGetPeriodTypes } from "@/services/timeseries";
import MapTable from "@/components/Table/mapTable";
import { ColumnDef } from "@tanstack/react-table";
import { waPeriodTypeColumnProperties } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import WaptForm from "./WaptForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface waPeriodTypeData {
  id: string,
  client_name: string,
  wa_period_type: string,
  wa_period_type_name: string,
}

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

const WaterAccountingPeriodType = () => {
  const navigate = useNavigate();
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const [searchText, setSearchText] = useState("");
  const {data:accountParcels, isLoading:accountParcelsLoading} = useGetPeriodTypes();
  const [editId, setEditId] = useState<any>(null);
  // const [doFilter, setDoFilter] = useState<Boolean>(false);
  const waPeriodTypecolumns: ColumnDef<waPeriodTypeData>[] = [
    {
      accessorKey: "client_name",
      header: ({ column }) => {
              return (
                  <div
                      className="flex gap-2 align-middle cursor-pointer"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                     Client Id
                      {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
              );
          },
    },
    {
      accessorKey: "wa_period_type",
      size: 150,
      header: ({ column }) => {
              return (
                  <div
                      className="flex gap-2 align-middle cursor-pointer"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Water Accounting Period Type
                      {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
              );
          },

    },
    {
      accessorKey: "wa_period_type_name",
      header: ({ column }) => {
              return (
                  <div
                      className="flex gap-2 cursor-pointer"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                      Water Accounting Period Type Name
                      {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
              );
          },

    },
    {
      id: "actions",
      header: "",
      size: 60,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {setEditId(row.original.id) }}>
              <FilePenLine /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Trash2 />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye />
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: {
        className: "sticky right-0 !z-9 !bg-white !transition-colors dark:!bg-slateLight-500 ",
      },
    },
  ];
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
          {/* <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm mr-2"
            onClick={() => {
              navigate("/field/addField")
            }}
          >
            <Plus size={4} />
            Add Water Accounting Period Type
          </Button> */}
          <WaptForm id={editId} setEditId={setEditId}/>
        </div>

        <div className="flex flex-grow">
          <div className={cn("w-[100%] pr-3")}>
            <div className={cn("relative h-[300px] w-full")}>
            <MapTable
              defaultData={accountParcels?.data || []}
              columns={waPeriodTypecolumns}
              doFilter={true}
              filterValue={searchText}
              fullHeight={false}
              columnProperties={waPeriodTypeColumnProperties}
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
