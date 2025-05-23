import CollapseBtn from '@/components/CollapseBtn';
import LeafletMap from '@/components/LeafletMap';
import PageHeader from '@/components/PageHeader'
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { ClientTableDataTypes, initialTableDataTypes } from '@/types/tableTypes';
import { cn } from '@/utils/cn';
import { ColumnDef } from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Eye, FilePenLine, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MapTable from '@/components/Table/mapTable';
import { useDeleteClient, useGetClientList } from '@/services/client';
import { toast } from 'react-toastify';
import { showErrorToast } from '@/utils/tools';
import { GET_CLIENT_LIST_KEY } from '@/services/client/constant';
import { useQueryClient } from '@tanstack/react-query';
import CustomModal from '@/components/modal/ConfirmModal';
import { set } from 'date-fns';
import RtGeoJson from '@/components/RtGeoJson';

const initialTableData = {
  search: "",
  page_no:1,
  page_size:50,
  sort: '',
  sort_order:''
}


const Clients = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const [tableInfo,setTableInfo] = useState<initialTableDataTypes>({...initialTableData})
  const [collapse, setCollapse] = useState("default");
  const [position, setPosition] = useState<any>({ center: [38.86902846413033, -121.729324818604], polygon: [], fieldId: "", features: {} });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [clickedField, setClickedField] = useState(null);
  const {data: clientData,isLoading} = useGetClientList(tableInfo);
  const {mutate:deleteClient,isPending} =  useDeleteClient();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const tableCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "table" : "default"));
  };
  const mapCollapseBtn = () => {
    setCollapse((prev) => (prev === "default" ? "map" : "default"));
  };
  const handleDelete = () => {
    deleteClient(id,{
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [GET_CLIENT_LIST_KEY]})
        toast.success("Client deleted successfully");
      },
      onError: (error) => {
        showErrorToast(error?.response?.data.message);
      },
     });
  };

  const columns: ColumnDef<ClientTableDataTypes>[] = [
    {
        accessorKey: "clientId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {setTableInfo({...tableInfo,sort:"clientId",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                >
                    Client ID{tableInfo?.sort !== "clientId" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            );
        },
        size: 100,
        cell: ({ row }) => <div className="capitalize">{row.getValue("clientId")}</div>,
    },
    {
        accessorKey: "clientName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {setTableInfo({...tableInfo,sort:"clientName",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                >
                    Client Name{tableInfo?.sort !== "clientName" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            );
        },
        size: 150,
        cell: ({ row }) => <div className="capitalize">{row.getValue("clientName")}</div>,
    },
    {
        accessorKey: "clientLegalHa",        // header: "Field ID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {setTableInfo({...tableInfo,sort:"clientHa",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                >
                    Client Acres{tableInfo?.sort !== "clientHa" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            );
        },
        size: 150,
        cell: ({ row }) => <div className="capitalize">{row.getValue("clientLegalHa")}</div>,
    },
    {
        accessorKey: "clientCountry",        // header: "Field ID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {setTableInfo({...tableInfo,sort:"clientCountry",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                >
                    Country{tableInfo?.sort !== "clientCountry" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            );
        },
        size: 150,
        cell: ({ row }) => <div className="capitalize">{row.getValue("clientCountry")}</div>,
    },
    {
        accessorKey: "clientEmail",        // header: "Field ID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {setTableInfo({...tableInfo,sort:"clientEmail",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                >
                    Client Email{tableInfo?.sort !== "clientEmail" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            );
        },
        size: 150,
        cell: ({ row }) => <div className="capitalize">{row.getValue("clientEmail")}</div>,
    },
    {
        accessorKey: "clientPhone",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {setTableInfo({...tableInfo,sort:"clientPhone",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                >
                    Client Phone{tableInfo?.sort !== "clientPhone" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            );
        },
        size: 200,
        cell: ({ row }) => <div className="capitalize">{row.getValue("clientPhone")}</div>,
    },
    {
        accessorKey: "clientWebsite",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {setTableInfo({...tableInfo,sort:"clientWebsite",sort_order: tableInfo.sort_order === undefined  ? "asc" : tableInfo.sort_order === "asc" ? "desc" : "asc"})}}
                >
                    Website{tableInfo?.sort !== "clientWebsite" ? <ArrowUpDown /> : tableInfo?.sort_order === "asc" ? <ArrowUp /> : <ArrowDown />}
                </Button>
            );
        },
        size: 200,
        cell: ({ row }) => <div className="capitalize">{row.getValue("clientWebsite")}</div>,
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
                    <DropdownMenuItem onClick={() =>{ navigate(`/clients/${row.original.id}/edit`, { state: { mode: "Edit", id: row.original.id } })}}>
                        <FilePenLine /> Edit
                    </DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>{ setId(row.original.id); setOpen(true)}}>
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

  console.log(clientData)

    const geoJsonLayerEvents = (feature: any, layer: any) => {
    // layer.bindPopup(buildPopupMessage(parcelInfo[feature.properties.apn]));
    layer.on({
      mouseover: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 4,
          //color: "#800080"
        });
        // showInfo(auxLayer.feature.properties.apn);
      },
      mouseout: function (e: any) {
        const auxLayer = e.target;
        auxLayer.setStyle({
          weight: 2.5,
          //color: "#9370DB",
          //fillColor: "lightblue",
          fillOpacity: 0,
          opacity: 1,
        });
        // removeInfo(auxLayer.feature.properties.apn);
      },
    })
  };

  return (
    <div className="flex h-full flex-col gap-1 px-4 pt-2">
      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        onConfirm={handleDelete}
      />
      <PageHeader
        pageHeaderTitle="Clients"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }]}
      />
      <div className="pageContain flex flex-grow flex-col gap-3">
        <div className="flex justify-between ">
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
                // value={searchText}
                className="w-full bg-transparent text-sm text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
              />
            </div>
          </div>
          <Button
            variant={"default"}
            className="h-7 w-auto px-2 text-sm"
            onClick={() => {
              navigate("/clients/addClient", {
                state: { mode: "Add" },
              });
            }}
          >
            <Plus size={4} />
            Add Client
          </Button>
        </div>
                <div className="flex flex-grow">
          <div className={cn("w-1/2", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
            <div className={cn("relative h-[calc(100vh-160px)] w-full")}>
                <MapTable
                  defaultData={clientData?.data || []}
                  columns={columns}
                  // setPosition={setPosition as Function}
                  setZoomLevel={setZoomLevel as Function}
                  // setClickedField={setClickedField}
                  // clickedField={clickedField}
                  tableInfo={tableInfo}
                  setTableInfo={setTableInfo}
                  totalData={clientData?.totalRecords || 1}
                  collapse={collapse}
                  isLoading={isLoading }
                />
              <CollapseBtn
                className="absolute -right-1 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
                onClick={mapCollapseBtn}
                note={collapse === 'default' ? 'View Full Table' : "Show Map"}
              >
                <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </div>
          </div>

          <div className={cn("w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3")}>
            <div
              className={cn("relative flex h-[calc(100vh-160px)] w-full")}
              id="map"
            >
              <LeafletMap
                position={position}
                zoom={zoomLevel}
                collapse={collapse}

                configurations={{ 'minZoom': 11, 'containerStyle': { height: "100%", width: "100%", overflow: "hidden", borderRadius: "8px" } }}
              >
               {isLoading ? <div className="absolute top-1/2 left-1/2 right-1/2 z-[800] flex gap-4 -ml-[70px] ">
                  <div className="flex  rounded-lg bg-[#16599a] text-slate-50 bg-opacity-65 p-2 text-xl h-auto gap-3 ">Loading <Spinner /></div>
                </div> :    

                clientData?.geojson && ( <RtGeoJson
            layerEvents={geoJsonLayerEvents}
            data={JSON.parse(clientData?.geojson!)}
            style={{ fillColor: "transparent", color: "#9370DB", weight: 1.5 }}
            key={"clientData"}
            color="#9370DB" />)

 } 

              </LeafletMap>
              <CollapseBtn
                className="absolute -left-4 top-1/2 z-[9998] m-2 flex size-8 items-center justify-center"
                onClick={tableCollapseBtn}
                note={collapse === 'default' ? 'View Full Map' : "Show Table"}
              >
                <ChevronsLeft className={cn(collapse === "table" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Clients
