"use client"
import getAllNavbarContent, { SerializedCategory } from "@/app/(frontend)/actions/get-all-navbar-content";
import getAllNewProducts from "@/app/(frontend)/actions/get-all-new-products";
import { getHref } from "@/app/(frontend)/utils/getHref";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import SearchboxLegacy from "./searchboxold";
import '@/app/legacy/components/style/all-style.css'
import SearchLightboxOld from "./searchligthboxold";

export interface NewProduct {
  productId: string;
  image_url: string;
  name: string;
  href: string;
  navbarNotes: string;
}

export type MenuNode = {
  title: string;
  href: string;
  isNew?: boolean;
  image?: string;
  navbarNotes?: string;
  children?: MenuNode[];
};

function newProductToMenuNode(product: NewProduct): MenuNode {
  return {
    title: product.name,
    href: product.href,
    isNew: true,
    image: product.image_url,
    navbarNotes: product.navbarNotes,
  };
}

function toMenuNode(category: SerializedCategory): MenuNode {
  const products: MenuNode[] = (category.products ?? []).map((product) => ({
    title: product.name,
    href: `/products/${product.slug}`,
    isNew: product.isNewProduct,
    image: product.cover_img_url ?? undefined,
  }));

  return {
    title: category.displayName || category.name,
    href: `/${category.slug}`,
    children: [...category.children.map(toMenuNode), ...products],
  };
}

const TOP_LINKS: MenuNode[] = [
  { title: "Technical", href: "/technical" },
  { title: "Distributors", href: "/distributors" },
  { title: "Contact", href: "/contact" },
];

const TOP_LINKS_SBAUDIENCE: MenuNode[] = [
  { title: "Application", href: "/application" },
  { title: "Distributors", href: "/distributors" },
  { title: "Contact", href: "/contact" },
];

/* ------------------------------ dropdown item ----------------------------- */

function getBrandFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "default";
  if (parts[0] === "drivers") return "default";
  return parts[0];
}

