// // "use client"

// // import { usePathname } from "next/navigation"
// // import { Searchbox } from "@/app/(frontend)/types"
// // import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
// // import { Input } from "./ui/input"
// // import Fuse from "fuse.js";
// // import { FC, useEffect, useRef, useState } from "react"
// // import { LazyImageCustomNavbar } from "./lazyImageCustomNavbar"

// // function normalizeFractions(text: string): string {
// //   return text
// //     // normalize Unicode fractions
// //     .replace(/½/g, "1/2")
// //     // normalize common patterns (6 1/2, 6-1/2 → 6.5)
// //     .replace(/(\d+)\s*[- ]?\s*1\/2/g, (_, num) => `${num}.5`);
// // }

// // function normalizeSearch(text: string) {
// //   return normalizeFractions(
// //     text
// //       .replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch")
// //       .replace(/[-\s]+/g, " ") // ← dash and spaces become the same
// //       .trim()
// //       .toLowerCase()
// //   );
// // }

// // type PropType = {
// //   changeBrand: boolean
// // }
// // interface ExtendedSearchbox extends Searchbox {
// //   namenospace: string[];
// //   // sizenospace: string;
// // }
// // const SearchBox: FC<PropType> = (props) => {
// //   const { changeBrand } = props
// //   const [finalProductSearchbox, setFinalProductSearchbox] = useState<ExtendedSearchbox[]>([]);
// //   const [activeSearch, setactiveSearch] = useState<string>('');
// //   const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const pathname = usePathname()
// //   const skipBlurRef = useRef(false);
   
// //     useEffect(() => {
// //       const fetchData = async () => {
// //           try {
// //               const data : Searchbox[] = await getProductsForSearchbox(pathname);
// //               data.sort((a, b) => (a.size[0] || "").localeCompare(b.size[0] || ""))
// //               const extendedData: ExtendedSearchbox[] = data.map((val) => ({
// //                 ...val,
// //                 namenospace: val.size.map(
// //                   (oneSize) => `${oneSize}${val.name}`.replace(/[\s-]+/g, '')
// //                 ),
// //                 // sizenospace: `${val.size[0]}inch`
// //               }));
// //               setFinalProductSearchbox(extendedData);
// //           } catch (error) {
// //               console.error('Error fetching data:', error);
// //           }
// //       };
// //       fetchData();
// //     }, [pathname, changeBrand]);
// //     const fuse = new Fuse(finalProductSearchbox, {
// //         keys: [
// //           { name: "label", weight: 1.0 },
// //           { name: "slug", weight: 0.8 },
// //           { name: "namenospace", weight: 0.5 },
// //           // { name: "sizenospace", weight: 1.0 },
// //           { name: "info", weight: 0.3 },
// //           { name: "size", weight: 0.9 },
// //           { name: "cat", weight: 0.4 },
// //           { name: "subcat", weight: 0.3 },
// //           { name: "subsubcat", weight: 0.3 },
// //           { name: "productInKits", weight: 0.2 },
// //         ],
// //         threshold: 0.1,        
// //         minMatchCharLength: 1,  
// //         ignoreLocation: false,   
// //         includeScore: true,     
// //         useExtendedSearch: true,
// //         findAllMatches: true
// //     });

// //     function searchData(val: string) {
// //       let select: Searchbox[] = [];
// //       let selectOEM: Searchbox[] = [];

// //       // Normalize quotes and lowercase
// //       let updatedVal = val.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch").trimStart().toLowerCase();
// //       updatedVal = normalizeSearch(updatedVal)

// //       const results = updatedVal
// //           ? fuse.search(updatedVal).map((res) => res.item)
// //           : finalProductSearchbox;

// //       results.forEach((value) => {
// //           if (value.subcat.some((val) => val.toLowerCase().includes("oem"))) {
// //               selectOEM.push(value);
// //           } else {
// //               select.push(value);
// //           }
// //       });

// //       const sortFn = (a: Searchbox, b: Searchbox) => {
// //           const numA = parseInt(a.label.match(/^\d+/)?.[0] || "100", 10);
// //           const numB = parseInt(b.label.match(/^\d+/)?.[0] || "100", 10);

// //           if (numA !== numB) {
// //               return numA - numB;
// //           }

// //           return a.label.localeCompare(b.label);
// //       };

// //       select.sort(sortFn);
// //       selectOEM.sort(sortFn);
// //       const allFound = [...select, ...selectOEM]
// //       setfoundProducts(allFound);
// //       const value = allFound.map((item) => item.slug).join(",") + ","
// //       if(pathname.includes("sbaudience")){ 
// //         document.cookie = `allDriversProductsSBAudience=${encodeURIComponent(value)}; path=/; max-age=86400`
// //       }
// //       else{
// //         document.cookie = `allDriversProducts=${encodeURIComponent(value)}; path=/; max-age=86400`
// //       }
// //     }

