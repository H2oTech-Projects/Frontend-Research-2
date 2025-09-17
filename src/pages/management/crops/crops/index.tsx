import PageHeader from "@/components/PageHeader";
import MapTable from "@/components/Table/mapTable";
import { Button } from "@/components/ui/button";
import { useDeleteCrops, useGetCropList } from "@/services/crops";
import { debounce } from "@/utils";
import { cropColumnProperties } from "@/utils/constant";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { showErrorToast } from "@/utils/tools";
import CustomModal from "@/components/modal/ConfirmModal";
import PermissionCheckWrapper from "@/components/wrappers/PermissionCheckWrapper";

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
  const navigate = useNavigate();
  const [id, setId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const { data: cropList, isLoading: isCropLoading, refetch } = useGetCropList(tableInfo);
  const { mutate: deleteCrop } = useDeleteCrops();
  const queryClient = useQueryClient();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "cropName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_name", sort_order: !tableInfo.sort_order || tableInfo?.sort_order === "desc" ? "asc" : "desc" }) }}
          >
            Crop Name {tableInfo?.sort !== "crop_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      cell: ({ row }) => <div className=" px-3">{row.getValue("cropName")}</div>,
    },
    {
      accessorKey: "cropCode",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_code", sort_order: !tableInfo.sort_order || tableInfo?.sort_order === "desc" ? "asc" : "desc" }) }}
          >
            Crop Code  {tableInfo?.sort !== "crop_code" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      cell: ({ row }) => <div className=" px-3">{row.getValue("cropCode")}</div>,
    },

    {
      accessorKey: "cropAbbrev",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_abbrev", sort_order: !tableInfo.sort_order || tableInfo?.sort_order === "desc" ? "asc" : "desc" }) }}
          >
            Crop Abbreviation  {tableInfo?.sort !== "crop_abbrev" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 200,
      cell: ({ row }) => <div className=" px-3">{row.getValue("cropAbbrev")}</div>,
    },
    {
      accessorKey: "cropGroupName",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_group_name", sort_order: !tableInfo.sort_order || tableInfo?.sort_order === "desc" ? "asc" : "desc" }) }}
          >
            Crop Group Name  {tableInfo?.sort !== "crop_group_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },

      cell: ({ row }) => <div className=" px-3">{row.getValue("cropGroupName")}</div>,
    },
    {
      accessorKey: "cropDesc",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_desc", sort_order: !tableInfo.sort_order || tableInfo?.sort_order === "desc" ? "asc" : "desc" }) }}
          >
            Crop Description  {tableInfo?.sort !== "crop_desc" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 300,
      cell: ({ row }) => <div className=" px-3">{row.getValue("cropDesc")}</div>,
    },
    {
      accessorKey: "cropAppDepthM",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start "
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "crop_app_depth_m", sort_order: !tableInfo.sort_order || tableInfo?.sort_order === "desc" ? "asc" : "desc" }) }}
          >
            Crop App Depth  {tableInfo?.sort !== "crop_app_depth_m" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 150,
      cell: ({ row }) => <div className=" px-3">{row.getValue("cropAppDepthM")}</div>,
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
            <PermissionCheckWrapper name="EditCrop">
              <DropdownMenuItem onClick={() => { navigate(`/crops/${row.original.id}/edit/`) }}>
                <FilePenLine /> Edit
              </DropdownMenuItem>
            </PermissionCheckWrapper>
            <PermissionCheckWrapper name="EditCrop">
              <DropdownMenuItem onClick={() => { setId(String(row.original.id!)); setOpen(true) }}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </PermissionCheckWrapper>
            <PermissionCheckWrapper name="ViewCrop">
              <DropdownMenuItem onClick={() => { navigate(`/crops/${row.original.id}/view/`) }}>
                <Eye />
                View
              </DropdownMenuItem>
            </PermissionCheckWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: {
        className: "sticky right-0 !z-9 !bg-white !transition-colors dark:!bg-slateLight-500 ",
      },
    },
  ];

  const handleDelete = () => {
    deleteCrop(id, {
      onSuccess: () => {
        refetch();
        toast.success("Crop deleted successfully.");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  };

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

      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Crop"
        description="Are you sure you want to delete this Crop? This action cannot be undone."
        onConfirm={handleDelete}
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
          <PermissionCheckWrapper name="AddCrop">
            <Button
              variant={"default"}
              className="h-7 w-auto px-2 text-sm"
              onClick={() => {
                navigate(`/crops/add`)
              }}
            >
              <Plus size={4} />
              Add Crops
            </Button>
          </PermissionCheckWrapper>
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
              columnProperties={cropColumnProperties}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Crops
