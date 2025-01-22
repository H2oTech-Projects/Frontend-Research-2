import React, { CSSProperties, useEffect } from 'react'
import $ from 'jquery';
import './index.css'

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { makeData, Person, FieldData, tableData, tableColumns } from './makeData'
import { faker } from '@faker-js/faker'

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
let leftColumnsCalculate = {}
const getCommonPinningStyles = (column: Column<Person>, left: {}, right: {}): CSSProperties => {
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
    left: isPinned === 'left' ? `${left[column.id]}px` : undefined,
    right: isPinned === 'right' ? `${right[column.id]}px` : undefined,
    opacity: isPinned ? 1 : 1,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
    borderBottom: '.5px solid rgb(148 163 184)'
  }
}

const defaultColumns: ColumnDef<FieldData>[] = tableColumns.map(column => {
  return {
    accessorKey: column,
    id: column,
    header: column,
    //header: () => <span>Last Name</span>,
    cell: info => info.getValue(),
  }
});
function TanSackTable() {
  const [data, setData] = React.useState(tableData)
  const [columns] = React.useState(() => [...defaultColumns])
  const [reCalLeft, setReCalLeft] = React.useState(false);
  const [left, setLeft] = React.useState({})
  const [right, setRight] = React.useState({})
  //const rerender = () => setData(() => makeData(30))

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: 'onChange',
  })

  useEffect(() => {
    let leftPin = 0;
    let rightPin = 0;
    let rightPinnedColumns: any[] = [];
    let columnLeftMapper = {};
    let columnRightMapper = {};
    table.getHeaderGroups()[0].headers.map(header =>{
      const { column } = header
      if (column.getIsPinned() == 'left') {
        columnLeftMapper[column.id] = leftPin;
        leftPin = leftPin + $(`.${column.id}`).innerWidth();
      }
      if (column.getIsPinned() == 'right') {
        rightPinnedColumns.push(column)
      }
    })
    rightPinnedColumns.reverse().forEach(column => {
      columnRightMapper[column.id] = rightPin;
      rightPin = rightPin + $(`.${column.id}`).innerWidth();
    });
    console.log('lkjasdflkj')
    console.log(columnRightMapper)
    setLeft(columnLeftMapper)
    setRight(columnRightMapper)
}, [reCalLeft]);

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map(d => d.id))
    )
  }

  return (
    <div>
      <div className="table-container">
        <table
          className="w-full"
        >
          <thead className="sticky top-0 z-[100]">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const { column } = header

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      //IMPORTANT: This is where the magic happens!
                      style={{ ...getCommonPinningStyles(column, left, right), top: '0px', paddingRight: '20px', paddingLeft: '20px' }}
                      className={`top-1 ${column.id} bg-[#16599A] text-white`}
                    >
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}{' '}
                        {/* Demo getIndex behavior */}
                        {/* {column.getIndex(column.getIsPinned() || 'center')} */}
                      </div>
                      {!header.isPlaceholder && header.column.getCanPin() && (
                        <div className="flex gap-1 justify-center">
                          {header.column.getIsPinned() !== 'left' ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin('left')
                                setReCalLeft(!reCalLeft)
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
                                setReCalLeft(!reCalLeft)
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
                                setReCalLeft(!reCalLeft)
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
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const { column } = cell
                  return (
                    <td
                      key={cell.id}
                      //IMPORTANT: This is where the magic happens!
                      style={{ ...getCommonPinningStyles(column, left, right) }}
                      className="truncate ... text-center p-6"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default TanSackTable;