// //   // Adding event listeners on mount and cleaning up on unmount
// //   useEffect(() => {
// //     const handleKeyDown = (event: KeyboardEvent) => {
// //       if (event.key === 'Escape') {
// //         // const value = finalProductSearchbox.map(item => item.slug).join(',') + ',';
// //         // document.cookie = `allDriversProducts=${encodeURIComponent(value)}; path=/; max-age=86400`;
// //         if(pathname.includes("sbaudience")) {
// //           document.cookie = `allDriversProductsSBAudience=; path=/; max-age=86400`;
// //         }
// //         else{
// //           document.cookie = `allDriversProducts=; path=/; max-age=86400`;
// //         }
// //         setactiveSearch('')
// //         inputRef.current?.blur(); // Remove focus from input
// //       }
// //     };

// //     window.addEventListener('keydown', handleKeyDown);
// //     return () => {
// //       window.removeEventListener('keydown', handleKeyDown);
// //     };
// //   }, [finalProductSearchbox]);
    

// //   return (
// //     <>
// //       <Input
// //         ref={inputRef}
// //         placeholder="Product search..."
// //         onChange={(event) => {
// //           setactiveSearch(event.target.value);
// //           searchData(event.target.value);
// //         }}
// //         onBlur={() => {
// //           if (skipBlurRef.current) {
// //             skipBlurRef.current = false; // reset
// //             return; // 👈 skip localStorage update if Enter triggered blur
// //           }
// //           setactiveSearch("");
// //           if(pathname.includes("sbaudience")) {
// //             document.cookie = `allDriversProductsSBAudience=; path=/; max-age=86400`;
// //           }
// //           else {
// //             document.cookie = `allDriversProducts=; path=/; max-age=86400`;
// //           }
// //         }}
// //         value={activeSearch}
// //         onKeyDown={(event) => {
// //           if (event.key === "Enter" && activeSearch.trim() !== "") {
// //             skipBlurRef.current = true; // mark to skip blur
// //             setactiveSearch("");
// //             inputRef.current?.blur(); // remove focus
// //             // router.replace(
// //             //   `/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`
// //             // );
// //             window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/search`;
// //           }
// //         }}
// //         className={`text-black border-foreground border-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-transparent lg:w-[15vw] w-[10px] focus:w-3/4 focus:top-4 focus:absolute transform transition-all ease-in-out duration-500 focus:z-102 focus:shadow-2xl focus:bg-background shadow-md z-101 ${pathname.includes("sbaudience") && 'bg-white'}`}
// //       />
// //       <div className={`${activeSearch.trim() === "" ? 'hidden' : 'block border-2 absolute z-50 bg-background lg:w-3/4 w-[10px] top-14 max-h-[400px] overflow-y-auto p-2 rounded-lg shadow-2xl'}`}>
// //         <div className="border-y-2 border-gray-100">
// //           <div className={`overflow-y-auto`}> 
// //             {foundProducts.length!=0?
// //               foundProducts.map((value) => (
// //                 <div
// //                   key={value.label}
// //                   className="border-0 block cursor-pointer"
// //                   onMouseDown={() => {
// //                     setactiveSearch("");
// //                     window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/products/${value.slug}`
// //                   }}
// //                   // href={`${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/products/${value.slug}`}
// //                 >                          
// //                   <div className={`p-2 flex border-b-2 border-gray-100 hover:bg-black hover:text-red-500 hover:font-bold hover:rounded-md transfom duration-200 ${pathname.includes("sbaudience") && 'text-foreground'}`}>
// //                     <LazyImageCustomNavbar
// //                       src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
// //                       alt={value.label}
// //                       classname="object-contain rounded max-h-14 w-auto" 
// //                       width={100} 
// //                       height={100} 
// //                       lazy
// //                       containerheight='h-14'
// //                       containerwidth='w-14'/>
// //                     <div className="pl-4 flex flex-col justify-center text-sm">
// //                       <div className="font-bold">{value.label}</div>
// //                       <div>{value.info}</div>
// //                     </div>
                    
// //                   </div>
                
// //                 </div>
// //                 // </Link>
// //               ))
// //               :
// //               <div>                          
// //                 <div className={`p-4 flex justify-center items-center border-b-2 border-gray-100 ${pathname.includes("sbaudience") && 'text-foreground'}`}>
// //                   <div className="text-sm">
// //                     No products found.
// //                   </div>
// //                 </div>
// //               </div>
// //             }
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   )
// // }

