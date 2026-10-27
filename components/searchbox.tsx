"use client"

import { usePathname } from "next/navigation"
import { Searchbox } from "@/app/(frontend)/types"
import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
import { Input } from "./ui/input"
import { FC, useEffect, useRef, useState } from "react"
import { LazyImageCustomNavbar } from "./lazyImageCustomNavbar"
import { rankSearchboxProducts } from "@/lib/searchbox-search"

type PropType = {
  changeBrand: boolean
}

const SearchBox: FC<PropType> = (props) => {
  const { changeBrand } = props;
  const [activeSearch, setactiveSearch] = useState<string>('');
  const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
  const [initialProd, setInitialProd] = useState<Searchbox[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const skipBlurRef = useRef(false);

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

    

  return (
    <>
      <Input
        ref={inputRef}
        placeholder="Product search..."
        onChange={(event) => {
          setactiveSearch(event.target.value);
          searchData(event.target.value);
        }}
        onBlur={() => {
          if (skipBlurRef.current) {
            skipBlurRef.current = false; // reset
            return; // 👈 skip localStorage update if Enter triggered blur
          }
          setactiveSearch("");
          if(pathname.includes("sbaudience")) {
            document.cookie = `allDriversProductsSBAudience=; path=/; max-age=86400`;
          }
          else {
            document.cookie = `allDriversProducts=; path=/; max-age=86400`;
          }
        }}
        value={activeSearch}
        onKeyDown={(event) => {
          if (event.key === "Enter" && activeSearch.trim() !== "" && foundProducts.length !== 0) {
            skipBlurRef.current = true; // mark to skip blur
            setactiveSearch("");
            inputRef.current?.blur(); // remove focus
            // router.replace(
            //   `/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`
            // );
            if(foundProducts.length === 1) {
              window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/products/${foundProducts[0]?.slug}`;
            }
            else{
              window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/search`;
            }
          }
        }}
        className={`text-black border-foreground border-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-transparent lg:w-[15vw] w-[10px] focus:w-3/4 focus:top-4 focus:absolute transform transition-all ease-in-out duration-500 focus:z-102 focus:shadow-2xl focus:bg-background shadow-md z-101 ${pathname.includes("sbaudience") && 'bg-white'}`}
      />
      <div className={`${activeSearch.trim() === "" ? 'hidden' : 'block border-2 absolute z-50 bg-background lg:w-3/4 w-[10px] top-14 max-h-[400px] overflow-y-auto p-2 rounded-lg shadow-2xl'}`}>
        <div className="border-y-2 border-gray-100">
          <div className={`overflow-y-auto`}> 
            {foundProducts.length!=0?
              foundProducts.map((value) => (
                <div
                  key={value.label}
                  className="border-0 block cursor-pointer"
                  onMouseDown={() => {
                    setactiveSearch("");
                    window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/products/${value.slug}`
                  }}
                  // href={`${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/products/${value.slug}`}
                >                          
                  <div className={`p-2 flex border-b-2 border-gray-100 hover:bg-black hover:text-red-500 hover:font-bold hover:rounded-md transfom duration-200 ${pathname.includes("sbaudience") && 'text-foreground'}`}>
                    <LazyImageCustomNavbar
                      src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
                      alt={value.label}
                      classname="object-contain rounded max-h-14 w-auto" 
                      width={100} 
                      height={100} 
                      lazy
                      containerheight='h-14'
                      containerwidth='w-14'/>
                    <div className="pl-4 flex flex-col justify-center text-sm">
                      <div className="font-bold">{value.label}</div>
                      <div>{value.info}</div>
                    </div>
                    
                  </div>
                
                </div>
                // </Link>
              ))
              :
              <div>                          
                <div className={`p-4 flex justify-center items-center border-b-2 border-gray-100 ${pathname.includes("sbaudience") && 'text-foreground'}`}>
                  <div className="text-sm">
                    No products found.
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBox;