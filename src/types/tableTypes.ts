import { ColumnDef } from "@tanstack/react-table";

export type MapTableTypes<T> = {
    defaultData: T[];
    columns: ColumnDef<T>[];
    doFilter: Boolean;
    filterValue: String;
    setPosition?: null | Function;
    setZoomLevel?: null | Function;
    setClickedField?: null | Function;
    clickedField?: null | string;
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
  }