// // export default SearchBox;
















// "use client"

// import { usePathname } from "next/navigation"
// import { Searchbox } from "@/app/(frontend)/types"
// import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
// import { Input } from "./ui/input"
// import Fuse from "fuse.js";
// import { FC, useEffect, useMemo, useRef, useState } from "react"
// import { LazyImageCustomNavbar } from "./lazyImageCustomNavbar"
// import MiniSearch from 'minisearch';

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

// const joinArray = (arr: string[] | undefined) => (arr ? arr.join(' ') : '');

// const SearchBox: FC<PropType> = (props) => {
//   const { changeBrand } = props
//   const [activeSearch, setactiveSearch] = useState<string>('');
//   const [foundProducts, setfoundProducts] = useState<Searchbox[]>([]);
//   const [initialProd, setInitialProd] = useState<Searchbox[]>([]);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const pathname = usePathname()
//   const skipBlurRef = useRef(false);
//   function normalizeSize(value: string) {
//     return normalizeSearch(value)
//       .replace(/\binches?\b/g, "inch")
//       .trim()
//   }
//   function isExactSizeSearch(value: string) {
//     return /^\d+(?:\.\d+)?\s+inch$/.test(value)
//   }
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data: Searchbox[] = await getProductsForSearchbox(pathname);
//         data.sort((a, b) => (a.size[0] || "").localeCompare(b.size[0] || ""));
//         setInitialProd(data)
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, [pathname, changeBrand]);

//   // 2. Initialize MiniSearch Index safely with useMemo (Prevents recreation on every render)
//   const miniSearchIndex = useMemo(() => {
//     if (initialProd.length === 0) return null;

//     const ms = new MiniSearch({
//       fields: [
//         'label', 
//         'slug', 
//         'info', 
//         'sizeStr', 
//         'catStr', 
//         'subcatStr', 
//         'subsubcatStr', 
//         'productInKitsStr'], 
//       storeFields: ['slug'], 
//       idField: 'slug', // Add this
//       tokenize: (value) => value.toLowerCase().match(/[a-z]+\d*|\d+/g) ?? [],
      
//       // Corrected placement for field weight assignments using searchOptions.boost
//       searchOptions: {
//         prefix: true,
//         fuzzy: false,
//         boost: {
//           label: 2.0,
//           sizeStr: 1.8,
//           slug: 1.6,
//           catStr: 0.8,
//           subcatStr: 0.6,
//           subsubcatStr: 0.6,
//           info: 0.6,
//           productInKitsStr: 0.4
//         }
//       }
//     });

//     const indexableData = initialProd.map(item => ({
//       ...item,
//       sizeStr: joinArray(item.size),
//       catStr: joinArray(item.cat),
//       subcatStr: joinArray(item.subcat),
//       subsubcatStr: joinArray(item.subsubcat),
//       productInKitsStr: joinArray(item.productInKits),
//     }));

//     ms.addAll(indexableData);
//     return ms;
//   }, [initialProd]);

//   // 3. Clean Search Processing Function
//   function searchData(val: string) {
//     let select: Searchbox[] = [];
//     let selectOEM: Searchbox[] = [];

//     // Normalize quotes and spaces
//     let updatedVal = val.replace(/["“”‟″‶〃״˝ʺ˶ˮײ']/g, " inch").trimStart().toLowerCase();
//     if (typeof normalizeSearch === 'function') {
//       updatedVal = normalizeSearch(updatedVal);
//     }

//     let results: Searchbox[] = [];

//     if (updatedVal && miniSearchIndex) {
//       if (isExactSizeSearch(updatedVal)) {
//         results = initialProd.filter((product) =>
//           product.size.some(
//             (size) => normalizeSize(size) === updatedVal
//           )
//         )
//       } else {
//         const searchResults = miniSearchIndex.search(updatedVal, {
//           prefix: true,
//           fuzzy: false,
//         });
//         const datasetMap = new Map(
//           initialProd.map((item) => [item.slug, item])
//         )
//         results = searchResults
//           .map((result) => datasetMap.get(result.id))
//           .filter((item): item is Searchbox => !!item)
//       }
//     }

//     // Split items into standard vs OEM categories
//     results.forEach((value) => {
//       const isOEM = value.subcat?.some((cat) => cat.toLowerCase().includes("oem"));
//       if (isOEM) {
//         selectOEM.push(value);
//       } else {
//         select.push(value);
//       }
//     });

