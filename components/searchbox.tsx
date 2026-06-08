"use client"

import { usePathname } from "next/navigation"
import { Searchbox } from "@/app/(frontend)/types"
import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
import { Input } from "./ui/input"
import Fuse from "fuse.js";
import { FC, useEffect, useRef, useState } from "react"
import { LazyImageCustom } from "./lazyImageCustom"

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
const SearchBox: FC<PropType> = (props) => {
  const { changeBrand } = props
  const [finalProductSearchbox, setFinalProductSearchbox] = useState<ExtendedSearchbox[]>([]);
  const [activeSearch, setactiveSearch] = useState<string>('');
  const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname()
  const skipBlurRef = useRef(false);
   
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
        setactiveSearch('')
        inputRef.current?.blur(); // Remove focus from input
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finalProductSearchbox]);
    

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
          if (event.key === "Enter" && activeSearch.trim() !== "") {
            skipBlurRef.current = true; // mark to skip blur
            setactiveSearch("");
            inputRef.current?.blur(); // remove focus
            // router.replace(
            //   `/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`
            // );
            window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/search`;
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
                  <div className="relative pr-4">
                    <LazyImageCustom
                        src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
                        alt={value.label}
                        width={100}
                        height={100}
                        classname="w-10 h-auto"
                        lazy
                      />
                  </div>
                    <div className="flex flex-col justify-center text-sm">
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