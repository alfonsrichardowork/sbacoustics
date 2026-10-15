'use client';

import { useState, useRef, useEffect, FC } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Searchbox } from '@/app/(frontend)/types';
import { usePathname } from 'next/navigation';
import getProductsForSearchbox from '@/app/(frontend)/actions/get-product-for-searchbox';
import { LazyImageCustomNavbar } from './lazyImageCustomNavbar';
import { Button } from './ui/button';
import { rankSearchboxProducts } from '@/lib/searchbox-search';

type PropType = {
  changeBrand: boolean
}

const SearchLightbox: FC<PropType> = (props) => {
  const { changeBrand } = props;
  const [activeSearch, setactiveSearch] = useState<string>('');
  const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
  const [initialProd, setInitialProd] = useState<Searchbox[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const skipBlurRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Searchbox[] = await getProductsForSearchbox(pathname);
        data.sort((a, b) => (a.size[0] || "").localeCompare(b.size[0] || ""));
        setInitialProd(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [pathname, changeBrand]);

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

  // 3. Search Processing Routine
  function searchData(val: string) {
    setactiveSearch(val);
    if (!val.trim()) {
      setfoundProducts([]);
      return;
    }

    const allFound = rankSearchboxProducts(initialProd, val);
    setfoundProducts(allFound);

    // Sync state values to active system cookies
    const cookieValue = allFound.map((item) => item.slug).join(",") + ",";
    const cookieName = pathname.includes("sbaudience") ? "allDriversProductsSBAudience" : "allDriversProducts";
    document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; path=/; max-age=86400`;
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const cookieName = pathname.includes("sbaudience") ? "allDriversProductsSBAudience" : "allDriversProducts";
        document.cookie = `${cookieName}=; path=/; max-age=86400`;
        setactiveSearch('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname]);

  
  const handleProductClick = (slug: string) => {
    setactiveSearch('');
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
      setactiveSearch('');
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
    setactiveSearch('');
    setfoundProducts([]);
  };

    

  return (
    <>
      {/* Search Button */}
      <div className="pl-1 pr-18">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className={`w-full h-9 px-3 flex items-center justify-between rounded-lg bg-muted/40 text-muted-foreground hover:cursor-pointer hover:bg-muted/60 ${pathname.includes('sbaudience') ?'hover:text-background' : 'hover:text-foreground'} border-border/60 transition-colors`}
          aria-label="Search products"
        >
          <span className="text-sm">Search...</span>
          <Search size={20} className="shrink-0" />
        </Button>
      </div>

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
                    setactiveSearch(event.target.value);
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
                          {/* <div className="flex-shrink-0">
                            <img
                              src={product.url}
                              alt={product.label}
                              className="w-14 h-14 object-cover rounded"
                            />
                          </div> */}
                          <LazyImageCustomNavbar 
                            src={product.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${product.url}` : product.url}
                            alt={product.label}
                            classname="object-contain rounded max-h-14 w-auto" 
                            width={100} 
                            height={100} 
                            lazy
                            containerheight='h-14'
                            containerwidth='w-14'
                            pathname={pathname}/>

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