//     // Custom sorting fallback for identical semantic matching weights
//     const sortFn = (a: Searchbox, b: Searchbox) => {
//       const numA = parseInt(a.label.match(/^\d+/)?.[0] || "100", 10);
//       const numB = parseInt(b.label.match(/^\d+/)?.[0] || "100", 10);
//       if (numA !== numB) return numA - numB;
//       return a.label.localeCompare(b.label);
//     };

//     select.sort(sortFn);
//     selectOEM.sort(sortFn);
    
//     const allFound = [...select, ...selectOEM];
//     setfoundProducts(allFound);
//     console.log("foundProducts: ", foundProducts.map((val) => val.name))
//     // Sync state values to active system cookies
//     const cookieValue = allFound.map((item) => item.slug).join(",") + ",";
//     const cookieName = pathname.includes("sbaudience") ? "allDriversProductsSBAudience" : "allDriversProducts";
//     document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; path=/; max-age=86400`;
//   }

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
//   }, [initialProd]);
    

//   return (
//     <>
//       <Input
//         ref={inputRef}
//         placeholder="Product search..."
//         onChange={(event) => {
//           setactiveSearch(event.target.value);
//           searchData(event.target.value);
//         }}
//         onBlur={() => {
//           if (skipBlurRef.current) {
//             skipBlurRef.current = false; // reset
//             return; // 👈 skip localStorage update if Enter triggered blur
//           }
//           setactiveSearch("");
//           if(pathname.includes("sbaudience")) {
//             document.cookie = `allDriversProductsSBAudience=; path=/; max-age=86400`;
//           }
//           else {
//             document.cookie = `allDriversProducts=; path=/; max-age=86400`;
//           }
//         }}
//         value={activeSearch}
//         onKeyDown={(event) => {
//           if (event.key === "Enter" && activeSearch.trim() !== "") {
//             skipBlurRef.current = true; // mark to skip blur
//             setactiveSearch("");
//             inputRef.current?.blur(); // remove focus
//             // router.replace(
//             //   `/drivers/all?search=${encodeURIComponent(activeSearch.trim())}`
//             // );
//             window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/search`;
//           }
//         }}
//         className={`text-black border-foreground border-2 focus:border-primary focus-visible:ring-0 focus-visible:ring-transparent lg:w-[15vw] w-[10px] focus:w-3/4 focus:top-4 focus:absolute transform transition-all ease-in-out duration-500 focus:z-102 focus:shadow-2xl focus:bg-background shadow-md z-101 ${pathname.includes("sbaudience") && 'bg-white'}`}
//       />
//       <div className={`${activeSearch.trim() === "" ? 'hidden' : 'block border-2 absolute z-50 bg-background lg:w-3/4 w-[10px] top-14 max-h-[400px] overflow-y-auto p-2 rounded-lg shadow-2xl'}`}>
//         <div className="border-y-2 border-gray-100">
//           <div className={`overflow-y-auto`}> 
//             {foundProducts.length!=0?
//               foundProducts.map((value) => (
//                 <div
//                   key={value.label}
//                   className="border-0 block cursor-pointer"
//                   onMouseDown={() => {
//                     setactiveSearch("");
//                     window.location.href = `${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/products/${value.slug}`
//                   }}
//                   // href={`${pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : ''}/products/${value.slug}`}
//                 >                          
//                   <div className={`p-2 flex border-b-2 border-gray-100 hover:bg-black hover:text-red-500 hover:font-bold hover:rounded-md transfom duration-200 ${pathname.includes("sbaudience") && 'text-foreground'}`}>
//                     <LazyImageCustomNavbar
//                       src={value.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${value.url}` : value.url}
//                       alt={value.label}
//                       classname="object-contain rounded max-h-14 w-auto" 
//                       width={100} 
//                       height={100} 
//                       lazy
//                       containerheight='h-14'
//                       containerwidth='w-14'/>
//                     <div className="pl-4 flex flex-col justify-center text-sm">
//                       <div className="font-bold">{value.label}</div>
//                       <div>{value.info}</div>
//                     </div>
                    
//                   </div>
                
//                 </div>
//                 // </Link>
//               ))
//               :
//               <div>                          
//                 <div className={`p-4 flex justify-center items-center border-b-2 border-gray-100 ${pathname.includes("sbaudience") && 'text-foreground'}`}>
//                   <div className="text-sm">
//                     No products found.
//                   </div>
//                 </div>
//               </div>
//             }
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default SearchBox;




















"use client"

import { usePathname } from "next/navigation"
import { Searchbox } from "@/app/(frontend)/types"
import getProductsForSearchbox from "@/app/(frontend)/actions/get-product-for-searchbox"
import { Input } from "./ui/input"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { LazyImageCustomNavbar } from "./lazyImageCustomNavbar"

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