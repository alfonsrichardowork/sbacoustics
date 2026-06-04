"use client"

import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/admin/components/ui/table"
import { Button } from "@/app/(admin)/admin/components/ui/button"
import { Input } from "@/app/(admin)/admin/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/(admin)/admin/components/ui/avatar"
import Image from "next/image"
import { Ban, FileQuestion } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  searchKey: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    }
  });

  const indexPreview = columns.findIndex(item => item.header === 'Preview');

  const indexPreviewFeatured = columns.findIndex(item => item.header === 'Preview Featured');
  
  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by Name"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-background"
        />
      </div>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, indexcol) => (
                    indexcol === indexPreview ? (
                      /* @ts-ignore */<TableCell key={cell.id}><div style={{ display: 'flex' }}> 
                        {data[Number(row.id)].productImageUrl[0]!=''?<Image src={data[Number(row.id)].productImageUrl[0].startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data[Number(row.id)].productImageUrl[0]}` : data[Number(row.id)].productImageUrl[0]} alt={data[Number(row.id)].name} width={200} height={200} className="w-56 h-fit"/>:<FileQuestion size={30}/>}
                      </div>
                      </TableCell>
                    ) : indexcol === indexPreviewFeatured ? (
                      /* @ts-ignore */<TableCell key={cell.id}><div style={{ display: 'flex' }}>
                        {data[Number(row.id)].value!=''?<Image src={data[Number(row.id)].value.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data[Number(row.id)].value}` : data[Number(row.id)].value} alt={data[Number(row.id)].name} width={200} height={200} className="w-3/4 h-fit"/>:<FileQuestion size={30}/>}
                      </div>
                      </TableCell>
                    ) : (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  ))}
                </TableRow>
              ))  
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
