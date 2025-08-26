import PageHeader from "@/components/PageHeader";
import MapTable from "@/components/Table/mapTable";
import { Button } from "@/components/ui/button";
import { useDeleteCustomer, useGetCustomers } from "@/services/customers";
import { debounce } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { customerPageColumnProperties } from "@/utils/constant";
import CustomModal from "@/components/modal/ConfirmModal";
import { GET_CUSTOMER_LIST_KEY } from "@/services/customers/constants";
import { toast } from "react-toastify";
import { showErrorToast } from "@/utils/tools";

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

const Customers = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [tableInfo, setTableInfo] = useState<initialTableDataTypes>({ ...initialTableData })
  const { data: customerList, isLoading: isCustomersLoading ,refetch} = useGetCustomers(tableInfo);
  const { mutate: deleteCustomer } = useDeleteCustomer();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "name", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Customer Name {tableInfo?.sort !== "crop_name" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className=" px-3">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "email", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Email  {tableInfo?.sort !== "email" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className=" px-3">{row.getValue("email") || "---"}</div>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            className="flex items-start justify-start"
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "phone", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Phone No.  {tableInfo?.sort !== "phone" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      size: 180,
      cell: ({ row }) => <div className=" px-3">{row.getValue("phone") || "---"}</div>,
    },
    {
      accessorKey: "active",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => { setTableInfo({ ...tableInfo, sort: "active", sort_order: tableInfo.sort_order === undefined ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc" }) }}
          >
            Active Status
            {tableInfo?.sort !== "active" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
          </Button>
        );
      },
      cell: ({ row }) => <div className="flex justify-center items-center">{row.getValue("active") ? <div className="w-3 h-3 rounded-full bg-green-500 "></div> : <div className="w-3 h-3 rounded-full bg-red-500"></div>}</div>,
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
            <DropdownMenuItem onClick={() => { navigate(`/customers/${row.original.id}/edit`) }}>
              <FilePenLine /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => { setId(String(row.original.id!)); setOpen(true) }}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { navigate(`/customers/${row.original.id}/view`) }}>
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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setTableInfo((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );

  const handleDelete = () => {
    deleteCustomer({ customerId: id }, {
      onSuccess: () => {
        refetch();
        setOpen(false);
        toast.success("Customer deleted successfully");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
    });
  };

  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Field"
        description="Are you sure you want to delete this Customer? This action cannot be undone."
        onConfirm={handleDelete}
      />
      <PageHeader
        pageHeaderTitle="Customers"
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
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            onClick={() => {
              navigate(`/customers/add`)
            }}
          >
            <Plus size={4} />
            Add Customer
          </Button>
        </div>
        <div className="flex w-full">
          <div className="w-full h-[calc(100vh-160px)]">
            <MapTable
              defaultData={customerList?.data || []}
              columns={columns}
              tableInfo={tableInfo}
              setTableInfo={setTableInfo}
              totalData={customerList?.totalRecords || 1}
              isLoading={isCustomersLoading}
              customHeight="h-[calc(100vh-210px)]"
              columnProperties={customerPageColumnProperties}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customers;
