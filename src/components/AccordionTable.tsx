import { Filter, Search } from 'lucide-react';
import  { useState } from 'react'
import { Button } from './ui/button';
import MapTable from './Table/mapTable';
import { ColumnDef } from "@tanstack/react-table";

type ParcelData = {
  parcel_id: string;
  account_id: string;
  zone_name: string;
  zone_abr: string;
  alloc_af: number;
  primary_crop: string;
  legal_ac: number;
  carryover_af: number;
  coords: [number, number][];
};



export const columns: ColumnDef<ParcelData>[] = [
  {
    accessorKey: "zone_name",
    header: "Zone Name",
  },
  {
    accessorKey: "parcel_id",
    header: "Parcel ID",
  },
  {
    accessorKey: "account_id",
    header: "Account ID",
  },
  {
    accessorKey: "zone_abr",
    header: "Zone Abbreviation",
  },
  {
    accessorKey: "alloc_af",
    header: "Allocated AF",
  },
  {
    accessorKey: "primary_crop",
    header: "Primary Crop",
  },
  {
    accessorKey: "legal_ac",
    header: "Legal Acres",
  },
  {
    accessorKey: "carryover_af",
    header: "Carryover AF",
  },

];


const AccordionTable = ({data , columnProperties}:{data:ParcelData[]; columnProperties:any;}) => {
  const [searchText, setSearchText] = useState<String>("");
  const [doFilter, setDoFilter] = useState<Boolean>(false);
  return (
    <div className='flex flex-col gap-2 '>
      <div className="flex gap-2">
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
      <div>
        <MapTable
          defaultData={data}
          columns={columns}
          doFilter={doFilter}
          filterValue={searchText}
          fullHeight={false}
          tableCSSConfig={{headerFontSize:null, bodyFontSize:"text-xs"}}
          columnProperties={columnProperties}
        />
      </div>
    </div>

  )
}

export default AccordionTable
