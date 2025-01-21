import { useState, useEffect, CSSProperties } from "react";
import {
  Column,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
interface ColumnFilter {
  id: string
  value: unknown
}
type ColumnFiltersState = ColumnFilter[]

//column pinning
export type ColumnPinningPosition = false | 'left' | 'right'

export type ColumnPinningState = {
  left?: string[]
  right?: string[]
}

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn RelationshipIn Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', {
    id: 'firstName',
    cell: info => info.getValue(),
    footer: info => info.column.id,
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: false,
    enablePinning: true,
  }),
  columnHelper.accessor(row => row.lastName, {
    id: 'lastName',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: () => 'Age',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: () => <span>Visits</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
    footer: info => info.column.id,
  }),
]

const getCommonPinningStyles = (column: Column<Person>): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    transform: isPinned ? 'rotate(0deg)' : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 2 : 0,
  }
}

const TanSackTable = () => {
  const [data, _setData] = useState(() => [...defaultData])
  // const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  //   left: ['age','status'],
  //   right: [],
  // });
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [columnVisibility, setColumnVisibility] = useState({
    firstName: true,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // state: {
    //   columnFilters:[
    //     {
    //       id: 'firstName',
    //       value: 'tandy', // filter the name column by 'John' by default
    //     },
    //   ],
    // },
    state:{
      columnPinning,
      columnVisibility,// handles column visibility
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnPinningChange: setColumnPinning,
  })

  return (
    <div className="inline-block">
    <table className="w-full h-full highlight">
        <thead className="sticky top-0 border border-solid border-surface-light-50 bg-[#d8c2c2] px-6 py-3 text-left text-xs font-semibold uppercase z-[3] h-[30px]">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              const { column } = header

              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  //IMPORTANT: This is where the magic happens!
                  style={{ ...getCommonPinningStyles(column) }}
                >
                  <div className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}{' '}
                    {/* Demo getIndex behavior */}
                    {column.getIndex(column.getIsPinned() || 'center')}
                  </div>
                  {!header.isPlaceholder && header.column.getCanPin() && (
                    <div className="flex gap-1 justify-center">
                      {header.column.getIsPinned() !== 'left' ? (
                        <button
                          className="border rounded px-2"
                          onClick={() => {
                            header.column.pin('left')
                          }}
                        >
                          {'<='}
                        </button>
                      ) : null}
                      {header.column.getIsPinned() ? (
                        <button
                          className="border rounded px-2"
                          onClick={() => {
                            header.column.pin(false)
                          }}
                        >
                          X
                        </button>
                      ) : null}
                      {header.column.getIsPinned() !== 'right' ? (
                        <button
                          className="border rounded px-2"
                          onClick={() => {
                            header.column.pin('right')
                          }}
                        >
                          {'=>'}
                        </button>
                      ) : null}
                    </div>
                  )}
                  <div
                    {...{
                      onDoubleClick: () => header.column.resetSize(),
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`,
                    }}
                  />
                </th>
              )
            })}
          </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="relative h-14 cursor-pointer">
              {row.getVisibleCells().map(cell => {
                const { column } = cell
                return (<td key={cell.id} style={{ ...getCommonPinningStyles(column) }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>)
              })}
            </tr>
          ))}
        </tbody>
        {/* <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
      </div>
  )
};

export default TanSackTable;