import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { AccountDetailType } from '@/types/apiResponseType';
import Spinner from '../Spinner';

interface AccountDetailTableProps {
  accountDetailLoading: boolean;
  accountDetail: AccountDetailType;
}

const AccountDetailTable = ({ accountDetailLoading, accountDetail }: AccountDetailTableProps) => {
  if (accountDetailLoading)
    return <Table>
      <TableHeader >
        <TableRow >
          <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none text-left w-64">Description</TableHead>
          <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none text-left">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={2}
            className="h-auto text-center"
          >
          <Spinner/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  return (
    <Table>
      <TableHeader >
        <TableRow >
          <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none text-left w-64">Description</TableHead>
          <TableHead className="bg-royalBlue !text-slate-50 hover:bg-none text-left">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="!text-left">
            Account ID:
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.account_id}
          </TableCell>
        </TableRow>

        <TableRow >
          <TableCell className="!text-left">
            Account Name:
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.account_name}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="!text-left">
            Mailing Address:
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.mailing_address}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="!text-left w-auto">
            Start Date (YYYY-MM-DD):
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.start_date}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="!text-left w-auto">
            End Date (YYYY-MM-DD):
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.end_date}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="!text-left">
            Measurement Method:
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.msmt_method}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="!text-left">
            Report Creation Date:
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.report_creation_date}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="!text-left">
            Report Revision Date:
          </TableCell>
          <TableCell className="!text-left">
            {accountDetail?.report_revision_date}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default React.memo(AccountDetailTable)
