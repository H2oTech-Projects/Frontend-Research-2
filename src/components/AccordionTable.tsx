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

const DummyData: ParcelData[] = [
  {
    "parcel_id": "041-051-001",
    "account_id": "MAD_MA_00110",
    "zone_name": "Madera Subbasin Madera County GSA North",
    "zone_abr": "MN",
    "alloc_af": 1100.25,
    "primary_crop": "Almonds",
    "legal_ac": 500.00,
    "carryover_af": 600.5,
    "coords": [[39.023400, -121.751500], [39.023450, -121.751450]]
  },
  {
    "parcel_id": "041-051-002",
    "account_id": "MAD_MA_00111",
    "zone_name": "Madera Subbasin Madera County GSA South",
    "zone_abr": "MS",
    "alloc_af": 950.75,
    "primary_crop": "Pistachios",
    "legal_ac": 450.00,
    "carryover_af": 500.2,
    "coords": [[39.022400, -121.750500], [39.022450, -121.750450]]
  },
  {
    "parcel_id": "041-051-003",
    "account_id": "MAD_MA_00112",
    "zone_name": "Madera Subbasin Madera County GSA West",
    "zone_abr": "MW",
    "alloc_af": 1238.14,
    "primary_crop": "Almonds",
    "legal_ac": 542.25,
    "carryover_af": 680.9,
    "coords": [[39.023449, -121.751577], [39.023467, -121.751556]]
  },
  {
    "parcel_id": "041-051-004",
    "account_id": "MAD_MA_00113",
    "zone_name": "Madera Subbasin Madera County GSA East",
    "zone_abr": "ME",
    "alloc_af": 980.50,
    "primary_crop": "Grapes",
    "legal_ac": 400.00,
    "carryover_af": 520.3,
    "coords": [[39.021397, -121.742354], [39.021061, -121.742197]]
  },
  {
    "parcel_id": "041-051-005",
    "account_id": "MAD_MA_00114",
    "zone_name": "Madera Subbasin Madera County GSA Central",
    "zone_abr": "MC",
    "alloc_af": 860.90,
    "primary_crop": "Wheat",
    "legal_ac": 380.00,
    "carryover_af": 450.7,
    "coords": [[39.020800, -121.741900], [39.020850, -121.741850]]
  },
  {
    "parcel_id": "041-051-006",
    "account_id": "MAD_MA_00115",
    "zone_name": "Madera Subbasin Madera County GSA South",
    "zone_abr": "MS",
    "alloc_af": 1200.00,
    "primary_crop": "Corn",
    "legal_ac": 550.00,
    "carryover_af": 700.5,
    "coords": [[39.019500, -121.740800], [39.019550, -121.740750]]
  },
  {
    "parcel_id": "041-051-007",
    "account_id": "MAD_MA_00116",
    "zone_name": "Madera Subbasin Madera County GSA North",
    "zone_abr": "MN",
    "alloc_af": 1075.30,
    "primary_crop": "Cotton",
    "legal_ac": 470.00,
    "carryover_af": 590.6,
    "coords": [[39.018700, -121.739800], [39.018750, -121.739750]]
  },
  {
    "parcel_id": "041-051-008",
    "account_id": "MAD_MA_00117",
    "zone_name": "Madera Subbasin Madera County GSA West",
    "zone_abr": "MW",
    "alloc_af": 990.45,
    "primary_crop": "Tomatoes",
    "legal_ac": 430.00,
    "carryover_af": 480.8,
    "coords": [[39.017600, -121.738700], [39.017650, -121.738650]]
  },
  {
    "parcel_id": "041-051-009",
    "account_id": "MAD_MA_00118",
    "zone_name": "Madera Subbasin Madera County GSA East",
    "zone_abr": "ME",
    "alloc_af": 1120.65,
    "primary_crop": "Barley",
    "legal_ac": 510.00,
    "carryover_af": 620.1,
    "coords": [[39.016500, -121.737600], [39.016550, -121.737550]]
  },
  {
    "parcel_id": "041-051-010",
    "account_id": "MAD_MA_00119",
    "zone_name": "Madera Subbasin Madera County GSA Central",
    "zone_abr": "MC",
    "alloc_af": 1025.80,
    "primary_crop": "Soybeans",
    "legal_ac": 495.00,
    "carryover_af": 575.9,
    "coords": [[39.015400, -121.736500], [39.015450, -121.736450]]
  },
  {
    "parcel_id": "041-051-011",
    "account_id": "MAD_MA_00120",
    "zone_name": "Madera Subbasin Madera County GSA South",
    "zone_abr": "MS",
    "alloc_af": 1095.95,
    "primary_crop": "Oats",
    "legal_ac": 520.00,
    "carryover_af": 640.4,
    "coords": [[39.014300, -121.735400], [39.014350, -121.735350]]
  },
  {
    "parcel_id": "041-051-012",
    "account_id": "MAD_MA_00121",
    "zone_name": "Madera Subbasin Madera County GSA North",
    "zone_abr": "MN",
    "alloc_af": 1150.20,
    "primary_crop": "Rice",
    "legal_ac": 530.00,
    "carryover_af": 660.3,
    "coords": [[39.013200, -121.734300], [39.013250, -121.734250]]
  }
]

export const columns: ColumnDef<ParcelData>[] = [
  {
    accessorKey: "parcel_id",
    header: "Parcel ID",
  },
  {
    accessorKey: "account_id",
    header: "Account ID",
  },
  {
    accessorKey: "zone_name",
    header: "Zone Name",
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


const AccordionTable = ({data}:{data:ParcelData[]}) => {
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

        />
      </div>
    </div>

  )
}

export default AccordionTable
