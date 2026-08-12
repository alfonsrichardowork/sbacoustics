"use client"

import { usePathname } from 'next/navigation';
import SearchBox from './searchbox';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from './ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { NavbarComponents, NavbarProducts, NewProduct, PriorityMenu } from '@/app/(frontend)/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordionmobilemenu';
import getAllNewProducts from '@/app/(frontend)/actions/get-all-new-products';
import SearchBoxNavbar from './searchboxnavbar';
import { EmptyMenu } from '@/app/(frontend)/utils/navbar-content';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getHref } from '@/app/(frontend)/utils/getHref';
import getAllNavbarContent, { SerializedCategory } from '@/app/(frontend)/actions/get-all-navbar-content';
import SearchLightbox from './searchligthbox';
import { LazyImageCustomNavbar } from './lazyImageCustomNavbar';
import { buildNavbarMenus, menuKey } from './build-navbar-menu';

const styledDropdown = "text-sm px-1 py-2 text-foreground"


type MobileMenuProps = {
  items: NavbarComponents[];
  childMaps: Record<string, NavbarComponents[]>[];
  pathname: string;
  depth?: number;
  loading?: boolean;
};

function MobileMenuItems({ items, childMaps, pathname, depth = 0, loading = false }: MobileMenuProps) {
  const childrenMap = childMaps[depth] ?? {};
  const levelStyles = [
    "border-primary",
    "border-primary",
    "border-primary",
    "border-primary",
  ];
  const levelStyle = levelStyles[Math.min(depth, levelStyles.length - 1)];

  return (
    loading ? 
      pathname.includes('sbaudience') ?
        <Accordion type="single" collapsible className={`w-full rounded-lg ${depth !== 0 && `border-l-2 pl-2 bg-zinc-100/10 ${levelStyle}`}`}>
          <AccordionItem value='Drivers'>
            <AccordionTrigger className={`px-2 hover:text-primary ${levelStyle}`}>
              Drivers
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      :
        <>
          <Accordion type="single" collapsible className={`w-full rounded-lg ${depth !== 0 && `border-l-2 pl-2 bg-zinc-700/5 ${levelStyle}`}`}>
            <AccordionItem value='Drivers'>
              <AccordionTrigger className={`px-2 hover:text-primary ${levelStyle}`}>
                Drivers
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className={`w-full rounded-lg ${depth !== 0 && `border-l-2 pl-2 bg-zinc-700/5 ${levelStyle}`}`}>
            <AccordionItem value='Kits'>
              <AccordionTrigger className={`px-2 hover:text-primary ${levelStyle}`}>
                Kits
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </>
    :
    <Accordion type="single" collapsible className={`w-full rounded-lg ${depth !== 0 && `border-l-2 pl-2 ${pathname.includes('sbaudience') ? 'bg-zinc-100/10' : 'bg-zinc-700/5'} ${levelStyle}`}`}>
      {items.map((item, index) => {
        const children = childrenMap[menuKey(item.title, item.parent)] ?? [];
        const hasChildren = children.length > 0;
        const label = item.newProd ? (
          <span>{item.title.split(" / ")[0]} <span className="pl-2 text-primary">NEW</span></span>
        ) : item.title;

        return (
          <AccordionItem key={`${item.title}-${item.href}-${index}`} value={`${item.title}-${index}`}>
            {hasChildren ? (
              <>
                <AccordionTrigger className={`px-2 hover:text-primary ${levelStyle}`}>{label}</AccordionTrigger>
                <AccordionContent>
                  <Link href={getHref(pathname, item.href)} className="w-full">
                    <SheetClose className="flex w-full justify-center rounded-xl bg-primary p-1 text-center text-primary-foreground">
                      Show All {item.title === "Widebanders / Full Ranges" ? "Widebanders" : item.title}
                    </SheetClose>
                  </Link>
                  <MobileMenuItems items={children} childMaps={childMaps} pathname={pathname} depth={depth + 1} />
                </AccordionContent>
              </>
            ) : (
              <Link href={getHref(pathname, item.href)}>
                <SheetClose className="flex w-full items-center gap-2 p-2 text-left hover:text-primary">
                  {item.url ? (
                    <LazyImageCustomNavbar
                      src={item.url.startsWith("/uploads/") ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url}
                      alt={item.title}
                      width={100}
                      height={100}
                      classname="w-auto max-h-14 object-contain"
                      lazy
                      containerheight="h-14"
                      containerwidth="w-14"
                      pathname={pathname}
                    />
                  ) : null}
                  {label}
                </SheetClose>
              </Link>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function MobileNewProducts({ products, pathname }: { products: NewProduct[]; pathname: string }) {
  return (
    <div className={`flex flex-col gap-1 rounded-lg border-l-2 border-primary pl-2 ${pathname.includes('sbaudience') ? 'bg-zinc-100/10' : 'bg-zinc-700/5'}`}>
      {products.map((product) => (
        <Link key={product.name} href={getHref(pathname, product.href)}>
          <SheetClose className="flex w-full items-center gap-2 p-2 text-left hover:text-primary">
            <LazyImageCustomNavbar
              src={product.image_url.startsWith("/uploads/") ? `${process.env.NEXT_PUBLIC_ROOT_URL}${product.image_url}` : product.image_url}
              alt={product.name}
              width={100}
              height={100}
              classname="w-auto max-h-14 object-contain"
              lazy
              containerheight="h-14"
              containerwidth="w-14"
              pathname={pathname}
            />
            <span>{product.name} <span className="pl-2 text-primary">NEW</span></span>
          </SheetClose>
        </Link>
      ))}
    </div>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <SheetClose className="w-full px-2 py-2 text-left text-base hover:text-primary">{children}</SheetClose>
    </Link>
  );
}

function Navbar() {

  const [driversubMenu, setDriversSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubsubMenu, setDriversSubSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubsubsubMenu, setDriversSubSubSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubsubsubsubMenu, setDriversSubSubSubSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubMenuUrl, setDriversSubMenuUrl] = useState<string>('')
  const [driversubsubMenuUrl, setDriversSubSubMenuUrl] = useState<string>('')
  const [driversubsubsubMenuUrl, setDriversSubSubSubMenuUrl] = useState<string>('')
  const [driversubsubsubsubMenuUrl, setDriversSubSubSubSubMenuUrl] = useState<string>('')
  const [activedriverhovered, setactivedriverhovered] = useState<string>('')
  const [pictureSlugUrl, setPictureSlugUrl] = useState<string>('')
  const [pictureDesc, setPictureDesc] = useState<string>('')
  const [nameForHoveredPicture, setnameForHoveredPicture] = useState<string>('')
  const [loading, setLoading] = useState(true);
  const [openedContentForBg, setOpenedContentForBg] = useState(false);
  
  //FOR SEARCHING SUB MENU CONTENT
  const [driverSubMenuMapping, setDriverSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});
  const [driverSubSubMenuMapping, setDriverSubSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});
  const [driverSubSubSubMenuMapping, setDriverSubSubSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});
  const [driverSubSubSubSubMenuMapping, setDriverSubSubSubSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});


  //NEW PRODUCTS
  const [newProductsMenu, setnewProductsMenu] = useState<NewProduct[]>([])
  const [newKitsMenu, setnewKitsMenu] = useState<NewProduct[]>([])

  
  const pathname = usePathname()
  const [hoveredDriverSubMenu, setHoveredDriverSubMenu] = useState("");
  const [hoveredDriverSubSubMenu, setHoveredDriverSubSubMenu] = useState("");
  const [hoveredDriverSubSubSubMenu, setHoveredDriverSubSubSubMenu] = useState("");
  const [height, setHeight] = useState<number>(700);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [tempPathname, setTempPathname] = useState(getBrandFromPathname(pathname));
  const [changeBrand, setChangeBrand] = useState(false);
  const [firstMenu, setFirstMenu] = useState<NavbarComponents[]>([]);

  const [navbarBg, setNavbarBg] = useState(false);
  const isSBAudience = pathname.includes('sbaudience');


  useEffect(() => { 
    const fetchData = async () => {
      try {
        const navbarData: SerializedCategory[] = await getAllNavbarContent(pathname)
        const [tempNewKits, tempNewProduct]: [NewProduct[], NewProduct[]] = await getAllNewProducts(pathname)

        const menus = buildNavbarMenus(navbarData)
        setFirstMenu(menus.firstMenu)
        setDriverSubMenuMapping(menus.subMenuMapping)
        setDriverSubSubMenuMapping(menus.subSubMenuMapping)
        setDriverSubSubSubMenuMapping(menus.subSubSubMenuMapping)
        setDriverSubSubSubSubMenuMapping(menus.subSubSubSubMenuMapping)

        setDriversSubMenu(EmptyMenu)
        setDriversSubSubMenu(EmptyMenu)
        setDriversSubSubSubMenu(EmptyMenu)
        setDriversSubSubSubSubMenu(EmptyMenu)

        setnewProductsMenu(tempNewProduct)
        setnewKitsMenu(tempNewKits)
      } catch (error) {
        console.error('Error fetching navbar products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();  
}, [changeBrand]);

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

  function getBrandFromPathname(pathname: string) {
    const parts = pathname.split("/").filter(Boolean); // remove empty strings
    // if there’s no part → default brand
    if (parts.length === 0) return "default";
    // if first part is 'drivers' → also default brand
    if (parts[0] === "drivers") return "default";
    // else first part is brand name
    return parts[0];
  }

  useEffect(() => {
    const currentBrand = getBrandFromPathname(pathname);

    if (currentBrand !== tempPathname) {
      setTempPathname(currentBrand);
      setChangeBrand((prev) => !prev); // toggles true/false each time
    }
  }, [pathname]); // dependency is pathname but we gate by comparing brand


  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleResize = (e: MediaQueryListEvent) => {
      setIsLgScreen(e.matches);
    };
    setIsLgScreen(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);


  

  

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        setOpenedContentForBg(false);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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

  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 0);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);


const searchSubMenu = useCallback((title: string, parent: string) => {
  setDriversSubMenu(driverSubMenuMapping[menuKey(title, parent)] || EmptyMenu)
  setDriversSubSubMenu(EmptyMenu)
  setDriversSubSubSubMenu(EmptyMenu)
  setDriversSubSubSubSubMenu(EmptyMenu)
}, [driverSubMenuMapping])

const searchSubSubMenu = useCallback((title: string, parent: string) => {
  if (!parent) return // leaf row: nothing to drill into
  setDriversSubSubMenu(driverSubSubMenuMapping[menuKey(title, parent)] || EmptyMenu)
  setDriversSubSubSubMenu(EmptyMenu)
  setDriversSubSubSubSubMenu(EmptyMenu)
  setHoveredDriverSubMenu(title)
  setactivedriverhovered('')
}, [driverSubSubMenuMapping])

const searchSubSubSubMenu = useCallback((title: string, parent: string) => {
  if (!parent) return
  setDriversSubSubSubMenu(driverSubSubSubMenuMapping[menuKey(title, parent)] || EmptyMenu)
  setDriversSubSubSubSubMenu(EmptyMenu)
  setHoveredDriverSubSubMenu(title)
  setactivedriverhovered('')
}, [driverSubSubSubMenuMapping])

const searchSubSubSubSubMenu = useCallback((title: string, parent: string) => {
  if (!parent) return
  setDriversSubSubSubSubMenu(driverSubSubSubSubMenuMapping[menuKey(title, parent)] || EmptyMenu)
  setHoveredDriverSubSubSubMenu(title)
  setactivedriverhovered('')
}, [driverSubSubSubSubMenuMapping]) 

  return ( 
    <>
    <div
      className={`
        ${height > 600 ? 'fixed' : 'absolute'}
        left-0
        z-40
        bg-transparent
        transition-all
        duration-300
        ease-in-out
        ${scrolled ? 'top-0 border-none' : 'top-8 border-t'}
      `}
    >
    <nav className={navClasses}>
      <div className="flex items-center justify-between">
        <div className="w-1/4 flex">
          <Link
            href={getHref(pathname, '')}
            className="flex items-center"
          >
            <div className="relative overflow-hidden flex items-center justify-center h-full max-w-[150px]">
              <Image
                src={pathname.includes('sbaudience') ? 
                    '/images/sbaudience/logo_sbaudience.webp' : pathname.includes('sbautomotive') ? '/images/sbautomotive/logo_sbautomotive_black.webp' : '/images/sbacoustics/logo_sbacoustics_black_clean.webp'}
                className="cursor-pointer max-w-[150px] h-8 z-101 object-contain"
                alt={pathname.includes('sbaudience') ? "SB Audience Logo" : pathname.includes('sbautomotive') ? "SB Automotive Logo" : "SB Acoustics Logo"}
                width={200}
                height={50}
                priority
              />  
            </div>
          </Link>
        </div>
        <div className="w-1/2 hidden xl:flex justify-center relative z-100">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center">
              {pathname.includes('sbautomotive') &&
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink href={getHref(pathname, 'about')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                      <div className="p-0 relative z-101">
                        About Us
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href={getHref(pathname, 'technology')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                      <div className="p-0 relative z-101">
                        Technology
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              }
              {loading ?
                pathname.includes("sbaudience")? 
                  <NavigationMenuItem>
                    <div className="p-0 relative z-101">
                      <NavigationMenuTrigger
                        className={navigationMenuTriggerStyle().concat(
                          ` bg-transparent ${
                            navbarBg && pathname.includes('sbaudience') ? 
                              openedContentForBg ? 
                              'text-background' 
                              : 
                              'text-background'
                            : 
                            pathname.includes('sbaudience') ? 
                            'text-background' 
                            :
                            'text-foreground'
                          } hover:text-primary z-101 relative`
                        )}
                      >
                        Drivers
                      </NavigationMenuTrigger>
                    </div>
                  </NavigationMenuItem>
                :
                  <>
                    <NavigationMenuItem>
                      <div className="p-0 relative z-101">
                        <NavigationMenuTrigger
                          className={navigationMenuTriggerStyle().concat(
                            ` bg-transparent ${
                              navbarBg && pathname.includes('sbaudience') ? 
                                openedContentForBg ? 
                                'text-background' 
                                : 
                                'text-background'
                              : 
                              pathname.includes('sbaudience') ? 
                              'text-background' 
                              :
                              'text-foreground'
                            } hover:text-primary z-101 relative`
                          )}
                        >
                          Drivers
                        </NavigationMenuTrigger>
                      </div>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <div className="p-0 relative z-101">
                        <NavigationMenuTrigger
                          className={navigationMenuTriggerStyle().concat(
                            ` bg-transparent ${
                              navbarBg && pathname.includes('sbaudience') ? 
                                openedContentForBg ? 
                                'text-background' 
                                : 
                                'text-background'
                              : 
                              pathname.includes('sbaudience') ? 
                              'text-background' 
                              :
                              'text-foreground'
                            } hover:text-primary z-101 relative`
                          )}
                        >
                          Kits
                        </NavigationMenuTrigger>
                      </div>
                    </NavigationMenuItem>
                  </>
              : firstMenu && firstMenu.length > 0 && firstMenu.map((val, index) =>
              <NavigationMenuItem key={index}>
                <Link href={getHref(pathname, val.href)} passHref>
                  <div className="p-0 relative z-101">
                    <NavigationMenuTrigger
                      className={navigationMenuTriggerStyle().concat(
                        ` bg-transparent ${
                          navbarBg && pathname.includes('sbaudience') ? 
                            openedContentForBg ? 
                            'text-background' 
                            : 
                            'text-background'
                          : 
                          pathname.includes('sbaudience') ? 
                          'text-background' 
                          :
                          'text-foreground'
                        } hover:text-primary z-101 relative`
                      )}
                      onMouseLeave={() => setOpenedContentForBg(false)}
                      onMouseEnter={() => {
                        if (val) {
                          searchSubMenu(val.title, val.parent)
                          setDriversSubMenu(driverSubMenuMapping[val.title.concat('-', val.parent)] || EmptyMenu);
                        } else {
                          setDriversSubMenu(EmptyMenu);
                        }
                        setHoveredDriverSubMenu("");
                        setHoveredDriverSubSubMenu("");
                        setHoveredDriverSubSubSubMenu("");
                        setactivedriverhovered("");
                        setDriversSubSubMenu(EmptyMenu);
                        setDriversSubSubSubMenu(EmptyMenu);
                        setDriversSubSubSubSubMenu(EmptyMenu);
                        setDriversSubMenuUrl("");
                        setDriversSubSubMenuUrl("");
                        setDriversSubSubSubMenuUrl("");
                        setDriversSubSubSubSubMenuUrl("");
                        setOpenedContentForBg(true);
                      }}
                    >
                      {pathname.includes('sbautomotive') ? 'Products' : val.title}
                    </NavigationMenuTrigger>
                  </div>
                </Link>

                  <NavigationMenuContent
                    className={`relative z-40 ${
                      pathname.includes('sbaudience') ? 'bg-foreground' : 'bg-background'
                    }`}
                    onMouseLeave={() => setOpenedContentForBg(false)}
                    onMouseEnter={() => setOpenedContentForBg(true)}
                  >
                    <div className="xl:pl-[72px] xl:pr-[72px] lg:pl-[56px] lg:pr-[56px] px-8 py-4 pt-20">
                      <SearchBoxNavbar changeBrand />
                    </div>

                    <div className="grid grid-cols-5 w-screen xl:px-16 lg:px-12 px-8 py-4 h-[550px]">

                      {/* FIRST MENU
                          driversubMenu
                      */}
                      {driversubMenu &&
                        driversubMenu.length > 0 &&
                        driversubsubMenu &&
                        driversubsubMenu.length > 0 && (
                          <div
                            className={`overflow-y-auto overflow-x-hidden border-r-2 transform transition-all z-30 ${
                              pathname.includes("sbaudience")
                                ? "bg-foreground"
                                : "bg-background"
                            } ${
                              driversubMenu[0]?.title === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            } ${
                              driversubsubMenu[0]?.title !== ""
                                ? ""
                                : driversubMenuUrl === ""
                                  ? "border-transparent"
                                  : ""
                            }`}
                          >
                            <ul className="gap-1 p-1">
                              {driversubMenu.map((products, index) => (
                                <div
                                  key={index}
                                  onMouseEnter={() =>
                                    searchSubSubMenu(products.title, products.parent)
                                  }
                                  className={`px-2 transform duration-200 ${
                                    hoveredDriverSubMenu === products.title
                                      ? "translate-x-2"
                                      : ""
                                  }`}
                                >
                                  {products.parent === "" ? (
                                    <NavigationMenuLink
                                      href={getHref(pathname, products.href)}
                                    >
                                      <div
                                        className={`${styledDropdown} hover:text-primary ${
                                          activedriverhovered === products.title
                                            ? "text-primary"
                                            : pathname.includes("sbaudience")
                                              ? "text-white"
                                              : ""
                                        } ${
                                          products.tempAllFinished &&
                                          products.tempAllFinished === true &&
                                          "text-green-500"
                                        }`}
                                        onMouseEnter={() => {
                                          setDriversSubMenuUrl(products.url);
                                          setPictureSlugUrl(products.href);
                                          setPictureDesc(products.imageDesc);
                                          setactivedriverhovered(products.title);
                                          setDriversSubSubMenu(EmptyMenu);
                                          setHoveredDriverSubMenu("");
                                          setDriversSubSubMenuUrl("");
                                          setDriversSubSubSubMenuUrl("");
                                          setDriversSubSubSubSubMenuUrl("");
                                        }}
                                      >
                                        {products.newProd ? (
                                          <>
                                            {products.title.split(" / ")[0]}{" "}
                                            <div className="inline-flex text-primary">
                                              NEW
                                            </div>
                                          </>
                                        ) : (
                                          products.title
                                        )}
                                      </div>
                                    </NavigationMenuLink>
                                  ) : (
                                    <NavigationMenuLink
                                      href={getHref(pathname, products.href)}
                                    >
                                      <div
                                        className={`${styledDropdown} flex justify-between items-center align-middle ${
                                          hoveredDriverSubMenu === products.title
                                            ? "text-primary"
                                            : pathname.includes("sbaudience")
                                              ? "text-white"
                                              : ""
                                        }`}
                                        onMouseEnter={() => {
                                          setDriversSubSubMenuUrl("");
                                          setDriversSubSubSubMenuUrl("");
                                          setDriversSubSubSubSubMenuUrl("");
                                          setactivedriverhovered("");
                                        }}
                                      >
                                        {products.title}
                                        <ChevronRight
                                          size={15}
                                          className={`pb-1 ${
                                            hoveredDriverSubMenu === products.title
                                              ? "text-primary"
                                              : ""
                                          }`}
                                        />
                                      </div>
                                    </NavigationMenuLink>
                                  )}
                                </div>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* SECOND MENU
                          driversubsubMenu
                      */}
                      {driversubsubMenu &&
                        driversubsubMenu.length > 0 && (
                          <div
                            className={`overflow-y-auto overflow-x-hidden border-r-2 transform transition-all z-20 ${
                              pathname.includes("sbaudience")
                                ? "bg-foreground"
                                : "bg-background"
                            } ${
                              driversubMenuUrl === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            } ${
                              driversubsubMenu[0]?.title === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            } ${
                              driversubsubsubMenu[0]?.title !== ""
                                ? ""
                                : driversubsubMenuUrl === ""
                                  ? "border-transparent"
                                  : ""
                            }`}
                          >
                            <ul className="gap-1 p-1">
                              {driversubsubMenu.map((products, index) => (
                                <div
                                  key={index}
                                  onMouseEnter={() =>
                                    searchSubSubSubMenu(products.title, products.parent)
                                  }
                                  className={`px-2 transform duration-200 ${
                                    hoveredDriverSubSubMenu === products.title
                                      ? "translate-x-2"
                                      : ""
                                  }`}
                                >
                                  {products.parent === "" ? (
                                    products.title !== "" ? (
                                      <NavigationMenuLink
                                        href={getHref(pathname, products.href)}
                                      >
                                        <div
                                          className={`${styledDropdown} hover:text-primary ${
                                            activedriverhovered === products.title
                                              ? "text-primary"
                                              : pathname.includes("sbaudience")
                                                ? "text-white"
                                                : ""
                                          } ${
                                            products.tempAllFinished &&
                                            products.tempAllFinished === true &&
                                            "text-green-500"
                                          }`}
                                          onMouseEnter={() => {
                                            setDriversSubSubMenuUrl(products.url);
                                            setPictureSlugUrl(products.href);
                                            setPictureDesc(products.imageDesc);
                                            setactivedriverhovered(products.title);
                                            setDriversSubSubSubMenu(EmptyMenu);
                                            setDriversSubSubSubSubMenu(EmptyMenu);
                                            setDriversSubSubSubSubMenuUrl("");
                                            setHoveredDriverSubSubMenu("");
                                            setnameForHoveredPicture(products.title);
                                          }}
                                        >
                                          {products.newProd ? (
                                            <>
                                              {products.title.split(" / ")[0]}{" "}
                                              <div className="inline-flex text-primary">
                                                NEW
                                              </div>
                                            </>
                                          ) : (
                                            products.title
                                          )}
                                        </div>
                                      </NavigationMenuLink>
                                    ) : (
                                      driversubMenuUrl !== "" && (
                                        <NavigationMenuLink
                                          href={getHref(pathname, pictureSlugUrl)}
                                          className={`${pathname.includes("sbaudience") ? "text-white" : ""} relative overflow-hidden block text-center items-center justify-center h-full w-50`}
                                        >
                                          <div
                                            onMouseEnter={() =>
                                              setactivedriverhovered(
                                                nameForHoveredPicture
                                              )
                                            }
                                          >
                                            <LazyImageCustomNavbar
                                              src={
                                                driversubMenuUrl.startsWith("/uploads/")
                                                  ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubMenuUrl}`
                                                  : driversubMenuUrl
                                              }
                                              alt={activedriverhovered}
                                              classname="object-contain max-h-40 w-auto"
                                              width={500}
                                              height={500}
                                              lazy
                                              containerheight="h-40"
                                              containerwidth="w-40"
                                              pathname={pathname}
                                            />
                                          </div>
                                          {pictureDesc}
                                        </NavigationMenuLink>
                                      )
                                    )
                                  ) : (
                                    <NavigationMenuLink
                                      href={getHref(pathname, products.href)}
                                    >
                                      <div
                                        className={`${styledDropdown} flex justify-between items-center align-middle ${
                                          hoveredDriverSubSubMenu === products.title
                                            ? "text-primary"
                                            : pathname.includes("sbaudience")
                                              ? "text-white"
                                              : ""
                                        }`}
                                        onMouseEnter={() => {
                                          setDriversSubSubSubMenuUrl("");
                                          setDriversSubSubSubSubMenuUrl("");
                                          setactivedriverhovered("");
                                        }}
                                      >
                                        {products.title}
                                        <ChevronRight
                                          size={15}
                                          className={`pb-1 ${
                                            hoveredDriverSubSubMenu === products.title
                                              ? "text-primary"
                                              : ""
                                          }`}
                                        />
                                      </div>
                                    </NavigationMenuLink>
                                  )}
                                </div>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* THIRD MENU
                          driversubsubsubMenu
                      */}
                      {driversubsubsubMenu &&
                        driversubsubsubMenu.length > 0 && (
                          <div
                            className={`overflow-y-auto overflow-x-hidden px-2 transform transition-all border-r-2 z-10 ${
                              pathname.includes("sbaudience")
                                ? "bg-foreground"
                                : "bg-background"
                            } ${
                              driversubsubMenuUrl === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            } ${
                              driversubsubsubMenu[0]?.title === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            } ${
                              driversubsubsubsubMenu[0]?.title !== ""
                                ? ""
                                : driversubsubsubMenuUrl === ""
                                  ? "border-transparent"
                                  : ""
                            }`}

                          >
                            <ul className="gap-1 p-1">
                              {driversubsubsubMenu.map((products, index) => (
                                <div
                                  key={index}
                                  onMouseEnter={() =>
                                    searchSubSubSubSubMenu(products.title, products.parent)
                                  }
                                  className={`px-2 transform duration-200 ${
                                    hoveredDriverSubSubSubMenu === products.title
                                      ? "translate-x-2"
                                      : ""
                                  }`}
                                >
                                  {products.parent === "" ? (
                                    products.title !== "" ? (
                                      <NavigationMenuLink href={getHref(pathname, products.href)}>
                                        <div
                                          className={`${styledDropdown} hover:text-primary ${
                                            activedriverhovered === products.title
                                              ? "text-primary"
                                              : pathname.includes("sbaudience")
                                                ? "text-white"
                                                : ""
                                          } ${
                                            products.tempAllFinished &&
                                            products.tempAllFinished === true &&
                                            "text-green-500"
                                          }`}
                                          onMouseEnter={() => {
                                            setDriversSubSubSubMenuUrl(products.url);
                                            setPictureSlugUrl(products.href);
                                            setPictureDesc(products.imageDesc);
                                            setactivedriverhovered(products.title);
                                            setDriversSubSubSubSubMenu(EmptyMenu);
                                            setDriversSubSubSubSubMenuUrl("");
                                            setHoveredDriverSubSubSubMenu("");
                                            setnameForHoveredPicture(products.title);
                                          }}
                                        >
                                          {products.newProd ? (
                                            <>
                                              {products.title.split(" / ")[0]}{" "}
                                              <div className="inline-flex text-primary">NEW</div>
                                            </>
                                          ) : (
                                            products.title
                                          )}
                                        </div>
                                      </NavigationMenuLink>
                                    ) : (
                                      driversubsubMenuUrl !== "" && (
                                        <NavigationMenuLink
                                          href={getHref(pathname, pictureSlugUrl)}
                                          className={`${pathname.includes("sbaudience") ? "text-white" : ""} relative overflow-hidden block text-center items-center justify-center h-full w-50`}
                                        >
                                          <div
                                            onMouseEnter={() => setactivedriverhovered(nameForHoveredPicture)}
                                          >
                                            <LazyImageCustomNavbar
                                              src={
                                                driversubsubMenuUrl.startsWith("/uploads/")
                                                  ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubsubMenuUrl}`
                                                  : driversubsubMenuUrl
                                              }
                                              alt={activedriverhovered}
                                              classname="object-contain max-h-40 w-auto"
                                              width={500}
                                              height={500}
                                              lazy
                                              containerheight="h-40"
                                              containerwidth="w-40"
                                              pathname={pathname}
                                            />
                                          </div>
                                          {pictureDesc}
                                        </NavigationMenuLink>
                                      )
                                    )
                                  ) : (
                                    <NavigationMenuLink href={getHref(pathname, products.href)}>
                                      <div
                                        className={`${styledDropdown} flex justify-between items-center align-middle ${
                                          hoveredDriverSubSubSubMenu === products.title
                                            ? "text-primary"
                                            : pathname.includes("sbaudience")
                                              ? "text-white"
                                              : ""
                                        }`}
                                        onMouseEnter={() => {
                                          setDriversSubSubSubSubMenuUrl("");
                                          setactivedriverhovered("");
                                        }}
                                      >
                                        {products.title}
                                        <ChevronRight
                                          size={15}
                                          className={`pb-1 ${
                                            hoveredDriverSubSubSubMenu === products.title
                                              ? "text-primary"
                                              : ""
                                          }`}
                                        />
                                      </div>
                                    </NavigationMenuLink>
                                  )}
                                </div>
                              ))}
                            </ul>

                          </div>
                        )}

                      {/* FOURTH MENU
                          driverSubSubSubSubMenu
                      */}
                      {driversubsubsubsubMenu &&
                        driversubsubsubsubMenu.length > 0 && (
                          <div
                            className={`overflow-y-auto overflow-x-hidden border-r-2 transform transition-all z-5 ${
                              pathname.includes("sbaudience") ? "bg-foreground" : "bg-background"
                            } ${
                              driversubsubsubMenuUrl === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            } ${
                              driversubsubsubsubMenu[0]?.title === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            } ${driversubsubsubsubMenuUrl === ""
                                  ? "border-transparent"
                                  : ""
                            }`}
                          >
                            <ul className="gap-1 p-1">
                              {driversubsubsubsubMenu.map((products, index) =>(
                                <div
                                  key={index}
                                  onMouseEnter={() =>
                                    searchSubSubSubSubMenu(products.title, products.parent)
                                  }
                                  className={`px-2 transform duration-200 ${
                                    hoveredDriverSubSubSubMenu === products.title
                                      ? "translate-x-2"
                                      : ""
                                  }`}
                                >
                                  {products.parent === "" ? (
                                  products.title !== "" ? (
                                    <NavigationMenuLink
                                      href={getHref(pathname, products.href)}
                                    >
                                      <div
                                        className={`${styledDropdown} hover:text-primary ${
                                          activedriverhovered === products.title
                                            ? "text-primary"
                                            : pathname.includes("sbaudience")
                                              ? "text-white"
                                              : ""
                                        } ${
                                          products.tempAllFinished &&
                                          products.tempAllFinished === true &&
                                          "text-green-500"
                                        }`}
                                        onMouseEnter={() => {
                                          setDriversSubSubSubSubMenuUrl(products.url);
                                          setPictureSlugUrl(products.href);
                                          setPictureDesc(products.imageDesc);
                                          setactivedriverhovered(products.title);
                                          setnameForHoveredPicture(products.title);
                                        }}
                                      >
                                        {products.newProd ? (
                                          <>
                                            {products.title.split(" / ")[0]}{" "}
                                            <div className="inline-flex text-primary">
                                              NEW
                                            </div>
                                          </>
                                        ) : (
                                          products.title
                                        )}
                                      </div>
                                    </NavigationMenuLink>
                                  ) : (
                                    driversubsubsubMenuUrl !== "" && (
                                      <NavigationMenuLink
                                        href={getHref(pathname, pictureSlugUrl)}
                                        className={`${pathname.includes("sbaudience") ? "text-white" : ""} relative overflow-hidden block text-center items-center justify-center h-full w-50`}
                                      >
                                        <div
                                          onMouseEnter={() =>
                                            setactivedriverhovered(
                                              nameForHoveredPicture
                                            )
                                          }
                                        >
                                          <LazyImageCustomNavbar
                                            src={
                                              driversubsubsubMenuUrl.startsWith("/uploads/")
                                                ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubsubsubMenuUrl}`
                                                : driversubsubsubMenuUrl
                                            }
                                            alt={activedriverhovered}
                                            classname="object-contain max-h-40 w-auto"
                                            width={500}
                                            height={500}
                                            lazy
                                            containerheight="h-40"
                                            containerwidth="w-40"
                                            pathname={pathname}
                                          />
                                        </div>
                                        {pictureDesc}
                                      </NavigationMenuLink>
                                    )
                                  )
                                ) : (
                                  <NavigationMenuLink
                                    href={getHref(pathname, products.href)}
                                  >
                                    <div
                                      className={`${styledDropdown} flex justify-between items-center align-middle ${
                                        pathname.includes("sbaudience")
                                          ? "text-white"
                                          : ""
                                      }`}
                                      onMouseEnter={() => {
                                        setactivedriverhovered("");
                                      }}
                                    >
                                      {products.title}
                                      <ChevronRight size={15} className="pb-1" />
                                    </div>
                                  </NavigationMenuLink>
                                  )}
                                </div>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* FIFTH MENU
                          driversubsubsubsubMenuUrl
                      */}
                        {driversubsubsubsubMenuUrl !== "" && (
                          <div
                            className={`overflow-y-auto overflow-x-hidden transform transition-all z-2 ${
                              pathname.includes("sbaudience") ? "bg-foreground" : "bg-background"
                            } ${
                              driversubsubsubsubMenuUrl === ""
                                ? "-translate-x-1/2"
                                : "translate-x-0"
                            }`}
                          >
                            <ul className="gap-1 p-1">
                          <NavigationMenuLink
                            href={getHref(pathname, pictureSlugUrl)}
                            className={`${pathname.includes("sbaudience") ? "text-white" : ""} relative overflow-hidden block text-center items-center justify-center h-full w-50`}
                          >
                            <div
                              onMouseEnter={() =>
                                setactivedriverhovered(
                                  nameForHoveredPicture
                                )
                              }
                            >
                              <LazyImageCustomNavbar
                                src={
                                  driversubsubsubsubMenuUrl.startsWith("/uploads/")
                                    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubsubsubsubMenuUrl}`
                                    : driversubsubsubsubMenuUrl
                                }
                                alt={activedriverhovered}
                                classname="object-contain max-h-40 w-auto"
                                width={500}
                                height={500}
                                lazy
                                containerheight="h-40"
                                containerwidth="w-40"
                                pathname={pathname}
                              />
                            </div>
                            {pictureDesc}
                          </NavigationMenuLink>
                            </ul>
                          </div>
                        )
                      }
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}


            {!pathname.includes('sbautomotive') &&
              <NavigationMenuItem>
                  <NavigationMenuLink href={getHref(pathname, 'new-products')}>
                    <div className="p-0 relative z-101">
                      <NavigationMenuTrigger className={navigationMenuTriggerStyle().concat(` bg-transparent hover:text-primary ${
                        navbarBg && pathname.includes('sbaudience') ? 
                          openedContentForBg ? 
                            'text-background' 
                            : 
                            'text-background'
                          :
                          pathname.includes('sbaudience') ? 
                          'text-background' 
                          :
                          'text-foreground'} `)
                        } onMouseLeave={() => setOpenedContentForBg(false)} onMouseEnter={() => {
                        setHoveredDriverSubMenu("");
                        setHoveredDriverSubSubMenu("");
                        setDriversSubMenu(EmptyMenu);
                        setDriversSubSubMenu(EmptyMenu);
                        setDriversSubSubSubMenu(EmptyMenu);
                        setPictureSlugUrl('');
                        setPictureDesc('');
                        setactivedriverhovered('');
                        setDriversSubMenuUrl('');
                        setDriversSubSubMenuUrl('');
                        setDriversSubSubSubMenuUrl('');
                        setOpenedContentForBg(true);
                      }}>
                        New Products
                      </NavigationMenuTrigger>
                    </div>
                  </NavigationMenuLink>
                  <NavigationMenuContent onMouseLeave={() => setOpenedContentForBg(false)} onMouseEnter={() => setOpenedContentForBg(true)} className={`${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'}`}>
                  <div className='xl:pl-[72px] xl:pr-[72px] lg:pl-[56px] lg:pr-[56px] py-4 pt-20'>
                      <SearchBoxNavbar changeBrand/>
                    </div>
                    <div className='grid grid-cols-5 w-screen xl:px-16 lg:px-12 px-8 py-4 h-[550px]'>
                      <div className={`overflow-y-auto border-r-2 z-40 ${pathname.includes("sbaudience") ? 'text-background' : 'text-foreground'}`}>
                        <ul className="gap-1 p-1">
                          <div className='font-bold pl-1'>
                            Drivers
                          </div>
                          {newProductsMenu.length>0 && newProductsMenu.map((products, index) => (
                              <NavigationMenuLink key={index} href={getHref(pathname, products.href)}>
                                <div className={`${styledDropdown} hover:text-primary ${activedriverhovered === products.name? 'text-primary': pathname.includes("sbaudience") ? 'text-white' : ''}`} onMouseEnter={() => (setDriversSubMenuUrl(products.image_url), setPictureSlugUrl(products.href), setPictureDesc(products.navbarNotes), setactivedriverhovered(products.name),setnameForHoveredPicture(products.name))}>
                                  {products.name.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div>
                                </div>
                              </NavigationMenuLink>
                          ))}
                        </ul>
                        {pathname.includes('sbaudience') || pathname.includes('sbautomotive') ? null :
                          <ul className="gap-1 p-1">
                            <div className='font-bold pl-1'>
                              Kits
                            </div>
                            {newKitsMenu.length>0 && newKitsMenu.map((products, index) => (
                                <NavigationMenuLink key={index} href={getHref(pathname, products.href)}>
                                  <div className={`${styledDropdown} hover:text-primary ${activedriverhovered === products.name? 'text-primary': pathname.includes("sbaudience") ? 'text-white' : ''}`} onMouseEnter={() => (setDriversSubMenuUrl(products.image_url), setPictureSlugUrl(products.href), setPictureDesc(products.navbarNotes), setactivedriverhovered(''), setactivedriverhovered(products.name),setnameForHoveredPicture(products.name))}>
                                    {products.name.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div>
                                  </div>
                                </NavigationMenuLink>
                            ))}
                          </ul>
                        }
                      </div>
                      <div className={`overflow-y-auto transform transition-all z-30 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'} ${driversubMenuUrl === ''? '-translate-x-1/2' : 'translate-x-0'}`}>
                        <ul className="gap-1 p-1">
                          {driversubMenuUrl != '' &&   
                              <NavigationMenuLink href={getHref(pathname, pictureSlugUrl)} className={`${pathname.includes("sbaudience") ? "text-white" : ""} relative overflow-hidden block text-center items-center justify-center h-full w-50`}>
                                <div onMouseEnter={() => (setactivedriverhovered(nameForHoveredPicture))}>
                                  <LazyImageCustomNavbar 
                                    src={driversubMenuUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubMenuUrl}` : driversubMenuUrl}
                                    alt={activedriverhovered}
                                    classname="object-contain max-h-40 w-auto" 
                                    width={500} 
                                    height={500} 
                                    lazy
                                    containerheight='h-40'
                                    containerwidth='w-40'
                                    pathname={pathname}/>
                                </div>
                                {pictureDesc}
                              </NavigationMenuLink>
                          }    
                        </ul>
                      </div>
                      <div className={`overflow-y-auto z-20 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'}`}>
                      </div>
                      <div className={`overflow-y-auto z-10 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'}`}>
                      </div>
                      <div className={`overflow-y-auto transform transition-all z-0 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'} ${driversubsubsubMenuUrl === ''? '-translate-x-1/2' : 'translate-x-0'}`}>
                      </div>
                    </div>
                  </NavigationMenuContent>
              </NavigationMenuItem>
              }

              
              {pathname.includes('sbaudience') &&
              <NavigationMenuItem>
                  <NavigationMenuLink href={getHref(pathname, 'application')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                    <div className="p-0 relative z-101">
                      Application
                    </div>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              }

              {(!pathname.includes('sbaudience') && !pathname.includes('sbautomotive')) &&
              <NavigationMenuItem>
                  <NavigationMenuLink href={getHref(pathname, 'technical')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                    <div className="p-0 relative z-101">
                      Technical
                    </div>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              }

              {!pathname.includes('sbautomotive') &&
                <NavigationMenuItem>
                    <NavigationMenuLink href={getHref(pathname, 'distributors')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                      <div className="p-0 relative z-101">
                        Distributors
                      </div>
                    </NavigationMenuLink>
                </NavigationMenuItem>
              }

              {!pathname.includes('sbautomotive') &&
              <NavigationMenuItem>
                  <NavigationMenuLink href={getHref(pathname, 'contact')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                    <div className="p-0 relative z-101">
                      Contact
                    </div>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              }

              {pathname.includes('sbautomotive') &&
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink href={getHref(pathname, 'blog')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                      <div className="p-0 relative z-101">
                        Blog
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href={getHref(pathname, 'projects')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                      <div className="p-0 relative z-101">
                        Projects
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href={getHref(pathname, 'dealer')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                      <div className="p-0 relative z-101">
                        Dealer
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              }
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className={`w-1/4 hidden xl:flex justify-end`}>
          <SearchBox changeBrand/>
        </div>


        <div className="flex xl:hidden overflow-x-hidden">
          <Sheet open={isLgScreen ? false : undefined}>
            <SheetTrigger asChild>
              <Button variant={null} className="w-fit p-0" aria-label="Mobile Menu">
                <Menu size={30} />
              </Button>
            </SheetTrigger>
            <SheetContent className={`h-auto w-full p-0 z-50 ${pathname.includes('sbaudience') ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}>
              <div className="max-h-screen overflow-y-auto">
                <div className="pl-6 pt-4">
                  <SearchLightbox changeBrand />
                </div>
                <SheetTitle />
                <SheetDescription />
                <div className="grid gap-1 px-6 pt-2">
                  <MobileMenuItems
                    items={firstMenu}
                    childMaps={[driverSubMenuMapping, driverSubSubMenuMapping, driverSubSubSubMenuMapping, driverSubSubSubSubMenuMapping]}
                    pathname={pathname}
                    loading={loading}
                  />
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="new-products">
                      <AccordionTrigger className="px-2 hover:text-primary">New Products</AccordionTrigger>
                      <AccordionContent>
                        <Link href={getHref(pathname, '/new-products')} className="w-full">
                          <SheetClose className="flex w-full justify-center rounded-xl bg-primary p-1 text-center text-primary-foreground">
                            Show All New Products
                          </SheetClose>
                        </Link>
                        <Accordion type="single" collapsible className={`w-full rounded-lg border-l-2 border-primary pl-2 ${pathname.includes('sbaudience') ? 'bg-zinc-100/10' : 'bg-zinc-700/5'}`}>
                          {newProductsMenu && newProductsMenu.length > 0 &&
                            <AccordionItem value="new-drivers">
                              <AccordionTrigger className="px-2 hover:text-primary">Drivers</AccordionTrigger>
                              <AccordionContent>
                                <MobileNewProducts products={newProductsMenu} pathname={pathname} />
                              </AccordionContent>
                            </AccordionItem>
                          }                        
                          {newKitsMenu && newKitsMenu.length > 0 &&
                            <AccordionItem value="new-kits">
                              <AccordionTrigger className="px-2 hover:text-primary">Kits</AccordionTrigger>
                              <AccordionContent>
                                <MobileNewProducts products={newKitsMenu} pathname={pathname} />
                              </AccordionContent>
                            </AccordionItem>
                          }
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {pathname.includes('sbaudience') && <MobileLink href={getHref(pathname, 'application')}>Application</MobileLink>}
                  {!pathname.includes('sbaudience') && <MobileLink href={getHref(pathname, 'technical')}>Technical</MobileLink>}
                  {!pathname.includes('sbautomotive') && <MobileLink href={getHref(pathname, 'distributors')}>Distributors</MobileLink>}
                  {!pathname.includes('sbautomotive') && <MobileLink href={getHref(pathname, 'contact')}>Contact</MobileLink>}
                  {pathname.includes('sbautomotive') && <>
                    <MobileLink href={getHref(pathname, 'blog')}>Blog</MobileLink>
                    <MobileLink href={getHref(pathname, 'projects')}>Projects</MobileLink>
                    <MobileLink href={getHref(pathname, 'dealer')}>Dealer</MobileLink>
                  </>}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
    </div>




    
      <div className={`${height > 600 ? 'fixed' : 'absolute'} 
        ${scrolled ? '-top-8' : 'top-0'} transition-all duration-300 ease-in-out left-0 z-50 w-screen flex items-start justify-left`}>
        <div className={`w-screen xl:px-16 lg:px-12 px-8 ${pathname.includes('sbaudience') ? 'bg-black' : 'bg-white'} h-full gap-8 flex p-1.5 border-b`}>
          {pathname.includes('sbaudience') ? 
            <Link href={'/'}>
              <div className='group cursor-pointer transition-transform duration-300 hover:scale-105'>
                <div className='flex flex-col gap-1'>
                  <div className="h-5">
                    <Image
                      src={'/images/sbacoustics/logo_sbacoustics_white_clean.webp'}
                      alt='SB Acoustics Logo'
                      width={150}
                      height={40}
                      className="h-full w-auto"
                    />
                    </div>
                </div>
              </div>
            </Link>
            :
            pathname.includes('sbautomotive') ? 
            <>
              <Link href={'/'}>
                <div className='group cursor-pointer transition-transform duration-300 hover:scale-105'>
                  <div className='flex flex-col gap-1'>
                    <div className="h-5">
                      <Image
                        src={'/images/sbacoustics/logo_sbacoustics_black_clean.webp'}
                        alt='SB Acoustics Logo'
                        width={150}
                        height={40}
                        className="h-full w-auto"
                      />
                      </div>
                  </div>
                </div>
              </Link>
              <Link href={'/sbaudience'}>
                <div className='group cursor-pointer transition-transform duration-300 hover:scale-105'>
                  <div className='flex flex-col gap-1'>
                    <div className="h-5">
                      <Image
                        src={'/images/sbaudience/logo_sbaudience_black.webp'}
                        alt='SB Audience Logo'
                        width={150}
                        height={40}
                        className="h-full w-auto"
                      />
                      </div>
                  </div>
                </div>
              </Link>
            </>
            :
            <Link href={'/sbaudience'}>
              <div className='group cursor-pointer transition-transform duration-300 hover:scale-105'>
                <div className='flex flex-col gap-1'>
                  <div className="h-5">
                    <Image
                      src={'/images/sbaudience/logo_sbaudience_black.webp'}
                      alt='SB Audience Logo'
                      width={150}
                      height={40}
                      className="h-full w-auto"
                    />
                    </div>
                </div>
              </div>
            </Link>
          }
        </div>
      </div>
    
    
    </>
  );
}

export default Navbar;
