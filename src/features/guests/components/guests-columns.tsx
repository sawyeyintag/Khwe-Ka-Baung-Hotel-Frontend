import { ColumnDef } from "@tanstack/react-table";
import LongText from "@/components/long-text";
import { Guest } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue("name")}</LongText>
    ),
  },
  {
    accessorKey: "nicCardNum",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NIC' />
    ),
    cell: ({ row }) => <div>{row.getValue("nicCardNum")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue("address")}</LongText>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue("email")}</div>
    ),
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
