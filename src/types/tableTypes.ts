import { ColumnDef } from "@tanstack/react-table";

export type MapTableTypes<T> = {
    defaultData: T[];
    columns: ColumnDef<T>[];
    setPosition?: null | Function;
};
