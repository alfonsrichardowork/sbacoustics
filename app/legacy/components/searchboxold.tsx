

// "use client"

// import { usePathname } from "next/navigation"
// import { Searchbox } from "@/app/(frontend)/types"
// import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
// import Fuse from "fuse.js";
// import { FC, useEffect, useRef, useState } from "react"

// function normalizeFractions(text: string): string {
//   return text
//     // normalize Unicode fractions
//     .replace(/½/g, "1/2")
//     // normalize common patterns (6 1/2, 6-1/2 → 6.5)
//     .replace(/(\d+)\s*[- ]?\s*1\/2/g, (_, num) => `${num}.5`);
// }

// function normalizeSearch(text: string) {
//   return normalizeFractions(
//     text
//       .replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch")
//       .replace(/[-\s]+/g, " ") // ← dash and spaces become the same
//       .trim()
//       .toLowerCase()
//   );
// }

// type PropType = {
//   changeBrand: boolean
// }

// interface ExtendedSearchbox extends Searchbox {
//   namenospace: string[];
//   // sizenospace: string;
// }

// const SearchboxLegacy: FC<PropType> = (props) => {
//     const { changeBrand } = props
//   const [finalProductSearchbox, setFinalProductSearchbox] = useState<ExtendedSearchbox[]>([]);
//   const [activeSearch, setactiveSearch] = useState<string>('');
//   const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const pathname = usePathname()
//   const skipBlurRef = useRef(false);
   
//     useEffect(() => {
//       const fetchData = async () => {
//           try {
//               const data : Searchbox[] = await getProductsForSearchbox(pathname);
//               data.sort((a, b) => (a.size[0] || "").localeCompare(b.size[0] || ""))
//               const extendedData: ExtendedSearchbox[] = data.map((val) => ({
//                 ...val,
//                 namenospace: val.size.map(
//                   (oneSize) => `${oneSize}${val.name}`.replace(/[\s-]+/g, '')
//                 ),
//                 // sizenospace: `${val.size[0]}inch`
//               }));
//               setFinalProductSearchbox(extendedData);
//           } catch (error) {
//               console.error('Error fetching data:', error);
//           }
//       };
//       fetchData();
//     }, [pathname, changeBrand]);
//     const fuse = new Fuse(finalProductSearchbox, {
//         keys: [
//           { name: "label", weight: 1.0 },
//           { name: "slug", weight: 0.8 },
//           { name: "namenospace", weight: 0.5 },
//           // { name: "sizenospace", weight: 1.0 },
//           { name: "info", weight: 0.3 },
//           { name: "size", weight: 0.9 },
//           { name: "cat", weight: 0.4 },
//           { name: "subcat", weight: 0.3 },
//           { name: "subsubcat", weight: 0.3 },
//           { name: "productInKits", weight: 0.2 },
//         ],
//         threshold: 0.1,        
//         minMatchCharLength: 1,  
//         ignoreLocation: false,   
//         includeScore: true,     
//         useExtendedSearch: true,
//         findAllMatches: true
//     });

//     function searchData(val: string) {
//       let select: Searchbox[] = [];
//       let selectOEM: Searchbox[] = [];

//       // Normalize quotes and lowercase
//       let updatedVal = val.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch").trimStart().toLowerCase();
//       updatedVal = normalizeSearch(updatedVal)

//       const results = updatedVal
//           ? fuse.search(updatedVal).map((res) => res.item)
//           : finalProductSearchbox;

//       results.forEach((value) => {
//           if (value.subcat.some((val) => val.toLowerCase().includes("oem"))) {
//               selectOEM.push(value);
//           } else {
//               select.push(value);
//           }
//       });

//       const sortFn = (a: Searchbox, b: Searchbox) => {
//           const numA = parseInt(a.label.match(/^\d+/)?.[0] || "100", 10);
//           const numB = parseInt(b.label.match(/^\d+/)?.[0] || "100", 10);

//           if (numA !== numB) {
//               return numA - numB;
//           }

//           return a.label.localeCompare(b.label);
//       };

