'use client';

import { useState, useRef, useEffect, FC } from 'react';
import { Searchbox } from '@/app/(frontend)/types';
import { usePathname } from 'next/navigation';
import getProductsForSearchbox from '@/app/(frontend)/actions/get-product-for-searchbox';
import Fuse from 'fuse.js';
function normalizeFractions(text: string): string {
  return text
    // normalize Unicode fractions
    .replace(/½/g, "1/2")
    // normalize common patterns (6 1/2, 6-1/2 → 6.5)
    .replace(/(\d+)\s*[- ]?\s*1\/2/g, (_, num) => `${num}.5`);
}

function normalizeSearch(text: string) {
  return normalizeFractions(
    text
      .replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch")
      .replace(/[-\s]+/g, " ") // ← dash and spaces become the same
      .trim()
      .toLowerCase()
  );
}

type PropType = {
  changeBrand: boolean
}
interface ExtendedSearchbox extends Searchbox {
  namenospace: string[];
  // sizenospace: string;
}

const SearchLightboxOld: FC<PropType> = (props) => {
  const { changeBrand } = props
  const [isOpen, setIsOpen] = useState(false);
    const [finalProductSearchbox, setFinalProductSearchbox] = useState<ExtendedSearchbox[]>([]);
  const [activeSearch, setActiveSearch] = useState('');
  const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipBlurRef = useRef(false);
    const pathname = usePathname()
   
    useEffect(() => {
      const fetchData = async () => {
          try {
              const data : Searchbox[] = await getProductsForSearchbox(pathname);
              data.sort((a, b) => (a.size[0] || "").localeCompare(b.size[0] || ""))
              const extendedData: ExtendedSearchbox[] = data.map((val) => ({
                ...val,
                namenospace: val.size.map((oneSize) => `${oneSize}${val.name}`.replace(/\s+/g, '')),
                // sizenospace: `${val.size[0]}inch`
              }));
              setFinalProductSearchbox(extendedData);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData();
    }, [pathname, changeBrand]);
    const fuse = new Fuse(finalProductSearchbox, {
        keys: [
          { name: "label", weight: 1.0 },
          { name: "slug", weight: 0.8 },
          { name: "namenospace", weight: 0.4 },
          // { name: "sizenospace", weight: 1.0 },
          { name: "info", weight: 0.3 },
          { name: "size", weight: 0.9 },
          { name: "cat", weight: 0.4 },
          { name: "subcat", weight: 0.3 },
          { name: "subsubcat", weight: 0.3 },
          { name: "productInKits", weight: 0.2 },
        ],
        threshold: 0.1,        
        minMatchCharLength: 1,  
        ignoreLocation: false,   
        includeScore: true,     
        useExtendedSearch: true
    });
  // Focus input when lightbox opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

      function searchData(val: string) {
        let select: Searchbox[] = [];
        let selectOEM: Searchbox[] = [];
  
        // Normalize quotes and lowercase
        let updatedVal = val.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch").trimStart().toLowerCase();
        updatedVal = normalizeSearch(updatedVal)
  
        const results = updatedVal
            ? fuse.search(updatedVal).map((res) => res.item)
            : finalProductSearchbox;
  
        results.forEach((value) => {
            if (value.subcat.some((val) => val.toLowerCase().includes("oem"))) {
                selectOEM.push(value);
            } else {
                select.push(value);
            }
        });
  
        const sortFn = (a: Searchbox, b: Searchbox) => {
            const numA = parseInt(a.label.match(/^\d+/)?.[0] || "100", 10);
            const numB = parseInt(b.label.match(/^\d+/)?.[0] || "100", 10);
  
            if (numA !== numB) {
                return numA - numB;
            }
  
            return a.label.localeCompare(b.label);
        };
  
        select.sort(sortFn);
        selectOEM.sort(sortFn);
        const allFound = [...select, ...selectOEM]
        setfoundProducts(allFound);
        const value = allFound.map((item) => item.slug).join(",") + ","
        if(pathname.includes("sbaudience")){ 
          document.cookie = `allDriversProductsSBAudience=${encodeURIComponent(value)}; path=/; max-age=86400`
        }
        else{
          document.cookie = `allDriversProducts=${encodeURIComponent(value)}; path=/; max-age=86400`
        }
      }
  
    // Adding event listeners on mount and cleaning up on unmount
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // const value = finalProductSearchbox.map(item => item.slug).join(',') + ',';
          // document.cookie = `allDriversProducts=${encodeURIComponent(value)}; path=/; max-age=86400`;
          if(pathname.includes("sbaudience")) {
            document.cookie = `allDriversProductsSBAudience=; path=/; max-age=86400`;
          }
          else{
            document.cookie = `allDriversProducts=; path=/; max-age=86400`;
          }
          setActiveSearch('')
          inputRef.current?.blur(); // Remove focus from input
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [finalProductSearchbox]);

  const handleProductClick = (slug: string) => {
    setActiveSearch('');
    setIsOpen(false);
    if(pathname.includes('sbaudience')){
      window.location.href = `/sbaudience/products/${slug}`;
    }
    else{
      window.location.href = `/products/${slug}`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && activeSearch.trim() !== '') {
      skipBlurRef.current = true;
      setIsOpen(false);
      setActiveSearch('');
      inputRef.current?.blur();
      // Replace with your actual search page navigation
      window.location.href = '/search';
    }
  };

  const handleMouseDown = () => {
    skipBlurRef.current = true;
  };

  const handleBlur = () => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false;
      return;
    }
    setActiveSearch('');
    setfoundProducts([]);
  };

  return (
    <>
      {/* Search Button */}
      <div>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '100%',
            height: '39px',
            paddingInline: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '8px',
            backgroundColor: '#e4e4e7',
            color: 'hsl(var(--muted-foreground))',
            borderColor: 'color-mix(in oklab, var(--color-border) /* hsl(var(--border)) */ 60%, transparent)'
          }}
          aria-label="Search products"
        >
          <span style={{
            fontSize: '14px',
            lineHeight: '1.43',
          }}>
            Search...
          </span>
        </button>
      </div>

      {/* Lightbox Overlay */}
      {isOpen && (
        <>
        <div
          style={{
            position: 'fixed',
            inset: '0px',
            zIndex: 999,
            backgroundColor: 'color-mix(in oklab, var(--color-black) /* #000000 */ 50%, transparent)',
          }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        
        <div style={{
          position: 'fixed',
          inset: '0px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '6vh',
          pointerEvents: 'none'
        }}>
          <div
            style={{
              width: '100%',
              maxWidth: '672px',
              marginInline: '16px',
              pointerEvents: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Container */}
            <div style={{
              backgroundColor: 'hsl(var(--background))',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(24, 24, 27, 0.18)',
              borderWidth: '1px',
              borderColor: 'hsl(var(--border))',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '60vh'
            }}>
              {/* Header with Close Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
                borderBottomWidth: '1px',
                borderColor: 'hsl(var(--border))',
                flexShrink: 0,
                backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
                color: pathname.includes('sbaudience') ? '#ffffff' : '#000000',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  lineHeight: '1.56',
                  fontWeight: 600
                }}>Search Products</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '4px',
                    borderRadius: '8px',
                  }}
                  aria-label="Close search"
                >
                  X
                </button>
              </div>

              {/* Search Input */}
              <div style={{
                padding: '8px',
                borderBottomWidth: '1px',
                borderColor: 'hsl(var(--border))',
                flexShrink: 0,
                backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
                color: pathname.includes('sbaudience') ? '#ffffff' : '#000000',
              }}>
                <input
                  ref={inputRef}
                  placeholder="Search products..."
                  onChange={(event) => {
                    setActiveSearch(event.target.value);
                    searchData(event.target.value);
                  }}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  value={activeSearch}
                  style={{
                    width: '100%',
                    fontSize: '16px',
                    lineHeight: 1.5,
                    backgroundColor: '#e4e4e7',
                    color: '#000000',
                    paddingInline: '8px',
                    paddingBlock: '4px'
                  }}
                />
              </div>

              {/* Results Container */}
              <div style={{
                flex: 1,
                minHeight: '0px',
                overflowY: 'auto',
                backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
                color: pathname.includes('sbaudience') ? '#ffffff' : '#000000',
              }}>
                {activeSearch.trim() !== '' ? (
                  foundProducts.length > 0 ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {foundProducts.map((product) => (
                        <button
                          key={product.slug}
                          onClick={() => {
                            handleProductClick(product.slug);
                          }}
                          onMouseDown={handleMouseDown}
                          style={{
                            width: '100%',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            borderBottomWidth: '1px',
                            borderColor: 'hsl(var(--border))',
                            textAlign: 'left'
                          }}
                        >
                          {/* Product Image */}
                          {/* <div className="flex-shrink-0">
                            <img
                              src={product.url}
                              alt={product.label}
                              className="w-14 h-14 object-cover rounded"
                            />
                          </div> */}

                          <div style={{
                            position: 'relative',
                            display: 'inline-flex',
                            height: '56px',
                            width: '56px',
                            alignItems: 'center'
                          }}>
                            <img
                              src={product.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${product.url}` : product.url}
                              alt={product.label}
                              width={100} 
                              height={100} 
                              style={{
                                objectFit: 'contain',
                                borderRadius: '4px',
                                maxHeight: '56px',
                                width: 'auto'
                              }}
                              loading={"lazy"}
                            />
                          </div>
                        
                          {/* Product Info */}
                          <div style={{
                            flex: 1,
                            minWidth: '0px'
                          }}>
                            <div style={{
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {product.label}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              lineHeight: '1.43',
                              color: 'hsl(var(--muted-foreground))',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {product.info}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}>
                      <p 
                        style={{
                          color: 'hsl(var(--muted-foreground))'
                        }}
                      >
                        No products found.
                      </p>
                    </div>
                  )
                ) : (
                  <div style={{
                    padding: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
}

export default SearchLightboxOld;