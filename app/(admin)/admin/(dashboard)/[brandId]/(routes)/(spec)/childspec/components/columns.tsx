"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ChildSpecColumn = {
  id: string
  name: string;
  updatedAt: string;
  updatedBy: string;
}

export const columns: ColumnDef<ChildSpecColumn>[] = [
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
