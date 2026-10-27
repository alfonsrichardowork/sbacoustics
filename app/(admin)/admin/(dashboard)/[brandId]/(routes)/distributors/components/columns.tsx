"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type DistributorsColumn = {
  id: string
  name: string;
  updatedBy: string;
  updatedAt: string;
}

export const columns: ColumnDef<DistributorsColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    accessorKey: "updatedBy",
    header: "Updated By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
