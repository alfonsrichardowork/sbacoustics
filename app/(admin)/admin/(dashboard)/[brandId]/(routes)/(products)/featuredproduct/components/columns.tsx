"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type FeaturedProductColumn = {
  id: string
  name: string;
  value: string;
  updatedAt: string;
  updatedBy: string;
}

export const columns: ColumnDef<FeaturedProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "preview featured",
    header: "Preview Featured",
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
