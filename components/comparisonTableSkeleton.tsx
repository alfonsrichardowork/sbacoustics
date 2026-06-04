'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ComparisonTableSkeletonProps {
  productCount?: number;
  specRows?: number;
  showScrollButtons?: boolean;
}

export function ComparisonTableSkeleton({
  productCount = 4,
  specRows = 12,
  showScrollButtons = true,
}: ComparisonTableSkeletonProps) {
  return (
    <div className="md:whitespace-nowrap shadow-xl p-2 border rounded-md">
      {/* Pro Tip Banner Skeleton */}
      {/* {showScrollButtons && (
        <div className="sticky top-1/2 -translate-y-1/2 z-10">
          <div className="relative flex items-center w-full mx-auto">
            <div className="absolute -left-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="absolute -right-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      )} */}

      <div
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="space-x-4">
          <Table className="w-full">
            {/* Header with Product Images */}
            <TableHeader>
              <TableRow className="hover:bg-white w-full">
                {/* Pro Tip Column */}
                <TableHead className="w-48">
                  <div className="flex flex-col gap-2">
                    {/* <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                      <div className="w-24 h-4 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="w-32 h-3 rounded bg-muted animate-pulse" /> */}
                  </div>
                </TableHead>

                {/* Product Headers */}
                {Array.from({ length: productCount }).map((_, idx) => (
                  <TableHead key={idx} className="relative w-full text-center">
                    <div className="flex flex-col items-center justify-center w-full gap-3">
                      {/* Close Button Skeleton */}
                      {/* <div className="absolute top-2 right-2 w-5 h-5 bg-muted rounded animate-pulse" /> */}

                      {/* Product Image Skeleton */}
                      <div className="min-w-[200px] h-[200px] bg-muted rounded animate-pulse" />

                      {/* Product Name Skeleton */}
                      <div className="w-48 h-6 bg-muted rounded animate-pulse" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body with Specs */}
            <TableBody>
              {Array.from({ length: specRows }).map((_, rowIdx) => {
                const isGroupHeader = rowIdx % 4 === 0;

                if (isGroupHeader) {
                  // Category Header Row
                  return (
                    <TableRow key={`header-${rowIdx}`} className="border-y-2 border-foreground">
                      <TableCell
                        colSpan={productCount + 1}
                        className="bg-zinc-100"
                      >
                        <div className="flex gap-4">
                          <div className="w-40 h-5 bg-muted rounded animate-pulse" />
                          <div className="w-32 h-5 bg-muted rounded animate-pulse opacity-60" />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                // Spec Rows
                return (
                  <TableRow key={`row-${rowIdx}`}>
                    {/* Spec Name Cell */}
                    <TableCell className="w-48">
                      <div className="w-40 h-4 bg-muted rounded animate-pulse" />
                    </TableCell>

                    {/* Product Values */}
                    {Array.from({ length: productCount }).map((_, colIdx) => (
                      <TableCell
                        key={`cell-${rowIdx}-${colIdx}`}
                        className="text-sm text-center min-w-[250px] max-w-[400px]"
                      >
                        <div className="flex justify-center">
                          <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
