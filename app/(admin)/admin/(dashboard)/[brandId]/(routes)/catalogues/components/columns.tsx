"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CataloguesColumn = {
  id: string
  name: string;
  image: string;
  pdf: string
  updatedAt: string;
  updatedBy: string;
}

export const columns: ColumnDef<CataloguesColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "image",
    header: "Catalogue Image",
  },
  {
    accessorKey: "pdf",
    header: "Catalogue PDF",
  },
  {
    accessorKey: "updatedAt",
    header: "updated At",
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
