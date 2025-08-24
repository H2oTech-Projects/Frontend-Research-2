import PageHeader from "@/components/PageHeader";
import MapTable from "@/components/Table/mapTable";
import { Button } from "@/components/ui/button";
import { useGetCropList } from "@/services/crops";
import { debounce } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { useCallback, useState } from "react";


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

const Crops = () => {
  const [searchText, setSearchText] = useState("");
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const { data: cropList, isLoading: isCropLoading } = useGetCropList(tableInfo);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "cropName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Crop Name {tableInfo?.sort !== "crop_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className="lowercase">{row.getValue("cropName")}</div>,
    },
    {
      accessorKey: "cropDesc",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_desc", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Crop Description  {tableInfo?.sort !== "crop_desc" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className=" flex flex-wrap h-auto w-auto">{row.getValue("cropDesc")}</div>,
    },

  ];

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );
  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">

      <PageHeader
        pageHeaderTitle="Crops"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
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
                  setSearchText(e.target.value);
                  debouncedSearch(e.target.value);
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
        </div>
        <div className="flex w-full">
          <div className="w-full h-[calc(100vh-160px)]">
            <MapTable
              defaultData={cropList?.data || []}
              columns={columns}
              tableInfo={tableInfo}
              setTableInfo={setTableInfo}
              totalData={cropList?.totalRecords || 1}
              isLoading={isCropLoading}
              customHeight="h-[calc(100vh-210px)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Crops
