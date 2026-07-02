"use client"

import { SingleProducts } from '@/app/(frontend)/types';
import Image from 'next/image';
import React, { useEffect, useState, use, useRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { ArrowLeft, ArrowRight, Lightbulb, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import getProductComparison from '../../actions/get-product-comparison';
import Link from 'next/link';
import { ComparisonTableSkeleton } from '@/components/comparisonTableSkeleton';

function groupAllSpecifications(products: SingleProducts[]) {
  const grouped: Record<string, Record<string, Record<string, string>>> = {};

  products.forEach((product) => {
    product.specification.forEach((spec) => {
      const parent = spec.parentname;
      const sub = spec.subparentname || "";

      if (!grouped[parent]) grouped[parent] = {};
      if (!grouped[parent][sub]) grouped[parent][sub] = {};

      spec.child.map((child) => {
        if (grouped[parent] && grouped[parent][sub] &&!grouped[parent][sub][child.childname]) {
          grouped[parent][sub][child.childname] = child.childname;
        }
      });
    });
  });

  return grouped;
}

const ComparisonPageSBAudience = () => {
    const router = useRouter();
    const [finalFetchedProducts, setFinalFetchedProducts] = useState<SingleProducts[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [finalSlug, setFinalSlug] = useState<string[]>([])

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    
    const [hasOverflow, setHasOverflow] = useState(false);
    const [allSpecsUsed, setAllSpecsUsed] = useState<Record<string, Record<string, Record<string, string>>>>({});

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const checkOverflow = () => {
            setHasOverflow(el.scrollWidth > el.clientWidth);
        };

        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(el);

        // Run once immediately
        checkOverflow();

        return () => resizeObserver.disconnect();
    }, [finalFetchedProducts, loading]);

    // Handle mouse down event to start dragging
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!scrollContainerRef.current) return
  
      setIsDragging(true)
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
      setScrollLeft(scrollContainerRef.current.scrollLeft)
      if (hasOverflow) { scrollContainerRef.current.style.cursor = "grabbing" }
    }
  
    // Handle mouse move event while dragging
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return
  
      const x = e.pageX - scrollContainerRef.current.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed multiplier
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }
  
    // Handle mouse up event to stop dragging
    const handleMouseUp = () => {
      setIsDragging(false)
      if (scrollContainerRef.current) {
        if (hasOverflow) { scrollContainerRef.current.style.cursor = "grab" }
      }
    }
  
    // Handle mouse leave event to stop dragging
    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false)
        if (scrollContainerRef.current) {
          if (hasOverflow) { scrollContainerRef.current.style.cursor = "grab" }
        }
      }
    }
  
    const scrollLeft20 = () => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const maxScrollLeft = container.scrollLeft; // Current left scroll position
          const scrollAmount = Math.min(300, maxScrollLeft); // Scroll only available amount
          container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      };
      
      const scrollRight20 = () => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const maxScrollRight = container.scrollWidth - container.clientWidth - container.scrollLeft; 
          const scrollAmount = Math.min(300, maxScrollRight); // Scroll only available amount
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      };
  

    useEffect(() => {
        const fetchData = async () => {
            try {                
                let fetchedProducts: SingleProducts[] = []
                const decodedSlugs = decodeURIComponent(localStorage.getItem("selectedComparisonSBAudience") || '');
                const slugArray = decodedSlugs.split(',');
                slugArray.pop()
                setFinalSlug(slugArray)
                await Promise.all(
                    slugArray.map(async (value) => {
                        let temp: SingleProducts = await getProductComparison("sbaudience", value);
                        fetchedProducts.push(temp);
                    })
                );
                setFinalFetchedProducts(fetchedProducts)
                setAllSpecsUsed(groupAllSpecifications(fetchedProducts))
                setLoading(false)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData()
    }, []);

    function deleteSlug(slug: string) {
        let tempslug = finalSlug.filter((val) => val !== slug) 
        setFinalSlug(tempslug)
        let url = tempslug.map((value) => value).join(',') + ",";
        if(url === ","){
            url = ""
        }
        localStorage.setItem("selectedComparisonSBAudience", url);
        const index = finalFetchedProducts.findIndex((val) => val.slug === slug);
        if (index !== -1) {
            setFinalFetchedProducts(finalFetchedProducts.filter((_, i) => i !== index));
            // setFinalCustomSpecProducts(finalCustomSpecProducts.filter((_, i) => i !== index));
        }
        if(finalSlug.length === 1) {
            router.push('/sbaudience')
        }
    }


    return (
        <div className="xl:px-16 lg:px-12 pt-14 pb-6 px-8">
        {loading ? 
            
          <ComparisonTableSkeleton productCount={4} specRows={12} />
          :
          <>
            <Button 
              onClick={() => router.back()}
              variant="ghost"
              className='absolute top-28 xl:right-16 lg:right-12 right-8 text-primary opacity-70 hover:opacity-100 text-right hover:cursor-pointer hover:bg-transparent'
              aria-label="Go back to previous page"
            >
              <X width={30} height={30} />
            </Button>

            
        <div className="md:whitespace-nowrap shadow-xl p-2 border border-black/10 rounded-md ">
            <div className={`sticky top-1/2 -translate-y-1/2 z-10 ${!hasOverflow && 'hidden'}`}>
            <div className="relative flex items-center w-full mx-auto">

                    <div className="absolute -left-4">
                        <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-background" onClick={scrollLeft20}>
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
          className={`flex overflow-x-auto ${hasOverflow && 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="inline-flex">
            <Table className="w-max">
              <TableHeader>
                  <TableRow className='hover:bg-transparent w-full'>
                      <TableHead className='md:w-full w-12'>
                        <div className={`${!hasOverflow && 'hidden'}`}>
                            <div className='flex items-center gap-1 text-primary'>
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                <div className="font-bold md:text-base text-xs">Pro Tip!</div>
                            </div>
                            <div className='text-foreground md:text-base text-xs'>
                                You can scroll left & right!
                            </div>
                        </div>
                      </TableHead>
                      {finalFetchedProducts.map((product) => (
                        <TableHead key={product.name} 
                          className="relative w-fit text-center align-top md:px-0 px-1 md:max-w-full max-w-[120px]">
                          <div className="flex flex-col items-center justify-center w-full">
                          <X 
                            width={20} 
                            height={20} 
                            className="absolute top-2 right-2 text-primary opacity-70 hover:opacity-100 hover:cursor-pointer"
                            onClick={() => deleteSlug(product.slug)}
                          />
                          <Image 
                              src={product.coverImg.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${product.coverImg}` : product.coverImg} 
                              alt={product.name} 
                              width={100} 
                              height={100} 
                              className="
                                md:min-w-[200px]
                                min-w-[100px]
                                md:max-w-[400px]
                                max-w-[200px]
                                h-fit
                                mx-auto
                                object-contain
                                block
                              "
                          />
                          <div className="md:font-bold md:text-lg font-semibold text-xs text-center max-w-52 break-words whitespace-normal w-full">
                            {product.name}
                          </div>
                          </div>
                      </TableHead>
                      ))}
                  </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(allSpecsUsed).map(([parentKey, subRecord]) =>
                  parentKey !== "Additional Notes" &&
                    Object.entries(subRecord).map(([subKey, childRecord]) => (
                    <React.Fragment key={`${parentKey}-${subKey}`}>
                        {/* Parent/Sub header row */}
                        <TableRow className="border-y-2 border-foreground">
                        <TableCell
                            colSpan={finalFetchedProducts.length + 1}
                            className="font-bold md:text-lg text-sm bg-foreground text-background"
                        >
                            {parentKey}
                            {subKey !== "" && (
                            <> - <span className="font-semibold md:text-base text-xs">{subKey}</span></>
                            )}
                        </TableCell>
                        </TableRow>
    
                        {/* Child spec rows */}
                        {Object.entries(childRecord).map(([childKey, _]) => (
                        <TableRow key={`${parentKey}-${subKey}-${childKey}`}>
                            {/* Spec name cell */}
                            <TableCell className="font-medium md:text-base text-xs">{parentKey !== 'Additional Notes' && childKey}</TableCell>
    
                            {/* Each product value */}
                            {finalFetchedProducts.map((product) => {
                            const foundChild = product.specification.find(
                                (spec) =>
                                spec.parentname === parentKey &&
                                spec.subparentname === subKey &&
                                spec.child.some(
                                    (subval) => subval.childname === childKey
                                )
                            );
    
                            const matchedChild = foundChild?.child.find(
                                (subval) => subval.childname === childKey
                            );
    
                            const value = matchedChild?.value ?? "-";
                            const unit = matchedChild?.unit ?? "";
    
                            return (
                                <TableCell
                                key={`${product.id}-${childKey}`}
                                className="md:text-sm text-xs text-foreground text-center md:min-w-[250px] w-24 min-w-[100px] md:max-w-[400px] max-w-[200px] break-all whitespace-normal px-2"
                                >
                                {value !== "-" ? `${value} ${unit}` : value}
                                </TableCell>
                            );
                            })}
                        </TableRow>
                        ))}
                    </React.Fragment>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>



             <div className="pt-6 flex justify-center">
                <Button className="flex items-center md:text-base text-xs" onClick={() => router.push(`/sbaudience/drivers`)}>Add More Products</Button>
            </div>
        </>
        }
        </div>
    );
}

export default ComparisonPageSBAudience;
