import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Session } from "@/types/session.type";
import LongText from "@/components/long-text";
import { TableColumnHeader } from "@/components/table/table-column-header";
import { TableRowActions } from "./sessions-table-row-actions";

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue("name")}</LongText>
    ),
  },
  {
    accessorKey: "nicCardNum",
    header: ({ column }) => <TableColumnHeader column={column} title='NIC' />,
    cell: ({ row }) => <div>{row.getValue("nicCardNum")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue("address")}</LongText>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <TableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("createdAt")), "dd-MMM-yyyy")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title='Updated At' />
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("updatedAt")), "dd-MMM-yyyy")}</div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: TableRowActions,
  },
];
