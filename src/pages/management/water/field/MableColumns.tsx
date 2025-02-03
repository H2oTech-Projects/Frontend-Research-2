import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { DummyDataType } from "@/types/tableTypes";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, Filter, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

let MableColumns: ColumnDef<DummyDataType>[] = [
  {
      accessorKey: "FieldID",
      // header: "Field ID",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Field ID {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}

              </Button>
          );
      },

      size: 100, // this size value is in px
      cell: ({ row }) => <div className="capitalize">{row.getValue("FieldID")}</div>,
      //filterFn: 'includesString',
  },
  {
      accessorKey: "FieldDesc",
      // header: () => {
      //     return <>Field Description</>;
      // },
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Field Description
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 300,
      cell: ({ row }) => <div className="lowercase">{row.getValue("FieldDesc")}</div>,
  },
  {
      accessorKey: "FieldAcres",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Field Acres
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 150,
      cell: ({ row }) => <div className="capitalize">{row.getValue("FieldAcres")}</div>,
  },
  {
      accessorKey: "IrrigAcres",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Irrig Acres
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 150,
      cell: ({ row }) => <div className="capitalize">{row.getValue("IrrigAcres")}</div>,
  },
  // {
  //     accessorKey: "status",
  //     header: "status",
  //     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  // },
  {
      accessorKey: "StandbyAcr",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Stand by Acres
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 200,
      cell: ({ row }) => <div>{row.getValue("StandbyAcr")}</div>,
  },
  {
      accessorKey: "ParcelID",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  ParcelID
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 300,
      cell: ({ row }) => <div>{row.getValue("ParcelID")}</div>,
  },
  {
      accessorKey: "VolRateAdj",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  VolRateAdj
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 150,
      cell: ({ row }) => <div>{row.getValue("VolRateAdj")}</div>,
  },
  {
      accessorKey: "ActiveDate",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Active Date
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 150,
      cell: ({ row }) => <div>{dayjs(row.getValue("ActiveDate")).format("MM/DD/YYYY")}</div>,
  },
  {
      accessorKey: "InactiveDa",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Inactive Date
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      size: 150,
      cell: ({ row }) => <div>{dayjs(row.getValue("InactiveDa")).format("MM/DD/YYYY")}</div>,
  },
  {
      accessorKey: "ActiveFlag",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Active Status
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      cell: ({ row }) => <div>{row.getValue("ActiveFlag")}</div>,
  },
  {
      accessorKey: "unq_fld_id",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Unique Flag ID
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      cell: ({ row }) => <div>{row.getValue("unq_fld_id")}</div>,
  },
  {
      accessorKey: "AreaAC",
      header: ({ column }) => {
          return (
              <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                  Area Acres
                  {!column.getIsSorted() ? <ArrowUpDown /> : column.getIsSorted() === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
          );
      },
      cell: ({ row }) => <div>{row.getValue("AreaAC")}</div>,
  },
  {
      id: "actions",
      header: "",
      size: 40,
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
                  <DropdownMenuItem>
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

export default MableColumns;