//       select.sort(sortFn);
//       selectOEM.sort(sortFn);
//       const allFound = [...select, ...selectOEM]
//       setfoundProducts(allFound);
//       const value = allFound.map((item) => item.slug).join(",") + ","
//       if(pathname.includes("sbaudience")){ 
//         document.cookie = `allDriversProductsSBAudience=${encodeURIComponent(value)}; path=/; max-age=86400`
//       }
//       else{
//         document.cookie = `allDriversProducts=${encodeURIComponent(value)}; path=/; max-age=86400`
//       }
//     }

//   // Adding event listeners on mount and cleaning up on unmount
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         // const value = finalProductSearchbox.map(item => item.slug).join(',') + ',';
//         // document.cookie = `allDriversProducts=${encodeURIComponent(value)}; path=/; max-age=86400`;
//         if(pathname.includes("sbaudience")) {
//           document.cookie = `allDriversProductsSBAudience=; path=/; max-age=86400`;
//         }
//         else{
//           document.cookie = `allDriversProducts=; path=/; max-age=86400`;
//         }
//         setactiveSearch('')
//         inputRef.current?.blur(); // Remove focus from input
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [finalProductSearchbox]);
    

//   return (
//     <div
//       style={{
//         width: '75%',
//         position: 'relative',
//       }}
//     >
//         {/* <div className="lg:w-[15vw] w-0"> */}
//           {/* <div className="flex items-center py-4"> */}
//             <input
//               ref={inputRef}
//               placeholder="Product search..."
//               onChange={(event) =>
//                 (
//                   setactiveSearch(event.target.value),
//                   searchData(event.target.value)
//                 )
//               }
//             onBlur={() => {
//                 if (skipBlurRef.current) {
//                     skipBlurRef.current = false; // reset
//                     return; // 👈 skip localStorage update if Enter triggered blur
//                 }
//                 setactiveSearch("");
//                 if(pathname.includes("sbaudience")) {
//                     document.cookie = `allDriversProductsSBAudience=; path=/; max-age=86400`;
//                 }
//                 else {
//                     document.cookie = `allDriversProducts=; path=/; max-age=86400`;
//                 }
//             }}
//               value={activeSearch}
//               onKeyDown={(event) => {
//                 if (event.key === "Enter" && activeSearch.trim() !== "") {
//                   skipBlurRef.current = true; // mark to skip blur
//                   setactiveSearch("");
//                   inputRef.current?.blur(); // remove focus
//                 // router.replace(`/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`);
//                 window.location.href = `/legacy${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/search`;
//                 }
//               }}
//               style={{
//                 width: '100%',
//                 transitionProperty: 'all',
//                 borderRadius: '8px',
//                 padding: '4px',
//                 backgroundColor: '#ffffff',
//                 borderColor: 'hsl(var(--foreground))',
//                 borderWidth: '1px',
//                 zIndex: 102,
//                 color: '#000000',
//                 boxSizing: 'border-box',
//               }}
//             />
//           {/* </div> */}
//           <div 
//           style={{
//             display: activeSearch.trim() === "" ? 'none' : 'block',
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             width: '100%',
//             zIndex: 105,
//             marginTop: '4px',
//           }}>
//           <div 
//           style={{
//             width: '100%',
//             borderWidth: '2px',
//             borderStyle: 'solid',
//             borderColor: '#f3f4f6',
//             backgroundColor: '#ffffff',
//             maxHeight: '400px',
//             overflowY: 'auto',
//             padding: '8px',
//             borderRadius: '8px',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//             boxSizing: 'border-box',
//           }}>
//             <div style={{
//               borderBlockWidth: '2px',
//               borderColor: '#f3f4f6'
//             }}>
//               <div style={{
//                 overflowY: 'auto'
//               }}> 
//                 {foundProducts.length!=0?
//                   foundProducts.map((value) => (
//                     <div
//                       key={value.label}
//                       style={{
//                         borderWidth: '0px',
//                         display: 'block',
//                         cursor: 'pointer'
//                       }}
//                       onMouseDown={() => {
//                         setactiveSearch("");
//                         window.location.href = `${pathname.includes('sbaudience') ? '/legacy/sbaudience' : pathname.includes('sbautomotive') ? '/legacy/sbautomotive' : '/legacy'}/products/${value.slug}`
//                       }}
//                     >                          
//                       <div
//                       style={{
//                         padding: '8px',
//                         display: 'flex',
//                         borderBottomWidth: '2px',
//                         borderColor: '#f3f4f6',
                        
