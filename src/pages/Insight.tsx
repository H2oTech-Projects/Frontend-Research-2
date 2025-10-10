import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ParcelData } from "@/types/tableTypes";
import MapTable from "@/components/Table/mapTable";
import InsightTitle from "@/components/InsightTitle";
import RtSelect from "@/components/RtSelect";
import CollapseBtn from "@/components/CollapseBtn";
import { useGetAccountAllocationChart, useGetAccountDetails, useGetAccountsList, useGetAccountFarmUnits, useGetAccountParcels, useGetAllAccountData, useGetParcelList } from "@/services/insight";
import { Skeleton } from "@/components/ui/skeleton";
import { farmUnitColumnProperties, parcelColumnProperties } from "@/utils/constant";
import { AccountFarmUnitDataType } from "@/types/apiResponseType";
import InsightMap from "@/components/insightPageComponent/insightMap";
import AccountDetailTable from "@/components/insightPageComponent/accountDetailTable";
import ChartContainer from "@/components/insightPageComponent/chartContainer";
import LeafletMap from "@/components/LeafletMap";
import { InsightMapPosition, LeafletMapConfig } from "@/utils/mapConstant";
import Spinner from "@/components/Spinner";
import { useSelector } from "react-redux";
import { useMableCollapse } from "@/utils/customHooks/useMableCollapse";
interface EmailProps {
  value: string;
  label: string;
}

