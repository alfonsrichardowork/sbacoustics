'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Lightbulb, X } from 'lucide-react';

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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = React.useState(false);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setHasOverflow(container.scrollWidth > container.clientWidth);
    }
  }, []);

  const scrollLeft20 = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight20 = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Button 
        variant="ghost"
        className='absolute top-28 xl:right-16 lg:right-12 right-8 text-primary opacity-70 hover:opacity-100 text-right hover:cursor-pointer hover:bg-transparent'
        aria-label="Go back to previous page"
        disabled
      >
        <X width={30} height={30} />
      </Button>

      <div className="md:whitespace-nowrap shadow-xl p-2 border rounded-md">
        <div className={`sticky top-1/2 -translate-y-1/2 z-10 ${!hasOverflow && 'hidden'}`}>
          <div className="relative flex items-center w-full mx-auto">
            <div className="absolute -left-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full shadow-lg bg-background" 
                onClick={scrollLeft20}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute -right-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg bg-background"
                onClick={scrollRight20}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="inline-flex">
            <Table className="w-max ">
              {/* Header with Product Images */}
              <TableHeader>
                <TableRow className="hover:bg-white w-full">
                  {/* Pro Tip Column */}
                  <TableHead className='md:w-full w-12'>
                    {/* <div className={`${!hasOverflow && "hidden"}`}>
                      <div className="flex items-center gap-1 text-primary">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <div className="font-bold md:text-base text-xs">Pro Tip!</div>
                      </div>
                      <div className='md:text-base text-xs'>You can scroll left & right!</div>
                    </div> */}
                  </TableHead>

                  {/* Product Headers */}
                  {Array.from({ length: productCount }).map((_, idx) => (
                    <TableHead key={idx} className="relative w-fit text-center align-top md:px-0 px-1 md:max-w-full max-w-[120px]">
                      <div className="flex flex-col items-center justify-center w-full gap-4">
                        <div className="relative">
                          <Skeleton className="md:min-w-[200px] min-w-[100px] md:max-w-[400px] max-w-[200px] h-[100px] md:h-[200px]" />
                          {/* <X
                            width={20}
                            height={20}
                            className="absolute top-2 right-2 text-primary opacity-70"
                          /> */}
                        </div>
                        <Skeleton className="w-48 h-6 md:h-8" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: specRows }).map((_, rowIdx) => {
                  const isGroupHeader = rowIdx % 4 === 0;

                  if (isGroupHeader) {
                    return (
                      <TableRow key={`header-${rowIdx}`} className="border-y-2 border-foreground">
                        <TableCell
                          colSpan={productCount + 1}
                          className="bg-zinc-100"
                        >
                          <div className="flex gap-4">
                            <Skeleton className="w-40 h-5" />
                            <Skeleton className="w-32 h-5 opacity-60" />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return (
                    <TableRow key={`row-${rowIdx}`}>
                      <TableCell className="font-medium md:text-base text-xs">
                        <Skeleton className="w-40 h-4" />
                      </TableCell>

                      {Array.from({ length: productCount }).map((_, colIdx) => (
                        <TableCell
                          key={`cell-${rowIdx}-${colIdx}`}
                          className="md:text-sm text-xs text-foreground text-center md:min-w-[250px] w-24 min-w-[100px] md:max-w-[400px] max-w-[200px] break-all whitespace-normal px-2"
                        >
                          <div className="flex justify-center">
                            <Skeleton className="w-24 h-4" />
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

      <div className="pt-6 flex justify-center">
        <Skeleton className="h-10 w-48" />
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