function DropdownItem({ node, depth, parent }: { node: MenuNode; depth: number; parent?: string }) {
  const [open, setOpen] = useState(false);
  const [changeBrand, setChangeBrand] = useState(false);
  const pathname = usePathname()
  const [tempPathname, setTempPathname] = useState(getBrandFromPathname(pathname));
  const hasChildren = !!(node.children && node.children.length > 0);
  let parentRoute = ''
  if(parent !== undefined) {
    if(depth === 0) {
      parentRoute = node.href
    }
    else{
      parentRoute = parent + node.href
    }
  }
  if(node.href.startsWith('/products')) {
    parentRoute = node.href
  }
  useEffect(() => {
    const currentBrand = getBrandFromPathname(pathname);

    if (currentBrand !== tempPathname) {
      setTempPathname(currentBrand);
      setChangeBrand((prev) => !prev); // toggles true/false each time
    }
  }, [pathname]); // dependency is pathname but we gate by comparing brand
  return (
    <li
      style={depth === 0 ? 
        {
          position: "relative",
          listStyle: "none",
          display: "inline-block",
          verticalAlign: "middle",
        }
        : 
        {
          position: "relative",
          listStyle: "none",
          display: "block",
          verticalAlign: "middle",
        }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={pathname.includes('sbaudience') ? `/legacy/sbaudience${parentRoute}` : `/legacy${parentRoute}`}
        style={{
          background: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
          border: "1px solid transparent",
          color: open ? '#e6001b' : pathname.includes('sbaudience') ? '#ffffff' : '#000000',
          display: "block",
          fontSize: 14,
          lineHeight: "20px",
          padding: depth > 0 ? "9px 12px" : "12px 13px",
          textDecoration: "none",
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
        onFocus={() => setOpen(true)}
      >
        {node.title}
        {node.isNew ? <span style={{
          color: '#e6001b',
          fontSize: 11,
          fontWeight: "bold",
          paddingLeft: 8,
        }}>NEW</span> : null}
        {hasChildren ? <span style={{
          color: '#e6001b',
          fontWeight: "bold",
          marginLeft: 14,
        }}>{depth === 0 ? "v" : ">"}</span> : null}
      </a>
      {hasChildren && open ? (
        <ul
        style={{
          background: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
          border: "1px solid #708090",
          listStyle: "none",
          margin: 0,
          minWidth: 190,
          padding: "4px 0",
          position: "absolute",
          left: depth === 0 ? 0 : "100%",
          top: depth === 0 ? "100%" : -1,
          zIndex: 20,
          textAlign: "left",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
          {node.children!.map((child, i) => (
            <DropdownItem key={child.title + i} node={child} depth={depth + 1} parent={parentRoute}/>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function PlainItem({ node, pathname }: { node: MenuNode; pathname: string }) {
  const [hover, setHover] = useState(false);
  return (
    <li style={{
      position: "relative",
      listStyle: "none",
      display: "inline-block",
      verticalAlign: "middle",
    }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <a href={pathname.includes('sbaudience') ? `/sbaudience${node.href}` : node.href} style={{
        background: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
        border: "1px solid transparent",
        color: hover ? '#e6001b' : pathname.includes('sbaudience') ? '#ffffff' : '#000000',
        display: "block",
        fontSize: 14,
        lineHeight: "20px",
        padding: "12px 13px",
        textDecoration: "none",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}>
        {node.title}
      </a>
    </li>
  );
}

/* ------------------------------- mobile menu ------------------------------ */

function MobileNode({ node, depth, parent, pathname }: { node: MenuNode; depth: number; parent?: string; pathname: string }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!(node.children && node.children.length > 0);
  let parentRoute = ''
  if(parent !== undefined) {
    if(depth === 0) {
      parentRoute = node.href
    }
    else{
      parentRoute = parent + node.href
    }
  }
  if(node.href.startsWith('/products')) {
    parentRoute = node.href
  }
  return (
    <div
      style={{
        borderLeft: depth > 0 ? "2px solid #e6001b" : "none",
        paddingLeft: depth > 0 ? 10 : 0,
        background: depth > 0 ? pathname.includes('sbaudience') ? '#000000' : "#f5f5f5" : "transparent",
      }}
    >
      {hasChildren ? (
        <div
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            padding: "10px 8px",
            fontSize: 15,
            borderBottom: "1px solid #d7dce0",
            color: open ? '#e6001b' : pathname.includes('sbaudience') ? '#ffffff' : '#000000',
          }}
        >
          {node.title}
          <span style={{ float: "right", color: '#e6001b', fontWeight: "bold" }}>{open ? "-" : "+"}</span>
        </div>
      ) : (
        <a
          href={pathname.includes('sbaudience') ? `/legacy/sbaudience${parentRoute}` : `/legacy${parentRoute}`}
          style={{
            display: "block",
            padding: "10px 8px",
            fontSize: 15,
            textDecoration: "none",
            color: pathname.includes('sbaudience') ? '#ffffff' : '#000000',
            borderBottom: "1px solid #d7dce0",
          }}
        >
          {node.title}
          {node.isNew ? <span style={{
            color: '#e6001b',
            fontSize: 11,
            fontWeight: "bold",
            paddingLeft: 8,
          }}>NEW</span> : null}
        </a>
      )}
      {hasChildren && open ? (
        <div>
          <a
            href={pathname.includes('sbaudience') ? `/legacy/sbaudience${parentRoute}` : `/legacy${parentRoute}`}
            style={{
              display: "block",
              background: '#e6001b',
              color: '#ffffff',
              textAlign: "center",
              padding: 6,
              margin: "6px 8px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Show All {node.title}
          </a>
          {node.children!.map((child, i) => (
            <MobileNode key={child.title + i} node={child} depth={depth + 1} parent={parentRoute} pathname={pathname} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------- navbar --------------------------------- */

export default function NavbarLegacy() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<SerializedCategory[]>([])
  const [newProducts, setnewProductsMenu] = useState<NewProduct[]>([])
  const [newKits, setnewKitsMenu] = useState<NewProduct[]>([])
  const [height, setHeight] = useState<number>(700);
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false);
  const [navbarBg, setNavbarBg] = useState(false);
  const isSBAudience = pathname.includes('sbaudience');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const navbarData: SerializedCategory[] = await getAllNavbarContent(pathname)
        const [tempNewKits, tempNewProduct]: [NewProduct[], NewProduct[]] = await getAllNewProducts(pathname)
        setCategories(navbarData)
        setnewProductsMenu(tempNewProduct)
        setnewKitsMenu(tempNewKits)
        const update = () => setIsDesktop(window.innerWidth >= 1280);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
      } catch (error) {
        console.error('Error fetching navbar products:', error);
      } finally {
        // setLoading(false);
      }
    }
    fetchData();  
  }, []);

  useEffect(() => {
    // Function to update height
    if(window){
      const updateHeight = () => setHeight(window.innerHeight);

      // Set initial height
      updateHeight();

      // Listen for window resize events
      window.addEventListener("resize", updateHeight);

      // Cleanup event listener on unmount
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, []);

  const menuNodes = useMemo(() => {
    const categoryNodes = categories.map(toMenuNode);
    const newProductNodes = [
      ...newProducts.map(newProductToMenuNode),
      ...newKits.map(newProductToMenuNode),
    ];

    return [
      ...categoryNodes,
      ...(newProductNodes.length > 0
        ? [{ title: "New Products", href: "/new-products", children: newProductNodes }]
        : []),
    ];
  }, [categories, newProducts, newKits]);


  // Memoize the handler to prevent recreation
  const handleScroll = useCallback(() => {
    // setNavbarBg(window.scrollY > 0  || (isSBAudience && pathname !== '/sbaudience'));
    setNavbarBg(true);
  }, [isSBAudience, pathname]);

  // Debounce scroll events (fires max once per 100ms instead of 60+ times/sec)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
    
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 0);
    };

    handleScroll(); // Call immediately on mount
    window.addEventListener('scroll', debouncedScroll);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, [handleScroll]);

  // Memoize className computation
  const navClasses = useMemo(() => {
    const isFixed = height > 600;
    const baseClasses = `${isFixed ? 'fixed' : ''} w-dvw xl:px-16 lg:px-12 px-8 py-4 h-fit transition-all duration-200 ease-in-out`;
    const baseClasses2 = `${isFixed ? 'fixed' : ''} w-dvw xl:px-16 lg:px-12 px-8 py-4 h-fit transition-all duration-200 ease-in-out`;
      
    if (!navbarBg) {
      if (isSBAudience) {
        return `${baseClasses} text-background`;
      }
      else {
        return baseClasses;
      }
    }
    
    if (isSBAudience) {
      return `${baseClasses} bg-foreground shadow-lg shadow-foreground/30 text-background`;
    }
    
    return `${baseClasses} bg-background shadow-lg shadow-foreground/30`;
  }, [navbarBg, isSBAudience, height]);

  return (
    // <>
    // <div style={{
    //   background: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
    //   borderBottom: "2px solid #3f3f46",
    //   color: pathname.includes('sbaudience') ? '#ffffff' : '#000000',
    //   fontFamily: "Arial, Helvetica, sans-serif",
    //   position: height > 600 ? "fixed" : 'absolute',
    //   top: scrolled ?  0 : '32px',
    //   left: 0,
    //   zIndex: 1000,
    //   width: "100%",
    //   boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
    // }}>
    //   <div style={{
    //     margin: "0 auto",
    //     maxWidth: 1280,
    //     minHeight: 72,
    //     padding: "12px 24px",
    //     boxSizing: "border-box",
    //     display: "block",
    //     width: "100%",
    //   }}>
    //     <div style={{
    //       display: "table",
    //       width: "100%",
    //       tableLayout: "fixed"
    //     }}>
    //       {/* brand */}
    //       <div style={{
    //         display: "table-cell",
    //         verticalAlign: "middle",
    //         width: isDesktop ? "25%" : '50%' 
    //       }}>
    //         <a
    //           href={`/legacy${getHref(pathname, '')}`}
    //           className="legacy-brand"
    //         >
    //             <div className="legacy-brand-container">
    //                 <img
    //                     src={pathname.includes('sbaudience')
    //                         ? '/images/sbaudience/logo_sbaudience.png'
    //                         : pathname.includes('sbautomotive')
    //                         ? '/images/sbautomotive/logo_sbautomotive_black.webp'
    //                         : '/images/sbacoustics/logo_sbacoustics.png'}
    //                     className="legacy-brand-logo"
    //                     alt={
    //                         pathname.includes('sbaudience')
    //                             ? 'SB Audience Logo'
    //                             : pathname.includes('sbautomotive')
    //                             ? 'SB Automotive Logo'
    //                             : 'SB Acoustics Logo'
    //                     }
    //                     width={200}
    //                     height={50}
    //                     loading="eager"
    //                 />
    //             </div>
    //         </a>
    //       </div>

    //       {/* desktop menu */}
    //       {isDesktop ? (
    //         <div style={{ 
    //           display: "table-cell",
    //           verticalAlign: "middle",
    //           width: "50%", 
    //           position: "relative", 
    //           zIndex: 100,
    //         }}>
    //           <ul style={{
    //             listStyle: "none",
    //             margin: 0,
    //             padding: 0,
    //             whiteSpace: "nowrap",
    //             textAlign: "center",
    //             backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff'
    //           }}>
    //             {menuNodes.map((node, index) => (
    //               <DropdownItem key={node.href + index} node={node} depth={0} parent={node.href}/>
    //             ))}
    //             {(pathname.includes('sbaudience') ? TOP_LINKS_SBAUDIENCE : TOP_LINKS).map((link) => (
    //               <PlainItem key={link.href} node={link} pathname={pathname} />
    //             ))}
    //           </ul>
    //         </div>
    //       ) : (
    //         <div style={{ display: "table-cell", verticalAlign: "center", width: "50%", textAlign: "end" }}>
    //           <button
    //             type="button"
    //             onClick={() => setMobileOpen(!mobileOpen)}
    //             style={{
    //               background: '#ffffff',
    //               border: "1px solid #708090",
    //               color: '#000000',
    //               cursor: "pointer",
    //               fontSize: 14,
    //               padding: "8px 12px",
    //               fontFamily: "Arial, Helvetica, sans-serif",
    //             }}
    //           >
    //             {mobileOpen ? "Close" : "Menu"}
    //           </button>
    //         </div>
    //       )}

    //       {/* search */}
    //       <div style={{ width: "25%" }} className="navbar-mobile">
    //         <SearchboxLegacy changeBrand/>
    //       </div>
    //     </div>

    //     {/* mobile drawer */}
    //     {!isDesktop && mobileOpen ? (
    //       <div
    //         style={{
    //           borderTop: "1px solid #d7dce0",
    //           marginTop: 10,
    //           paddingTop: 6,
    //           // Keep an explicit height fallback for older Safari, which does not
    //           // understand `dvh` and may not create a scroll container from max-height alone.
    //           height: "calc(100vh - 84px)",
    //           maxHeight: "calc(100vh - 84px)",
    //           overflowY: "scroll",
    //           WebkitOverflowScrolling: "touch",
    //           overscrollBehavior: "contain",
    //         }}
    //       >
    //         <SearchLightboxOld changeBrand/>
    //         {menuNodes.map((node, index) => (
    //           <MobileNode key={node.href + index} node={node} depth={0}  parent={node.href} pathname={pathname}/>
    //         ))}
    //         {(pathname.includes('sbaudience') ? TOP_LINKS_SBAUDIENCE : TOP_LINKS).map((link) => (
    //           <MobileNode key={link.href} node={link} depth={0} parent={link.href} pathname={pathname}/>
    //         ))}
    //       </div>
    //     ) : null}
    //   </div>
    // </div>

    
    //   <div style={{
    //     position: height > 600 ? 'fixed' : 'absolute',
    //     top: scrolled ? '-32px' : '0px',
    //     left: '0px',
    //     zIndex: 50,
    //     width: '100%',
    //     display: 'flex',
    //     alignItems: 'flex-start',
    //     justifyContent: 'left'
    //   }}>
    //     <div className={`navbar-brand-choice-parent`} style={{
    //       backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff'
    //     }}>
    //       {pathname.includes('sbaudience') ? 
    //         <a href={'/'}>
    //           <div style={{
    //             cursor: 'pointer'
    //           }}>
    //             <div style={{
    //               display: 'flex',
    //               flexDirection: 'column',
    //               gap: '4px'
    //             }}>
    //               <div style={{
    //                 height: '20px'
    //               }}>
    //                 <img
    //                   src={'/images/sbacoustics/logo_sbacoustics_white_clean.webp'}
    //                   alt='SB Acoustics Logo'
    //                   width={150}
    //                   height={40}
    //                   style={{
    //                     height: '100%',
    //                     width: 'auto'
    //                   }}
    //                 />
    //                 </div>
    //             </div>
    //           </div>
    //         </a>
    //         :
    //         pathname.includes('sbautomotive') ? 
    //         <>
    //           <a href={'/'}>
    //           <div style={{
    //             cursor: 'pointer'
    //           }}>
    //             <div style={{
    //               display: 'flex',
    //               flexDirection: 'column',
    //               gap: '4px'
    //             }}>
    //               <div style={{
    //                 height: '20px'
    //               }}>
    //                   <img
    //                     src={'/images/sbacoustics/logo_sbacoustics_black_clean.webp'}
    //                     alt='SB Acoustics Logo'
    //                     width={150}
    //                     height={40}
    //                     style={{
    //                       height: '100%',
    //                       width: 'auto'
    //                     }}
    //                   />
    //                   </div>
    //               </div>
    //             </div>
    //           </a>
    //           <a href={'/sbaudience'}>
    //             <div style={{
    //               cursor: 'pointer'
    //             }}>
    //               <div style={{
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //                 gap: '4px'
    //               }}>
    //                 <div style={{
    //                   height: '20px'
    //                 }}>
    //                   <img
    //                     src={'/images/sbaudience/logo_sbaudience_black.webp'}
    //                     alt='SB Audience Logo'
    //                     width={150}
    //                     height={40}
    //                     style={{
    //                       height: '100%',
    //                       width: 'auto'
    //                     }}
    //                   />
    //                   </div>
    //               </div>
    //             </div>
    //           </a>
    //         </>
    //         :
    //         <a href={'/sbaudience'}>
    //             <div style={{
    //               cursor: 'pointer'
    //             }}>
    //               <div style={{
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //                 gap: '4px'
    //               }}>
    //                 <div style={{
    //                   height: '20px'
    //                 }}>
    //                 <img
    //                   src={'/images/sbaudience/logo_sbaudience_black.webp'}
    //                   alt='SB Audience Logo'
    //                   width={150}
    //                   height={40}
    //                   style={{
    //                     height: '100%',
    //                     width: 'auto'
    //                   }}
    //                 />
    //                 </div>
    //             </div>
    //           </div>
    //         </a>
    //       }
    //     </div>
    //   </div>
    
    // </>



        <>
    <div style={{
      position: height > 600 ? 'fixed' : 'absolute',
      left : 0,
      zIndex: 40,
      backgroundColor: 'transparent',
      top: scrolled ? '0px' : '32px',
      borderStyle: scrolled ? 'none' : 'block',
      borderTopWidth: scrolled ? '0px' : '1px'
    }}>
    <nav
  className="navbar-main-nav-parent"
  style={{
    position: height  > 600 ? 'fixed' : 'static',
    width: '100%',
    paddingTop: '14px',
    paddingBottom: '14px',
    height: 'fit-content',
    ...(navbarBg
      ? isSBAudience
        ? {
            backgroundColor: '#000000',
            boxShadow: '0 10px 15px -3px color-mix(in srgb, #000000 30%, transparent)',
            color: '#ffffff',
          }
        : {
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 15px -3px color-mix(in srgb, #000000 30%, transparent)',
          }
      : isSBAudience
        ? {
            color: '#ffffff',
          }
        : {}),
  }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* <div style={{
          display: "table",
          width: "100%",
          tableLayout: "fixed"
        }}> */}

          {/* brand */}
          {/* <div style={{
            display: "table-cell",
            verticalAlign: "middle",
            width: isDesktop ? "25%" : '50%' 
          }}>
            <a
              href={`/legacy${getHref(pathname, '')}`}
              className="legacy-brand"
            >
                <div className="legacy-brand-container">
                    <img
                        src={pathname.includes('sbaudience')
                            ? '/images/sbaudience/logo_sbaudience.png'
                            : pathname.includes('sbautomotive')
                            ? '/images/sbautomotive/logo_sbautomotive_black.webp'
                            : '/images/sbacoustics/logo_sbacoustics.png'}
                        className="legacy-brand-logo"
                        alt={
                            pathname.includes('sbaudience')
                                ? 'SB Audience Logo'
                                : pathname.includes('sbautomotive')
                                ? 'SB Automotive Logo'
                                : 'SB Acoustics Logo'
                        }
                        width={200}
                        height={50}
                        loading="eager"
                    />
                </div>
            </a>
          </div> */}
          <div style={{
            width: '25%',
            display: 'flex'
          }}>
            <a
              href={getHref(pathname, '')}
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div 
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                maxWidth: '150px'
              }}>
                <img
                  src={pathname.includes('sbaudience') ? 
                      '/images/sbaudience/logo_sbaudience.webp' : pathname.includes('sbautomotive') ? '/images/sbautomotive/logo_sbautomotive_black.webp' : '/images/sbacoustics/logo_sbacoustics_black_clean.webp'}
                  style={{
                    cursor: 'pointer',
                    maxWidth: '150px',
                    height: '32px',
                    zIndex: 101,
                    objectFit: 'contain'
                  }}
                  alt={pathname.includes('sbaudience') ? "SB Audience Logo" : pathname.includes('sbautomotive') ? "SB Automotive Logo" : "SB Acoustics Logo"}
                  width={200}
                  height={50}
                  loading="eager"
                />  
              </div>
            </a>
          </div>



          <div className="navbar-main-nav-main-menu">
            <ul style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              whiteSpace: "nowrap",
              textAlign: "center",
              backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff'
            }}>
              {menuNodes.map((node, index) => (
                <DropdownItem key={node.href + index} node={node} depth={0} parent={node.href}/>
              ))}
              {(pathname.includes('sbaudience') ? TOP_LINKS_SBAUDIENCE : TOP_LINKS).map((link) => (
                <PlainItem key={link.href} node={link} pathname={pathname} />
              ))}
            </ul>
          </div>


          
            {/* MOBILE MENU */}
          <div className={`navbar-main-nav-searchbox`}>
            <SearchboxLegacy changeBrand/>
          </div>

          {/* search */}
          <div className="navbar-main-nav-mobile-button">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: '#ffffff',
                border: "1px solid #708090",
                color: '#000000',
                cursor: "pointer",
                fontSize: 14,
                padding: "8px 12px",
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
            {!isDesktop && mobileOpen ? (
              <div
                style={{
                  borderTop: "1px solid #d7dce0",
                  marginTop: 10,
                  paddingTop: 6,
                  position: 'absolute',
                  left: 0,
                  top: '56px',
                  // Keep an explicit height fallback for older Safari, which does not
                  // understand `dvh` and may not create a scroll container from max-height alone.
                  height: "calc(100vh - 84px)",
                  width: '100%',
                  backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff',
                  maxHeight: "calc(100vh - 84px)",
                  overflowY: "scroll",
                  WebkitOverflowScrolling: "touch",
                  overscrollBehavior: "contain",
                }}
              >
                <SearchLightboxOld changeBrand/>
                {menuNodes.map((node, index) => (
                  <MobileNode key={node.href + index} node={node} depth={0}  parent={node.href} pathname={pathname}/>
                ))}
                {(pathname.includes('sbaudience') ? TOP_LINKS_SBAUDIENCE : TOP_LINKS).map((link) => (
                  <MobileNode key={link.href} node={link} depth={0} parent={link.href} pathname={pathname}/>
                ))}
              </div>
            ) : null}
          </div>
        {/* </div> */}

        {/* mobile drawer */}
      </div>
      </nav>
    </div>

    
      <div style={{
        position: height > 600 ? 'fixed' : 'absolute',
        top: scrolled ? '-32px' : '0px',
        left: '0px',
        zIndex: 50,
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'left'
      }}>
        <div className={'navbar-brand-choice-parent'} style={{
          backgroundColor: pathname.includes('sbaudience') ? '#000000' : '#ffffff'
        }}>
          {pathname.includes('sbaudience') ? 
            <a href={'/'}>
              <div style={{
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    height: '20px'
                  }}>
                    <img
                      src={'/images/sbacoustics/logo_sbacoustics_white_clean.webp'}
                      alt='SB Acoustics Logo'
                      width={150}
                      height={40}
                      style={{
                        height: '100%',
                        width: 'auto'
                      }}
                    />
                    </div>
                </div>
              </div>
            </a>
            :
            pathname.includes('sbautomotive') ? 
            <>
              <a href={'/'}>
              <div style={{
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    height: '20px'
                  }}>
                      <img
                        src={'/images/sbacoustics/logo_sbacoustics_black_clean.webp'}
                        alt='SB Acoustics Logo'
                        width={150}
                        height={40}
                        style={{
                          height: '100%',
                          width: 'auto'
                        }}
                      />
                      </div>
                  </div>
                </div>
              </a>
              <a href={'/sbaudience'}>
                <div style={{
                  cursor: 'pointer'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{
                      height: '20px'
                    }}>
                      <img
                        src={'/images/sbaudience/logo_sbaudience_black.webp'}
                        alt='SB Audience Logo'
                        width={150}
                        height={40}
                        style={{
                          height: '100%',
                          width: 'auto'
                        }}
                      />
                      </div>
                  </div>
                </div>
              </a>
            </>
            :
            <a href={'/sbaudience'}>
                <div style={{
                  cursor: 'pointer'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{
                      height: '20px'
                    }}>
                    <img
                      src={'/images/sbaudience/logo_sbaudience_black.webp'}
                      alt='SB Audience Logo'
                      width={150}
                      height={40}
                      style={{
                        height: '100%',
                        width: 'auto'
                      }}
                    />
                    </div>
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    
    </>
  );
}
