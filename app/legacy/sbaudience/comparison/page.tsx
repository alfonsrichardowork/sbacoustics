"use client"

import { SingleProducts } from '@/app/(frontend)/types';
import React, { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import getProductComparison from '@/app/(frontend)/actions/get-product-comparison';
import '@/app/legacy/(sbacoustics)/comparison/comparison.css'

function groupAllSpecifications(products: SingleProducts[]) {
  const grouped: Record<string, Record<string, Record<string, string>>> = {};

  products.forEach((product) => {
    product.specification.forEach((spec) => {
      const parent = spec.parentname ?? '';
      const sub = spec.subparentname ?? '';

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

function Icon({ name, size = 20 }: { name: "close" | "left" | "right" | "tip"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true }
  if (name === "close") return <svg {...common}><path d="M18 6 6 18M6 6l12 12" /></svg>
  if (name === "left") return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>
  if (name === "right") return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>
  return <svg {...common}><path d="m9.5 3 1.3 3.1L14 7.5l-3.2 1.4L9.5 12 8.2 8.9 5 7.5l3.2-1.4L9.5 3ZM17 13l.8 1.8L20 15.5l-2.2.7L17 18l-.8-1.8-2.2-.7 2.2-.7L17 13Z" /></svg>
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

        checkOverflow();

        const timer = window.setTimeout(checkOverflow, 100);

        window.addEventListener("resize", checkOverflow);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener("resize", checkOverflow);
        };
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
                const decodedSlugs = decodeURIComponent(localStorage.getItem("selectedComparisonLegacySBAudience") || '');
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
        localStorage.setItem("selectedComparisonLegacySBAudience", url);
        const index = finalFetchedProducts.findIndex((val) => val.slug === slug);
        if (index !== -1) {
            setFinalFetchedProducts(finalFetchedProducts.filter((_, i) => i !== index));
            // setFinalCustomSpecProducts(finalCustomSpecProducts.filter((_, i) => i !== index));
        }
        if(finalSlug.length === 1) {
            router.push('/sbaudience')
        }
    }
  if (loading) return <div className="comparison-loading">Loading...</div>


    return (
      
          <>
          
          <button className="comparison-close" onClick={() => router.back()} aria-label="Go back to previous page">
            <Icon name="close" size={30} />
          </button>
          <main className="comparison-page">
            <div className="comparison-shell">
              {hasOverflow && 
                <div className="comparison-arrows">
                  <button className="comparison-arrow comparison-arrow-left" onClick={scrollLeft20} aria-label="Scroll left">
                    <Icon name="left" size={18} />
                  </button>
                  <button className="comparison-arrow comparison-arrow-right" onClick={scrollRight20} aria-label="Scroll right">
                    <Icon name="right" size={18} />
                  </button>
                </div>
              }
              <div ref={scrollContainerRef} className={`comparison-scroll ${hasOverflow ? "is-grabbable" : ""}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="comparison-tip">
                        <div className={hasOverflow ? "" : "is-hidden"}>
                          <span>
                            <Icon name="tip" size={16} /> 
                            <strong>Pro Tip!</strong>
                          </span>
                          <small>
                            You can scroll left &amp; right!
                          </small>
                        </div>
                      </th>
                      {finalFetchedProducts.map((product) => 
                        <th key={product.name} className="product-header">
                          <button className="product-remove" onClick={() => deleteSlug(product.slug)} aria-label={`Remove ${product.name}`}>
                            <Icon name="close" size={20} />
                          </button>
                          <img src={product.coverImg.startsWith("/uploads/") ? `${process.env.NEXT_PUBLIC_ROOT_URL}${product.coverImg}` : product.coverImg} alt={product.name} width={100} height={100} className="product-image" />
                          <div className="product-name">
                            {product.name}
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(allSpecsUsed).map(([parentKey, subRecord]) => parentKey !== "Additional Notes" && Object.entries(subRecord).map(([subKey, childRecord]) => 
                      <React.Fragment key={`${parentKey}-${subKey}`}>
                        <tr className="spec-section">
                          <td colSpan={finalFetchedProducts.length + 1}>
                            {parentKey}{subKey && <> - <span>{subKey}</span></>}
                          </td>
                        </tr>
                        {Object.keys(childRecord).map((childKey) => 
                          <tr key={`${parentKey}-${subKey}-${childKey}`}>
                            <td className="spec-name">
                              {childKey}
                            </td>
                            {finalFetchedProducts.map((product) => { const found = product.specification.find((spec) => spec.parentname === parentKey && spec.subparentname === subKey && spec.child.some((item) => item.childname === childKey)); const matched = found?.child.find((item) => item.childname === childKey); const value = matched?.value ?? "-"; return (
                              <td key={`${product.id}-${childKey}`} className="spec-value">
                                {value !== "-" ? `${value} ${matched?.unit ?? ""}` : value}
                              </td> 
                            )})}
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="comparison-actions">
              <button className="add-products-button" onClick={() => router.push(`/legacy/sbaudience/drivers`)}>
                Add More Products
              </button>
            </div>
          </main>
          </>
    );
}

export default ComparisonPageSBAudience;
