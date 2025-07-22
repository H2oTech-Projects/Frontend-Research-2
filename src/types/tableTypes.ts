import { ColumnDef } from "@tanstack/react-table";

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
    doFilter?: Boolean;
    filterValue?: String;
    setPosition?: null | Function;
    setZoomLevel?: null | Function;
    setClickedField?: null | Function;
    clickedField?: null | any;
    fullHeight?: boolean;
    showPagination?: boolean;
    textAlign?: "left" | "center" | "right";
    columnProperties?: any | null;
    tableCSSConfig?: tableCSSConfig | null;
    tableType?: string | null;
    setSelectedFarm?: null | Function;
    setSelectedParcel?: null | Function;
    isLoading?: boolean;
    tableInfo?: initialTableDataTypes;
    setTableInfo?: Function;
    totalData?: number | undefined;
    collapse?: string;
    useClientPagination?: boolean;
    customHeight?: string;
};
export type DummyDataType = {
    id:number;
    district?: string;
    fieldId?: string;
    fieldFieldId?: string;
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
    parcel_table_info: ParcelData[];
  }

export type dummyGroundWaterDataTypes={
    [key: string]: AccountDetails
}
  export interface AccountDetails2 {
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
    parcel_table_info: ParcelData[];
  }

export type dummyGroundWaterDataTypes2={
    [key: string]: AccountDetails2
}
export interface initialTableDataTypes {
  search:string | undefined ;
  page_no:number,
  page_size:number,
  sort: string | undefined,
  sort_order: string | undefined
}

export type ClientTableDataTypes = {
  id:string
  client_id: string;
  client_name: string;
  client_ha: number;
  client_country: string;
  client_admin_area: string;
  client_subadmin_area: string;
  client_locality: string;
  client_postal_code: string;
  client_po_box: string;
  client_street: string;
  client_premise: string;
  client_subpremise: string;
  client_email: string;
  client_established: string; // or Date if parsed
  client_fax: string;
  client_phone: string;
  client_website: string;
  client_geom: {
    type: "MultiPolygon";
    coordinates: any;
  };
};

export type MsmtPointDataType = {
  canal?: string;
  msmtPointId?: string;
  msmtPointName?: string;
};
export type WaterAccountingPeriodTypes = {
  id:string
  wa_period_type: string;
  wa_period_type_name: string;
  client_name: string;
};

export type WaterAccountingYearTypes = {
  id:string
  wa_start_date: string;
  wa_end_date: string;
  wa_year: string;
};