//                       }}>
//                           <div style={{
//                             position: 'relative',
//                             display: 'inline-flex',
//                             height: '56px',
//                             width: '56px',
//                             alignItems: 'center'
//                           }}>
//                             <img
//                               src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
//                               alt={value.label}
//                               width={100} 
//                               height={100} 
//                               style={{
//                                 objectFit: 'contain',
//                                 borderRadius: '4px',
//                                 maxHeight: '56px',
//                                 width: 'auto'
//                               }}
//                               loading="lazy"
//                             />
//                           </div>
//                         <div style={{
//                           paddingLeft: '16px',
//                           display: 'flex',
//                           flexDirection: 'column',
//                           justifyContent: 'center',
//                           fontSize: '14px',
//                           color: '#000000'
//                         }}>
//                           <div style={{
//                             fontWeight: 700
//                           }}>{value.label}</div>
//                           <div>{value.info}</div>
//                         </div>
                        
//                       </div>
                    
//                     </div>
//                     // </Link>
//                   ))
//                   :
//                   <div>                          
//                     <div style={{
//                       padding: '16px',
//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       borderBottomWidth: '2px',
//                       borderColor: '#f3f4f6'
//                     }}>
//                       <div style={{
//                         fontSize: '14px',
//                         color: '#000000'
//                       }}>
//                         No products found.
//                       </div>
//                     </div>
//                   </div>
//                 }
//               </div>
//             </div>
//           </div>
//           </div>
//         {/* </div>    */}
//     </div>
//   )
// }

// export default SearchboxLegacy;






















"use client"

import { usePathname } from "next/navigation"
import { Searchbox } from "@/app/(frontend)/types"
import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
import Fuse from "fuse.js";
import { FC, useEffect, useMemo, useRef, useState } from "react"


// 1. Unified String Simplification Engine
function simplifyText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Normalize fractions (7½ -> 7.5, 7 1/2 -> 7.5)
    .replace(/½/g, "1/2")
    .replace(/(\d+)\s*[- ]?\s*1\/2/g, (_, num) => `${num}.5`)
    // Convert all quote variations to the standard word "inch"
    .replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, "inch")
    // Strip plural variances from sizing terminology
    .replace(/\binches?\b/g, "inch")
    // Completely strip structural boundaries (spaces, dashes, slashes)
    .replace(/[\s\-\/]+/g, "");
}

const joinArray = (arr: string[] | undefined) => (arr ? arr.join(' ') : '');

type PropType = {
  changeBrand: boolean
}

