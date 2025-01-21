import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapTableTypes } from "@/types/tableTypes";
import { useState } from "react";

const MapTable = <T,>({ defaultData, columns, setPosition = null }: MapTableTypes<T>) => {
    const [data, _setDate] = useState([...defaultData]);
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead
                                // this class code help to differentiate action column
                                className={`${
                                    // @ts-ignore  this code helps to ignore types in certain line
                                    header.column.columnDef.meta?.className ?? ""
                                } `}
                                key={header.id}
                            >
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) =>
                        // @ts-ignore it is to check whether there is center property in Data element object
                        setPosition !== null && row?.original?.center ? (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer hover:bg-slate-500"
                            >
                                {row.getVisibleCells().map((cell) =>
                                    // @ts-ignore  Below condition check is to determine where rows are from action column or not
                                    cell.column.columnDef.meta?.className ? (
                                        <TableCell
                                            className={`${
                                                // @ts-ignore
                                                cell.column.columnDef.meta?.className ?? ""
                                            } `}
                                            key={cell.id}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ) : (
                                        <TableCell // this TableCell is not from Action column
                                            // @ts-ignore
                                            onClick={() => setPosition(row?.original?.center)} //  we added this on click event to set center in map
                                            key={cell.id}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ),
                                )}
                            </TableRow>
                        ) : (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        className={`${
                                            // @ts-ignore
                                            cell.column.columnDef.meta?.className ?? ""
                                        } `}
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ),
                    )
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default MapTable;
