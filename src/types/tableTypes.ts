import { ColumnDef } from "@tanstack/react-table";
import { string } from "yup";

export type ParcelData = {
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

export type tableCSSConfig = {
  headerFontSize: string | null;
  bodyFontSize: string | null;
}

export type MapTableTypes<T> = {
    defaultData: T[];
    columns: ColumnDef<T>[];
    doFilter: Boolean;
    filterValue: String;
    setPosition?: null | Function;
    setZoomLevel?: null | Function;
    setClickedField?: null | Function;
    clickedField?: null | string;
    fullHeight?: boolean;
    showPagination?: boolean;
    textAlign?: "left" | "center" | "right";
    columnProperties?: any | null;
    tableCSSConfig?: tableCSSConfig | null;
    tableType?: string | null;
    setSelectedFarm?: null | Function;
};
export type DummyDataType = {
    district?: string;
    FieldID?: string;
    FieldDesc?: string;
    FieldAcres?: number;
    IrrigAcres?: number;
    StandbyAcr?: number;
    ParcelID?: string;
    VolRateAdj?: number;
    ActiveDate?: string; // ISO Date format
    InactiveDa?: string; // ISO Date format
    ActiveFlag?: string;
    unq_fld_id?: number;
    center_latitude?: number;
    center_longitude?: number;
    AreaAC?: number;
};

export type FarmUnit = {
    farm_unit_zone: string; // Farm Unit Zone
    fu_sy_ac: number; // Sustainable Yield Acreage (AC)
    fu_tw_ac: number; // Transitional Water Acreage (AC)
    fu_alloc_af: number; // 2024 Allocation (AF)
    fu_carryover_af: number | string; // Carryover (AF) (can be a number or string)
    adjustment: number; // 2024 Adjustment (AF)
    fu_total_adjustment_af: number; // Total Allocation (AF)
    fu_etaw_af: number; // ETAW (AF)
    fu_remain_af: number; // Remaining (AF)
    "remaining_%": number; // Remaining Percentage (calculated)
    parcels:string[];
    parcel_table_info: ParcelData[];
  }

  export interface AccountDetails {
    account_id: string;
    account_name: string;
    mailing_address: string;
    start_date: string; // ISO date format (YYYY-MM-DD)
    end_date: string; // ISO date format (YYYY-MM-DD)
    msmt_method: string; // Measurement Method
    report_creation_date: string; // Date in DD-MM-YYYY format
    report_revision_date: string; // Placeholder for revision date (can be "-" or a date)
    farm_units: FarmUnit[];
    geojson_parcels: any;
    parcel_geometries: any;
    view_bounds: any;
    chart_data: any;
  }

export type dummyGroundWaterDataTypes={
    [key: string]: AccountDetails
}