const SearchboxLegacy: FC<PropType> = (props) => {
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

  // 2. Pre-index and flatten items with their combined searchable text representations
  const simplifiedDataset = useMemo(() => {
    return initialProd.map(item => {
      // Tie all searchable arrays and strings into a unified single text body
      const searchableBody = [
        item.label,
        item.slug,
        item.info,
        joinArray(item.size),
        joinArray(item.cat),
        joinArray(item.subcat),
        joinArray(item.subsubcat),
        joinArray(item.productInKits)
      ].join(' ');

      return {
        item,
        simplifiedBody: simplifyText(searchableBody),
        // Keep an explicit structural representation for pure structural measurements
        simplifiedSizes: (item.size || []).map(s => simplifyText(s))
      };
    });
  }, [initialProd]);

  // 3. Search Processing Routine
  function searchData(val: string) {
    setactiveSearch(val);
    if (!val.trim()) {
      setfoundProducts([]);
      return;
    }

    let results: Searchbox[] = [];
    const cleanQuery = val.trim();
    
    // Check if the query matches an exact format like "1 inch" or "7.5inch"
    const isExactSizeSearch = /^\d+(?:\.\d+)?\s*inch$/i.test(simplifyText(cleanQuery).replace(/(\d+)(inch)/, "$1 $2"));

    if (isExactSizeSearch) {
      const targetSize = simplifyText(cleanQuery);
      results = simplifiedDataset
        .filter(entry => entry.simplifiedSizes.some(size => size === targetSize))
        .map(entry => entry.item);
    } else {
      // Split user multi-word entry terms (e.g. "sb 12 paper" -> ['sb12', 'paper'])
      const queryTokens = cleanQuery
        .split(/\s+/)
        .filter(Boolean)
        .map(token => simplifyText(token));

      // Each catalog row entry must include ALL typed keywords (AND matching logic)
      results = simplifiedDataset
        .filter(entry => 
          queryTokens.every(token => entry.simplifiedBody.includes(token))
        )
        .map(entry => entry.item);
    }

    // Split items into standard vs OEM categories
    let select: Searchbox[] = [];
    let selectOEM: Searchbox[] = [];

    results.forEach((value) => {
      const isOEM = value.subcat?.some((cat) => cat.toLowerCase().includes("oem"));
      if (isOEM) {
        selectOEM.push(value);
      } else {
        select.push(value);
      }
    });

    // Keep your original custom numerical sorting engine 
    const sortFn = (a: Searchbox, b: Searchbox) => {
      const numA = parseInt(a.label.match(/^\d+/)?.[0] || "100", 10);
      const numB = parseInt(b.label.match(/^\d+/)?.[0] || "100", 10);
      if (numA !== numB) return numA - numB;
      return a.label.localeCompare(b.label);
    };

    select.sort(sortFn);
    selectOEM.sort(sortFn);
    
    const allFound = [...select, ...selectOEM];
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
    <div
      style={{
        width: '75%',
        position: 'relative',
      }}
    >
        {/* <div className="lg:w-[15vw] w-0"> */}
          {/* <div className="flex items-center py-4"> */}
            <input
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
                // router.replace(`/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`);
                window.location.href = `/legacy${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/search`;
                }
              }}
              style={{
                width: '100%',
                transitionProperty: 'all',
                borderRadius: '8px',
                padding: '4px',
                backgroundColor: '#ffffff',
                borderColor: 'hsl(var(--foreground))',
                borderWidth: '1px',
                zIndex: 102,
                color: '#000000',
                boxSizing: 'border-box',
              }}
            />
          {/* </div> */}
          <div 
          style={{
            display: activeSearch.trim() === "" ? 'none' : 'block',
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            zIndex: 105,
            marginTop: '4px',
          }}>
          <div 
          style={{
            width: '100%',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#f3f4f6',
            backgroundColor: '#ffffff',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '8px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            boxSizing: 'border-box',
          }}>
            <div style={{
              borderBlockWidth: '2px',
              borderColor: '#f3f4f6'
            }}>
              <div style={{
                overflowY: 'auto'
              }}> 
                {foundProducts.length!=0?
                  foundProducts.map((value) => (
                    <div
                      key={value.label}
                      style={{
                        borderWidth: '0px',
                        display: 'block',
                        cursor: 'pointer'
                      }}
                      onMouseDown={() => {
                        setactiveSearch("");
                        window.location.href = `${pathname.includes('sbaudience') ? '/legacy/sbaudience' : pathname.includes('sbautomotive') ? '/legacy/sbautomotive' : '/legacy'}/products/${value.slug}`
                      }}
                    >                          
                      <div
                      style={{
                        padding: '8px',
                        display: 'flex',
                        borderBottomWidth: '2px',
                        borderColor: '#f3f4f6',
                        
                      }}>
                          <div style={{
                            position: 'relative',
                            display: 'inline-flex',
                            height: '56px',
                            width: '56px',
                            alignItems: 'center'
                          }}>
                            <img
                              src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
                              alt={value.label}
                              width={100} 
                              height={100} 
                              style={{
                                objectFit: 'contain',
                                borderRadius: '4px',
                                maxHeight: '56px',
                                width: 'auto'
                              }}
                              loading="lazy"
                            />
                          </div>
                        <div style={{
                          paddingLeft: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          fontSize: '14px',
                          color: '#000000'
                        }}>
                          <div style={{
                            fontWeight: 700
                          }}>{value.label}</div>
                          <div>{value.info}</div>
                        </div>
                        
                      </div>
                    
                    </div>
                    // </Link>
                  ))
                  :
                  <div>                          
                    <div style={{
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomWidth: '2px',
                      borderColor: '#f3f4f6'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#000000'
                      }}>
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
    </div>
  )
}

export default SearchboxLegacy;