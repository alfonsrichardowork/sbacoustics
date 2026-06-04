"use client"

import { usePathname } from "next/navigation"
import { Searchbox } from "@/app/(frontend)/types"
import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
import { Input } from "./ui/input"
import Image from "next/image"
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

const SearchBoxNavbar: FC<PropType> = (props) => {
  const { changeBrand } = props
  const [finalProductSearchbox, setFinalProductSearchbox] = useState<Searchbox[]>([]);
  const pathname = usePathname()
  const [activeSearch, setactiveSearch] = useState<string>('');
  const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipBlurRef = useRef(false);
  const skipUnmountRef = useRef(false);
  

  // Setup Fuse
  const fuse = new Fuse(finalProductSearchbox, {
      keys: [
        { name: "name", weight: 1.0 },
        { name: "size", weight: 0.8 },
        { name: "cat", weight: 0.5 },
        { name: "subcat", weight: 0.7 },
        { name: "subsubcat", weight: 0.7 },
        { name: "productInKits", weight: 0.5 },
      ],
      threshold: 0.15,         // lower = stricter match, higher = looser
      minMatchCharLength: 2,  // require at least 2 chars for match
      ignoreLocation: true,   // ignore location of match
      includeScore: true,     // gives back match score
      useExtendedSearch: true
  });
  
    useEffect(() => {
      const fetchData = async () => {
          try {
              const data : Searchbox[] = await getProductsForSearchbox(pathname);
              data.sort((a, b) => (a.size[0] || "").localeCompare(b.size[0] || ""))
              setFinalProductSearchbox(data);
              setFinalProductSearchbox(data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData();
    }, [pathname, changeBrand]);

  
  function searchData(val: string) {
        let select: Searchbox[] = [];
        let selectOEM: Searchbox[] = [];

        // Normalize quotes and lowercase
        let updatedVal = val.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch").trimStart().toLowerCase();
        updatedVal = normalizeSearch(updatedVal)


        // Run fuzzy search
        const results = updatedVal
            ? fuse.search(updatedVal).map((res) => res.item)
            : finalProductSearchbox;

        // Separate OEM vs non-OEM
        results.forEach((value) => {
            if (value.subcat.map((val) => val.toLowerCase().includes("oem"))) {
            selectOEM.push(value);
            } else {
            select.push(value);
            }
        });

        // Sorting helper
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

        // Update state
        setfoundProducts([...select, ...selectOEM ]);
    }


  useEffect(() => {
    foundProducts && foundProducts.length > 0 &&
    localStorage.setItem('allDriversProducts', (foundProducts.map(item => item.slug).join(',') + ','));
  }, [foundProducts]);

  // Adding event listeners on mount and cleaning up on unmount
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        localStorage.setItem('allDriversProducts', (finalProductSearchbox.map(item => item.slug).join(',') + ','))
        setactiveSearch('')
        inputRef.current?.blur(); // Remove focus from input
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finalProductSearchbox]);
  
    useEffect(() => {
    return () => {
      if (skipUnmountRef.current) {
        skipUnmountRef.current = false; // reset after skipping
        return;
      }
      // this runs when component is unmounted
      localStorage.setItem(
        "allDriversProducts",
        finalProductSearchbox.map((item) => item.slug).join(",") + ","
      );
    };
  }, [finalProductSearchbox]);


  return (
    <>
        {/* <div className="lg:w-[15vw] w-0"> */}
          {/* <div className="flex items-center py-4"> */}
            <Input
              ref={inputRef}
              placeholder="Product search..."
              onChange={(event) =>
                (
                  setactiveSearch(event.target.value),
                  searchData(event.target.value)
                )
              }
              onBlur={() => {
                  if (skipBlurRef.current) {
                    skipBlurRef.current = false; // reset
                    return; // 👈 skip localStorage update if Enter triggered blur
                  }
                  setactiveSearch("")
                  localStorage.setItem('allDriversProducts', (finalProductSearchbox.map(item => item.slug).join(',') + ','))
                }
              }
              value={activeSearch}
              onKeyDown={(event) => {
                if (event.key === "Enter" && activeSearch.trim() !== "") {
                  skipBlurRef.current = true; // mark to skip blur
                  skipUnmountRef.current = true; // skip unmount save
                  setactiveSearch("");
                  inputRef.current?.blur(); // remove focus
                  // router.replace(`/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`);
                  window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`;
                }
              }}
              className=" w-full transform transition-all ease-in-out duration-500 bg-background shadow-md border-foreground border-2 focus:border-none z-102 text-black"
            />
          {/* </div> */}
          <div className="w-full relative">
          <div className={`${activeSearch.trim() === "" ? 'hidden' : 'absolute z-105 w-full block border-2 top-1 bg-background max-h-[400px] overflow-y-auto p-2 rounded-lg shadow-2xl'}`}>
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
                    >                          
                      <div className={`p-2 flex border-b-2 border-gray-100 hover:bg-black hover:text-primary hover:font-bold hover:rounded-md transfom duration-200 ${pathname.includes("sbaudience") && 'text-foreground'}`}>
                      <div className="relative pr-4">
                        <LazyImageCustom
                          src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
                          alt={value.label}
                          width={100}
                          height={100}
                          classname="w-10 h-auto z-0"
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
          </div>
        {/* </div>    */}
    </>
  )
}

export default SearchBoxNavbar;