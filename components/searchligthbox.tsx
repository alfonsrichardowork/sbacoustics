'use client';

import { useState, useRef, useEffect, FC } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

const SearchLightbox: FC<PropType> = (props) => {
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
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-transparent hover:text-primary transition-colors"
        aria-label="Search products"
      >
        <Search size={20} />
      </button>

      {/* Lightbox Overlay */}
      {isOpen && (
        <>
        <div
          className="fixed inset-0 z-999 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        
        <div className="fixed inset-0 z-1000 flex items-start justify-center pt-[6vh] pointer-events-none">
          <div
            className="w-full max-w-2xl mx-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Container */}
            <div className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col max-h-[60vh]">
              {/* Header with Close Button */}
              <div className={`flex items-center justify-between p-2 border-b border-border flex-shrink-0 ${pathname.includes('sbaudience') && 'bg-black text-white'}`}>
                <h2 className="text-lg font-semibold">Search Products</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Input */}
              <div className={`p-2 border-b border-border flex-shrink-0 ${pathname.includes('sbaudience') && 'bg-black text-white'}`}>
                <Input
                  ref={inputRef}
                  placeholder="Search products..."
                  onChange={(event) => {
                    setActiveSearch(event.target.value);
                    searchData(event.target.value);
                  }}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  value={activeSearch}
                  className="w-full text-base bg-white text-black"
                />
              </div>

              {/* Results Container */}
              <div className={`flex-1 min-h-0 overflow-y-auto ${pathname.includes('sbaudience') && 'bg-black text-white'}`}>
                {activeSearch.trim() !== '' ? (
                  foundProducts.length > 0 ? (
                    <div className="flex flex-col">
                      {foundProducts.map((product) => (
                        <button
                          key={product.slug}
                          onClick={() => {
                            handleProductClick(product.slug);
                          }}
                          onMouseDown={handleMouseDown}
                          className="w-full p-1 flex items-center gap-4 border-b border-border hover:bg-secondary transition-colors text-left last:border-b-0"
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={product.url}
                              alt={product.label}
                              className="w-14 h-14 object-cover rounded"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">
                              {product.label}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {product.info}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 flex items-center justify-center text-center">
                      <p className="text-muted-foreground">No products found.</p>
                    </div>
                  )
                ) : (
                  <div className="p-0 flex items-center justify-center text-center">
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

export default SearchLightbox;