const Insight = () => {
  const [selectedEmailValue, setSelectedEmailValue] = useState<string | null>(null);
  const [selectedYearValue, setSelectedYearValue] = useState<string>("2025");
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [selectedFarmGeoJson, setSelectedFarmGeoJson] = useState<string | null>(null);
  const [selectedParcelGeom, setSelectedParcelGeom] = useState<[] | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);
  const [viewBoundFarmGeoJson, setViewBound] = useState<[number, number][] | null>(null);
  const [selectedReportTypeValue, setSelectedReportTypeValue] = useState<string>("Account Farm Unit Summary");
  const [searchText, setSearchText] = useState<String>("");
  const [doFilter, setDoFilter] = useState<Boolean>(false);
  const {collapse,tableCollapseBtn,mapCollapseBtn} = useMableCollapse();
  const Name = useSelector((state: any) => state.auth.user)?.split("@")?.[0];
  const { data: accountList, isLoading, isFetched } = useGetAccountsList();
  const { data: accountDetail, isLoading: accountDetailLoading } = useGetAccountDetails(selectedEmailValue);
  const { data: accountParcels, isLoading: accountParcelsLoading } = useGetAccountParcels(selectedEmailValue);
  const { data: accountFarmUnits, isLoading: accountFarmUnitsLoading } = useGetAccountFarmUnits(selectedEmailValue);
  const { data: accountAllocationChart, isLoading: chartLoading } = useGetAccountAllocationChart(selectedEmailValue);

  useEffect(() => {
    isFetched && !!accountList?.data?.[0]?.value && setSelectedEmailValue(accountList?.data[0]?.value)
  }, [isFetched]);

  useEffect(() => {
    accountDetail?.data?.view_bounds && setViewBound(accountDetail?.data?.view_bounds)
    setSelectedFarm("")
    setSelectedFarmGeoJson("")

    setSelectedParcel("")
    setSelectedParcelGeom([])
  }, [accountDetail]);

  useEffect(() => {
    if (!!selectedFarm) {

      let selectFarm = accountFarmUnits?.data?.find((farm_unit: any) => farm_unit['farm_unit_zone'] == selectedFarm)
      // @ts-ignore
      selectFarm && setSelectedFarmGeoJson(selectFarm['farm_parcel_geojson'] ?? null )
      // @ts-ignore
      selectFarm && setViewBound(selectFarm['view_bounds'])
      setSelectedParcel("")
      setSelectedParcelGeom([])
    }
  }, [selectedFarm])

  useEffect(() => {
    if (!!selectedParcel) {
      let selectParcel = accountParcels?.data?.parcel_table_data?.find((parcels: any) => parcels['parcel_id'] == selectedParcel)
      // @ts-ignore
      selectParcel['coords'] && setSelectedParcelGeom(selectParcel['coords'])
      // @ts-ignore
      selectParcel['view_bounds'] && setViewBound(selectParcel['view_bounds'])
      setSelectedFarmGeoJson("")
      setSelectedFarm(null)
    }
  }, [selectedParcel])

  const yearList: EmailProps[] = [
    {
      value: "2025",
      label: "2025"
    },
    {
      value: "2024",
      label: "2024"
    },
    {
      value: "2023",
      label: "2023"
    },
    {
      value: "2022",
      label: "2022"
    },
    {
      value: "2021",
      label: "2021"
    },
    {
      value: "2020",
      label: "2020"
    },
    {
      value: "2025",
      label: "2025"
    }
  ]

  const ReportTypeList: EmailProps[] = [
    {
      label: "Account Farm Unit Summary",
      value: "Account Farm Unit Summary"
    },
    {
      label: "Farm Unit Parcel Summary",
      value: "Farm Unit Parcel Summary"
    },
    {
      label: "Measurement Detail Report",
      value: "Measurement Detail Report",
    },

  ]


  const columns: ColumnDef<AccountFarmUnitDataType>[] = [
    {
      accessorKey: "farm_unit_zone",
      header: "Farm Unit Zone",
      size: 100,
      cell: ({ row }) => <div>{row.getValue("farm_unit_zone")}</div>,
    },
    {
      accessorKey: "fu_total_alloc_af",
      header: 'Total Allocation (AF)',
      size: 130,
      cell: ({ row }) => <div>{row.getValue("fu_total_alloc_af")}</div>,
    },
    {
      accessorKey: "fu_etaw_af",
      header: 'ETAW (AF)',
      size: 150,
      cell: ({ row }) => <div>{row.getValue("fu_etaw_af")}</div>,
    },
    {
      accessorKey: "fu_remain_af",
      header: 'Remaining (AF)',
      size: 150,
      cell: ({ row }) => <div>{row.getValue("fu_remain_af")}</div>,
    },
    {
      accessorKey: "remaining",
      header: 'Remaining (%)',
      size: 150,
      cell: ({ row }) => <div>{row.getValue("remaining")}</div>,
    },
    {
      accessorKey: "fu_sy_ac",
      header: "Sustainable Yield Acreage (AC)",
 
      cell: ({ row }) => <div>{row.getValue("fu_sy_ac")}</div>,
    },
    {
      accessorKey: "fu_tw_ac",
      header: "Transitional Water Acreage (AC)",
      size: 150,
      cell: ({ row }) => <div>{row.getValue("fu_tw_ac")}</div>,
    },
    {
      accessorKey: "fu_alloc_af",
      header: '2024 Allocation (AF)',
      size: 150,
      cell: ({ row }) => <div>{row.getValue("fu_alloc_af")}</div>,
    },
    {
      accessorKey: "fu_carryover_af",
      header: 'Carryover (AF)',
      size: 150,
      cell: ({ row }) => <div>{row.getValue("fu_carryover_af")}</div>,
    },
    {
      accessorKey: "fu_total_adjustment_af",
      header: '2024 Adjustment (AF)',
      size: 150,
      cell: ({ row }) => <div>{row.getValue("fu_total_adjustment_af")}</div>,
    },

  ];
  const columns2: ColumnDef<ParcelData>[] = [
    {
      accessorKey: "parcel_id",
      header: ({ column }) => {
        return (
          <div
          className="flex gap-2  cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Parcel ID
            {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("parcel_id")}</div>,
      size: 150
    },
    {
      accessorKey: "remain_af",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2 cursor-pointer justify-end"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Remaining (AF)
            {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </div>
        );
      },
      size: 160
    },
    {
      accessorKey: "remain_pct",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2 cursor-pointer items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Remaining (%)
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
      accessorKey: "total_alloc_af",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2 cursor-pointer items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Allocation (AF)
            {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </div>
        );
      },
      size: 180
    },
    {
      accessorKey: "etaw_af",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2 justify-end cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ETAW (AF)
            {!column.getIsSorted() ? <ArrowUpDown size={16} /> : column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </div>
        );
      },
      size: 150
    },
    {
      accessorKey: "legal_ac",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sustainable Yield Acreage (AC)
            {!column.getIsSorted() ? <ArrowUpDown size={24} /> : column.getIsSorted() === "asc" ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
          </div>
        );
      },
      size: 180
    },
    {
      accessorKey: "r_irr_ac",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transitional Water Acreage (AC)
            {!column.getIsSorted() ? <ArrowUpDown size={24} /> : column.getIsSorted() === "asc" ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
          </div>
        );
      },
      size: 180
    },

    {
      accessorKey: "alloc_af",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2  cursor-pointer items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            2024  Allocated (AF)
            {!column.getIsSorted() ? <ArrowUpDown size={20} /> : column.getIsSorted() === "asc" ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
          </div>
        );
      },
    },
    {
      accessorKey: "carryover_af",
      header: ({ column }) => {
        return (
          <div
            className="flex gap-2  justify-end cursor-pointer"
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

  if (isLoading) {
    return <div className="flex flex-col px-3 py-2 gap-3">
      <Skeleton className="h-6 w-[250px]" />
      <Skeleton className="h-6 w-[200px]" />
      <Skeleton className="h-6 w-[200px]" />
      <Skeleton className="h-6 w-[200px]" />
      <div className="flex flex-grow mt-2">
        <div className="w-1/2 pr-3" >
          <Skeleton className="h-[calc(100vh-232px)] w-full rounded-[8px] " />
        </div>
        <div className="w-1/2 pl-3" >
          <Skeleton className="h-[calc(100vh-232px)] w-full rounded-[8px] " />
        </div>
      </div>
    </div>
  }
  else {
    return (
      <div className="flex flex-col px-3 py-2 ">
        <div className="text-xl font-medium text-royalBlue dark:text-white">{ Name?.charAt(0).toUpperCase() + Name?.slice(1)} Allocation Report</div>
        <div className="flex flex-col items-start  mt-2 gap-2 dark:text-slate-50 ">
          <RtSelect selectedValue={selectedEmailValue as string} dropdownList={accountList?.data ?? []} label="Account" setSelectedValue={()=>console.log("test")} />
          <RtSelect selectedValue={selectedReportTypeValue} dropdownList={ReportTypeList} label="Report Type" setSelectedValue={setSelectedReportTypeValue} showSearch={false} />
          <RtSelect selectedValue={selectedYearValue} dropdownList={yearList} label="Year" setSelectedValue={setSelectedYearValue} showSearch={false} />
        </div>
        <div className="flex flex-grow mt-2">
          <div className={cn("relative  w-1/2 overflow-y-hidden", collapse === "table" ? "hidden" : "", collapse === "map" ? "flex-grow" : "pr-3")}>
            <div className={cn("h-[calc(100vh-14.5rem)] w-full bg-white dark:bg-slate-900 rounded-[8px]  ")}>
              <div className="pb-2 px-3 overflow-auto h-full">
                <InsightTitle
                  title="Account Summary"
                  note="Note: For additional information about Account information,
                                contact Madera Country Water and Natural Resources Department at (559) 662-8015
                                or WNR@maderacounty.com for information."
                />
                <ChartContainer data={accountAllocationChart?.data!} loading={chartLoading} setSelectedFarm={setSelectedFarm}/>
                <div className="rounded-[8px] overflow-hidden my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)] dark:bg-slate-500 ">
                  <AccountDetailTable accountDetailLoading={accountDetailLoading} accountDetail={accountDetail?.data!} />
                </div>
                <InsightTitle
                  title="Farm Unit Summary"
                  note=" Note: For additional information about Allocations, ETAW, Remaining Allocation, and Carryover Water, contact the Madera County Water and Natural
                                                Resources Department Office at (559) 662-8015 or WNR@maderacounty.com for information. Total Allocation (AF) is equal to the sum of 2024
                                                Allocation (AF), Carryover (AF), and 2024 Adjustment(s) (AF)"
                />
                <div className="my-2 px-3 py-2 rounded-[8px] overflow-hidden shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)] h-[420px] ">
                  <MapTable
                    defaultData={accountFarmUnits?.data as AccountFarmUnitDataType[] || []}
                    columns={columns}
                    doFilter={false}
                    filterValue={""}
                    fullHeight={true}
                    showPagination={false}
                    textAlign="left" // this aligns the text to the left in the table, if not provided it will be center
                    columnProperties={farmUnitColumnProperties}
                    tableType={"farm"}
                    setSelectedFarm={setSelectedFarm}
                    isLoading={accountFarmUnitsLoading}
                    customHeight={"h-[400px]"}
                    collapse={collapse}
                  />
                </div>

                <InsightTitle title="County Assessor's Parcel Information"
                  note="Note: The following information is based on records from the Madera County Assessor's Office. Contact the Madera County Assessor's Office at (559)
                                        675-7710 or assessor@maderacounty.com for information."
                />
                <div className="rounded-[8px] overflow-hidden my-2 shadow-[0px_19px_38px_rgba(0,0,0,0.3),0px_15px_12px_rgba(0,0,0,0.22)] px-3 py-2">
                  <div className='flex flex-col gap-2 '>
                    <div className="flex gap-2 mt-2">
                      <div className="input h-7 w-52">
                        <Search
                          size={16}
                          className="text-slate-300"
                        />
                        <input
                          type="text"
                          name="search"
                          id="search"
                          placeholder="Search parcel"
                          className="w-full bg-transparent text-sm text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                          value={String(searchText)}
                          onChange={(e) => {
                            setSearchText(String(e.target.value));
                            setDoFilter(!doFilter);
                          }}
                        />
                      </div>
                      <Button
                        variant={"default"}
                        className="h-7 w-7"
                        onClick={() => setDoFilter(!doFilter)}
                      >
                        <Filter />
                      </Button>
                    </div>
                    <div className="h-[calc(100vh-300px)]">
                      <MapTable
                        defaultData={accountParcels?.data?.parcel_table_data || []}
                        columns={columns2}
                        doFilter={doFilter}
                        filterValue={searchText}
                        fullHeight={true}
                        customHeight={'h-[calc(100vh-348px)]'}
                        columnProperties={parcelColumnProperties}
                        tableType={"insightParcel"}
                        setSelectedParcel={setSelectedParcel}
                        isLoading={accountParcelsLoading}
                        useClientPagination={true}
                        showPagination={true}
                        collapse={collapse}
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>
            <CollapseBtn
              className="absolute -right-1 top-1/2 z-[800] m-2 flex size-8  items-center justify-center"
              onClick={mapCollapseBtn}
              note={collapse === 'default' ? 'View Full Table' : "Show Map"}
            >
              <ChevronsRight className={cn(collapse === "map" ? "rotate-180" : "")} size={20} />
            </CollapseBtn>
          </div>

          <div className={cn("w-1/2", collapse === "map" ? "hidden" : "", collapse === "table" ? "flex-grow" : "pl-3")}>
            <div
              className={cn(" relative flex h-[calc(100dvh-232px)] w-full", collapse === "default" ? "Default-Map" : "insight-Map")}
              id="map2"
            >
              {
                !!accountDetail?.data ? <InsightMap viewBoundFarmGeoJson={viewBoundFarmGeoJson!} accountDetail={accountDetail?.data} collapse={collapse} selectedEmailValue={selectedEmailValue} selectedFarmGeoJson={selectedFarmGeoJson} selectedFarm={selectedFarm} selectedParcel={selectedParcel} selectedParcelGeom={selectedParcelGeom!} parcelInfo={accountParcels?.data?.parcel_id_mapper || {}} /> : <LeafletMap
                  position={InsightMapPosition}
                  zoom={14}
                  // viewBound={ accountDetail?.data?.view_bounds }
                  collapse={collapse}
                  configurations={LeafletMapConfig}
                >
                  <div className="absolute top-1/2 left-1/2 right-1/2 z-[800] flex gap-4 -ml-[70px] ">
                    <div className="flex  rounded-lg bg-[#16599a] text-slate-50 bg-opacity-65 p-2 text-xl h-auto gap-3 ">Loading <Spinner /></div>
                  </div>
                </LeafletMap>
              }
              <CollapseBtn
                className="absolute -left-4 top-1/2 z-[11000] m-2 flex size-8 items-center justify-center"
                onClick={tableCollapseBtn}
                note={collapse === 'default' ? 'View Full Map' : "Show Table"}
              >
                <ChevronsLeft className={cn(collapse === "table" ? "rotate-180" : "")} size={20} />
              </CollapseBtn>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Insight;