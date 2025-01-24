import { ColumnDef } from "@tanstack/react-table";

export type MapTableTypes<T> = {
    defaultData: T[];
    columns: ColumnDef<T>[];
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
