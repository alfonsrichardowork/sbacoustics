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
import { DriversMenu, DriversSBAudienceMenu, DriversSBAutomotiveMenu, EmptyMenu, KitsMenu, MidrangesSubMenu, MidwoofersSubMenu, OEMMidwoofersSubMenu, OEMSubMenu, SubwoofersDefaultSubMenu, TweetersSubMenu, WidebandersDefaultSubMenu, WoofersSubMenu } from '@/app/(frontend)/utils/navbar-content';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getHref } from '@/app/(frontend)/utils/getHref';
import getAllNavbarContent from '@/app/(frontend)/actions/get-all-navbar-content';
import { LazyImageCustom } from './lazyImageCustom';
import { useScrollDirection } from './hooks/use-scroll-direction';
import SearchLightbox from './searchligthbox';
import path from 'node:path';

const styledDropdown = "text-sm px-1 py-2 text-foreground"


function Navbar() {
  const [driverMenu, setDriversMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubMenu, setDriversSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubsubMenu, setDriversSubSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubsubsubMenu, setDriversSubSubSubMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [driversubMenuUrl, setDriversSubMenuUrl] = useState<string>('')
  const [driversubsubMenuUrl, setDriversSubSubMenuUrl] = useState<string>('')
  const [driversubsubsubMenuUrl, setDriversSubSubSubMenuUrl] = useState<string>('')
  const [activedriverhovered, setactivedriverhovered] = useState<string>('')
  const [activekitshovered, setactivekitshovered] = useState<string>('')
  const [pictureSlugUrl, setPictureSlugUrl] = useState<string>('')
  const [pictureDesc, setPictureDesc] = useState<string>('')
  const [nameForHoveredPicture, setnameForHoveredPicture] = useState<string>('')
  const [_, setLoading] = useState(true);
  const [openedContentForBg, setOpenedContentForBg] = useState(false);
  
  //FOR SEARCHING SUB MENU CONTENT
  const [driverSubMenuMapping, setDriverSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});
  const [driverSubSubMenuMapping, setDriverSubSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});
  const [driverSubSubSubMenuMapping, setDriverSubSubSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});
  const [kitsSubMenuMapping, setKitsSubMenuMapping] = useState<Record<string, NavbarComponents[]>>({});

  //KITS
  const [kitMenu, setKitMenu] = useState<NavbarComponents[]>(EmptyMenu)
  const [kitssubMenu, setKitsSubMenu] = useState<NavbarComponents[]>([])

  //NEW PRODUCTS
  const [newProductsMenu, setnewProductsMenu] = useState<NewProduct[]>([])
  const [newKitsMenu, setnewKitsMenu] = useState<NewProduct[]>([])

  
  const pathname = usePathname()
  const [hoveredDriverMenu, setHoveredDriverMenu] = useState("");
  const [hoveredDriverSubMenu, setHoveredDriverSubMenu] = useState("");
  const [hoveredDriverSubSubMenu, setHoveredDriverSubSubMenu] = useState("");
  const [hoveredKitsMenu, setHoveredKitsMenu] = useState("");
  const [height, setHeight] = useState<number>(700);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [tempPathname, setTempPathname] = useState(getBrandFromPathname(pathname));
  const [changeBrand, setChangeBrand] = useState(false);
  const [firstMenu, setFirstMenu] = useState<NavbarComponents[]>([]);

  const [navbarBg, setNavbarBg] = useState(false);
const isSBAudience = pathname.includes('sbaudience');

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
    if(pathname.includes('sbaudience')){
      setFirstMenu(DriversSBAudienceMenu)
      //SB AUDIENCE
      let tempSubwoofersSBAudience: NavbarComponents[] = []
      let tempHornSBAudience: NavbarComponents[] = []
      let tempCoaxialsSBAudience: NavbarComponents[] = []
      let tempOpenBaffleDriversSBAudience: NavbarComponents[] = []
      let tempWoofersSBAudience: NavbarComponents[] = []
      let tempCompressionDriversSBAudience: NavbarComponents[] = []

      //CONDITIONS
      const SubwoofersSBAudienceConditions = [
        { type: 'Category', name: 'Drivers' },
        { type: 'Sub Category', name: 'Subwoofers' }
      ];
      const HornSBAudienceConditions = [
        { type: 'Category', name: 'Drivers' },
        { type: 'Sub Category', name: 'Horn' }
      ];
      const CoaxialsSBAudienceConditions = [
        { type: 'Category', name: 'Drivers' },
        { type: 'Sub Category', name: 'Coaxials' }
      ];
      const OpenBaffleDriversSBAudienceConditions = [
        { type: 'Category', name: 'Drivers' },
        { type: 'Sub Category', name: 'Open Baffle Drivers' }
      ];
      const WoofersSBAudiencesConditions = [
        { type: 'Category', name: 'Drivers' },
        { type: 'Sub Category', name: 'Woofers' }
      ];
      const CompressionDriversSBAudienceConditions = [
        { type: 'Category', name: 'Drivers' },
        { type: 'Sub Category', name: 'Compression Drivers' }
      ];

      const fetchData = async () => {
        try {
          const [navbarData, priority]: [NavbarProducts[], PriorityMenu[]] = await getAllNavbarContent(pathname);
          const [tempNewKits, tempNewProduct]: [NewProduct[], NewProduct[]] = await getAllNewProducts(pathname);
          // setValue(navbarData);
          setDriversSubMenu(EmptyMenu)


          const conditionsAndTemps = [
            { conditions: SubwoofersSBAudienceConditions, tempArray: tempSubwoofersSBAudience },
            { conditions: HornSBAudienceConditions, tempArray: tempHornSBAudience },
            { conditions: CoaxialsSBAudienceConditions, tempArray: tempCoaxialsSBAudience },
            { conditions: OpenBaffleDriversSBAudienceConditions, tempArray: tempOpenBaffleDriversSBAudience },
            { conditions: WoofersSBAudiencesConditions, tempArray: tempWoofersSBAudience },
            { conditions: CompressionDriversSBAudienceConditions, tempArray: tempCompressionDriversSBAudience }
          ];
      
          // Loop through navbarData and check every condition
          navbarData.forEach((product) => {
            conditionsAndTemps.forEach(({ conditions, tempArray }) => {
              const meetsConditions = conditions.every(condition =>
                product.categories.some(cat => cat.type === condition.type && cat.name === condition.name)
              );

              if (meetsConditions) {

                const productPriority = priority.find((val) =>
                  val.productName === product.name &&
                  conditions.find((cat) => cat.name === val.categoryName)
                )?.priority ?? '999';

                const newItem = {
                  title: product.name,
                  href: product.href,
                  parent: "",
                  url: product.url,
                  imageDesc: product.navbarNotes,
                  priority: productPriority,
                  newProd: product.newProduct,
                  hasProduct: false,
                  tempAllFinished: product.tempAllFinished ? product.tempAllFinished : false,
                };

                // Insert `newItem` into `tempArray` at correct sorted position
                const indexToInsert = tempArray.findIndex(
                  (item) => Number(productPriority) < Number(item.priority)
                );

                if (indexToInsert === -1) {
                  tempArray.push(newItem);
                } else {
                  tempArray.splice(indexToInsert, 0, newItem);
                }
              }
            });
          });

          //NEW PRODUCTS
          setnewProductsMenu(tempNewProduct)
          setnewKitsMenu(tempNewKits)

          const submenuMappingDriver: Record<string, NavbarComponents[]> = {
            "Subwoofers-Drivers": tempSubwoofersSBAudience,
            "Horn-Drivers": tempHornSBAudience,
            "Coaxials-Drivers": tempCoaxialsSBAudience,
            "Open Baffle Drivers-Drivers": tempOpenBaffleDriversSBAudience,
            "Woofers-Drivers": tempWoofersSBAudience,
            "Compression Drivers-Drivers": tempCompressionDriversSBAudience,
          };
          setDriverSubMenuMapping(submenuMappingDriver)

        } catch (error) {
          console.error('Error fetching navbar products:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
    else if(pathname.includes('sbautomotive')){
      setFirstMenu(DriversSBAutomotiveMenu)
      // //SB Automotive
      // let tempSubwoofersSBAudience: NavbarComponents[] = []
      // let tempHornSBAudience: NavbarComponents[] = []
      // let tempCoaxialsSBAudience: NavbarComponents[] = []
      // let tempOpenBaffleDriversSBAudience: NavbarComponents[] = []
      // let tempWoofersSBAudience: NavbarComponents[] = []
      // let tempCompressionDriversSBAudience: NavbarComponents[] = []

      // //CONDITIONS
      // const SubwoofersSBAudienceConditions = [
      //   { type: 'Category', name: 'Drivers' },
      //   { type: 'Sub Category', name: 'Subwoofers' }
      // ];
      // const HornSBAudienceConditions = [
      //   { type: 'Category', name: 'Drivers' },
      //   { type: 'Sub Category', name: 'Horn' }
      // ];
      // const CoaxialsSBAudienceConditions = [
      //   { type: 'Category', name: 'Drivers' },
      //   { type: 'Sub Category', name: 'Coaxials' }
      // ];
      // const OpenBaffleDriversSBAudienceConditions = [
      //   { type: 'Category', name: 'Drivers' },
      //   { type: 'Sub Category', name: 'Open Baffle Drivers' }
      // ];
      // const WoofersSBAudiencesConditions = [
      //   { type: 'Category', name: 'Drivers' },
      //   { type: 'Sub Category', name: 'Woofers' }
      // ];
      // const CompressionDriversSBAudienceConditions = [
      //   { type: 'Category', name: 'Drivers' },
      //   { type: 'Sub Category', name: 'Compression Drivers' }
      // ];

      // const fetchData = async () => {
      //   try {
      //     const [navbarData, priority]: [NavbarProducts[], PriorityMenu[]] = await getAllNavbarContent(pathname);
      //     const [tempNewKits, tempNewProduct]: [NewProduct[], NewProduct[]] = await getAllNewProducts(pathname);
      //     // setValue(navbarData);
      //     setDriversSubMenu(EmptyMenu)


      //     const conditionsAndTemps = [
      //       { conditions: SubwoofersSBAudienceConditions, tempArray: tempSubwoofersSBAudience },
      //       { conditions: HornSBAudienceConditions, tempArray: tempHornSBAudience },
      //       { conditions: CoaxialsSBAudienceConditions, tempArray: tempCoaxialsSBAudience },
      //       { conditions: OpenBaffleDriversSBAudienceConditions, tempArray: tempOpenBaffleDriversSBAudience },
      //       { conditions: WoofersSBAudiencesConditions, tempArray: tempWoofersSBAudience },
      //       { conditions: CompressionDriversSBAudienceConditions, tempArray: tempCompressionDriversSBAudience }
      //     ];
      
      //     // Loop through navbarData and check every condition
      //     navbarData.forEach((product) => {
      //       conditionsAndTemps.forEach(({ conditions, tempArray }) => {
      //         const meetsConditions = conditions.every(condition =>
      //           product.categories.some(cat => cat.type === condition.type && cat.name === condition.name)
      //         );

      //         if (meetsConditions) {

      //           const productPriority = priority.find((val) =>
      //             val.productName === product.name &&
      //             conditions.find((cat) => cat.name === val.categoryName)
      //           )?.priority ?? '999';

      //           const newItem = {
      //             title: product.name,
      //             href: product.href,
      //             parent: "",
      //             url: product.url,
      //             imageDesc: product.navbarNotes,
      //             priority: productPriority,
      //             newProd: product.newProduct,
      //             hasProduct: false,
      //             tempAllFinished: product.tempAllFinished ? product.tempAllFinished : false,
      //           };

      //           // Insert `newItem` into `tempArray` at correct sorted position
      //           const indexToInsert = tempArray.findIndex(
      //             (item) => Number(productPriority) < Number(item.priority)
      //           );

      //           if (indexToInsert === -1) {
      //             tempArray.push(newItem);
      //           } else {
      //             tempArray.splice(indexToInsert, 0, newItem);
      //           }
      //         }
      //       });
      //     });

      //     //NEW PRODUCTS
      //     setnewProductsMenu(tempNewProduct)
      //     setnewKitsMenu(tempNewKits)
        setnewProductsMenu([])
        setnewKitsMenu([])

      //     const submenuMappingDriver: Record<string, NavbarComponents[]> = {
      //       "Subwoofers-Drivers": tempSubwoofersSBAudience,
      //       "Horn-Drivers": tempHornSBAudience,
      //       "Coaxials-Drivers": tempCoaxialsSBAudience,
      //       "Open Baffle Drivers-Drivers": tempOpenBaffleDriversSBAudience,
      //       "Woofers-Drivers": tempWoofersSBAudience,
      //       "Compression Drivers-Drivers": tempCompressionDriversSBAudience,
      //     };
      //     setDriverSubMenuMapping(submenuMappingDriver)

      //   } catch (error) {
      //     console.error('Error fetching navbar products:', error);
      //   } finally {
      //     setLoading(false);
      //   }
      // }
      // fetchData();
    }
    else{
          //SB ACOUSTICS
          
      setFirstMenu(DriversMenu)
    let tempDomeTweeter: NavbarComponents[] = []
    let tempRingRadiators: NavbarComponents[] = []
    let tempSATORITweeters: NavbarComponents[] = []
  
    let tempNRXMidranges: NavbarComponents[] = []
    let tempSATORIMidranges: NavbarComponents[] = []

    let tempCACMidwoofers: NavbarComponents[] = []
    let tempCRCMidwoofers: NavbarComponents[] = []
    let tempMFCMidwoofers: NavbarComponents[] = []
    let tempNBACMidwoofers: NavbarComponents[] = []
    let tempNRXMidwoofers: NavbarComponents[] = []
    let tempPACMidwoofers: NavbarComponents[] = []
    let tempPFCRMidwoofers: NavbarComponents[] = []
    let tempSATORIMidwoofers: NavbarComponents[] = []
    let tempSFCRMidwoofers: NavbarComponents[] = []

    let tempCACWoofers: NavbarComponents[] = []
    let tempPFCRWoofers: NavbarComponents[] = []
    let tempSFCLWoofers: NavbarComponents[] = []
    let tempNRXWoofers: NavbarComponents[] = []
    let tempNBACWoofers: NavbarComponents[] = []
    let tempSATORIWoofers: NavbarComponents[] = []

    let tempTweetersOEM: NavbarComponents[] = []
    let tempMidrangesOEM: NavbarComponents[] = []
    let tempMidwoofersOEM: NavbarComponents[] = []
    let tempWoofersOEM: NavbarComponents[] = []
    let tempSubwoofersOEM: NavbarComponents[] = []
    let tempShallowSubwoofersOEM: NavbarComponents[] = []
    let tempPassiveRadiatorsOEM: NavbarComponents[] = []
    let tempCoaxialsOEM: NavbarComponents[] = []

    let tempNBACMidwoofersOEM: NavbarComponents[] = []
    let tempNRXMidwoofersOEM: NavbarComponents[] = []
    let tempPFCRMidwoofersOEM: NavbarComponents[] = []
    let tempSATORIMidwoofersOEM: NavbarComponents[] = []

    //TEST
    let tempWidebanders: NavbarComponents[] = []
    let tempFullRanges: NavbarComponents[] = []
    let tempSubwoofers: NavbarComponents[] = []
    let tempShallowSubwoofers: NavbarComponents[] = []
    let tempPassiveRadiators: NavbarComponents[] = []
    let tempCoaxials: NavbarComponents[] = []

    //KITS
    let tempSBAcousticsKits: NavbarComponents[] = []
    let tempOpenSourceKits: NavbarComponents[] = []
    let tempAccessories: NavbarComponents[] = []

    //CONDITIONS
    const DomeTweetersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Tweeters' },
      { type: 'Sub Sub Category', name: 'Dome Tweeters' }
    ];
    const RingRadiatorsConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Tweeters' },
      { type: 'Sub Sub Category', name: 'Ring Radiators' }
    ];
    const SATORITweetersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Tweeters' },
      { type: 'Sub Sub Category', name: 'SATORI Tweeters' }
    ];

    const NRXMidrangesConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midranges' },
      { type: 'Sub Sub Category', name: 'NRX Midranges' }
    ];
    const SATORIMidrangesConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midranges' },
      { type: 'Sub Sub Category', name: 'SATORI Midranges' }
    ];

    
    const CACMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'CAC Midwoofers' }
    ];
    const CRCMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'CRC Midwoofers' }
    ];
    const MFCMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'MFC Midwoofers' }
    ];
    const NBACMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'NBAC Midwoofers' }
    ];
    const NRXMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'NRX Midwoofers' }
    ];
    const PACMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'PAC Midwoofers' }
    ];
    const PFCRMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'PFCR Midwoofers' }
    ];
    const SATORIMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'SATORI Midwoofers' }
    ];
    const SFCRMidwoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Midwoofers' },
      { type: 'Sub Sub Category', name: 'SFCR Midwoofers' }
    ];


    const CACWoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Woofers' },
      { type: 'Sub Sub Category', name: 'CAC Woofers' }
    ];
    const PFCRWoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Woofers' },
      { type: 'Sub Sub Category', name: 'PFCR Woofers' }
    ];
    const SFCLWoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Woofers' },
      { type: 'Sub Sub Category', name: 'SFCL Woofers' }
    ];
    const NRXWoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Woofers' },
      { type: 'Sub Sub Category', name: 'NRX Woofers' }
    ];
    const NBACWoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Woofers' },
      { type: 'Sub Sub Category', name: 'NBAC Woofers' }
    ];
    const SATORIWoofersConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'Woofers' },
      { type: 'Sub Sub Category', name: 'SATORI Woofers' }
    ];

    
    const TweetersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Tweeters OEM' }
    ];   
    const MidrangesOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Midranges OEM' }
    ];   
    const MidwoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Midwoofers OEM' }
    ];   
    const WoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Woofers OEM' }
    ];   
    const SubwoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Subwoofers OEM' }
    ];   
    const ShallowSubwoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Shallow Subwoofers OEM' }
    ];   
    const PassiveRadiatorsOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Passive Radiators OEM' }
    ];   
    const CoaxialsOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'Coaxials OEM' }
    ];


    
    const NBACMidwoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'NBAC Midwoofers OEM' }
    ];   
    const NRXMidwoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'NRX Midwoofers OEM' }
    ];   
    const PFCRMidwoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'PFCR Midwoofers OEM' }
    ];   
    const SATORIMidwoofersOEMConditions = [
      { type: 'Category', name: 'Drivers' },
      { type: 'Sub Category', name: 'OEM' },
      { type: 'Sub Sub Category', name: 'SATORI Midwoofers OEM' }
    ];   

    
    //TEST
    const WidebandersConditions = [
      { type: 'Sub Category', name: 'Widebanders' },
    ];
    const FullRangesConditions = [
      { type: 'Sub Category', name: 'Full Ranges' },
    ];
    const SubwoofersConditions = [
      { type: 'Sub Category', name: 'Subwoofers' },
    ];
    const ShallowSubwoofersConditions = [
      { type: 'Sub Category', name: 'Shallow Subwoofers' },
    ];
    const PassiveRadiatorsConditions = [
      { type: 'Sub Category', name: 'Passive Radiators' },
    ];
    const CoaxialsConditions = [
      { type: 'Sub Category', name: 'Coaxials' },
    ];

    //KITS
    const SBAcousticsKitsConditions = [
      { type: 'Category', name: 'Kits' },
      { type: 'Sub Category', name: 'SB Acoustics Kits' },
    ];   
    const OpenSourceKitsConditions = [
      { type: 'Category', name: 'Kits' },
      { type: 'Sub Category', name: 'Open Source Kits' },
    ];   
    const AccessoriesConditions = [
      { type: 'Category', name: 'Kits' },
      { type: 'Sub Category', name: 'Accessories' },
    ];


    const fetchData = async () => {
      try {
        const [navbarData, priority]: [NavbarProducts[], PriorityMenu[]] = await getAllNavbarContent(pathname);
        const [tempNewKits, tempNewProduct]: [NewProduct[], NewProduct[]] = await getAllNewProducts(pathname);
        // setValue(navbarData);
        setDriversSubMenu(EmptyMenu)


        const conditionsAndTemps = [
          { conditions: DomeTweetersConditions, tempArray: tempDomeTweeter },
          { conditions: RingRadiatorsConditions, tempArray: tempRingRadiators },
          { conditions: SATORITweetersConditions, tempArray: tempSATORITweeters },
          { conditions: NRXMidrangesConditions, tempArray: tempNRXMidranges },
          { conditions: SATORIMidrangesConditions, tempArray: tempSATORIMidranges },
          { conditions: CACMidwoofersConditions, tempArray: tempCACMidwoofers },
          { conditions: CRCMidwoofersConditions, tempArray: tempCRCMidwoofers },
          { conditions: MFCMidwoofersConditions, tempArray: tempMFCMidwoofers },
          { conditions: NBACMidwoofersConditions, tempArray: tempNBACMidwoofers },
          { conditions: NRXMidwoofersConditions, tempArray: tempNRXMidwoofers },
          { conditions: PACMidwoofersConditions, tempArray: tempPACMidwoofers },
          { conditions: PFCRMidwoofersConditions, tempArray: tempPFCRMidwoofers },
          { conditions: SATORIMidwoofersConditions, tempArray: tempSATORIMidwoofers },
          { conditions: SFCRMidwoofersConditions, tempArray: tempSFCRMidwoofers },
          { conditions: CACWoofersConditions, tempArray: tempCACWoofers },
          { conditions: PFCRWoofersConditions, tempArray: tempPFCRWoofers },
          { conditions: SFCLWoofersConditions, tempArray: tempSFCLWoofers },
          { conditions: NRXWoofersConditions, tempArray: tempNRXWoofers },
          { conditions: NBACWoofersConditions, tempArray: tempNBACWoofers },
          { conditions: SATORIWoofersConditions, tempArray: tempSATORIWoofers },
          { conditions: TweetersOEMConditions, tempArray: tempTweetersOEM },
          { conditions: MidrangesOEMConditions, tempArray: tempMidrangesOEM },
          { conditions: MidwoofersOEMConditions, tempArray: tempMidwoofersOEM },
          { conditions: WoofersOEMConditions, tempArray: tempWoofersOEM },
          { conditions: SubwoofersOEMConditions, tempArray: tempSubwoofersOEM },
          { conditions: ShallowSubwoofersOEMConditions, tempArray: tempShallowSubwoofersOEM },
          { conditions: PassiveRadiatorsOEMConditions, tempArray: tempPassiveRadiatorsOEM },
          { conditions: CoaxialsOEMConditions, tempArray: tempCoaxialsOEM },
          { conditions: NBACMidwoofersOEMConditions, tempArray: tempNBACMidwoofersOEM },
          { conditions: NRXMidwoofersOEMConditions, tempArray: tempNRXMidwoofersOEM },
          { conditions: PFCRMidwoofersOEMConditions, tempArray: tempPFCRMidwoofersOEM },
          { conditions: SATORIMidwoofersOEMConditions, tempArray: tempSATORIMidwoofersOEM },



          //TEST
          { conditions: WidebandersConditions, tempArray: tempWidebanders },
          { conditions: FullRangesConditions, tempArray: tempFullRanges },
          { conditions: SubwoofersConditions, tempArray: tempSubwoofers },
          { conditions: ShallowSubwoofersConditions, tempArray: tempShallowSubwoofers },
          { conditions: PassiveRadiatorsConditions, tempArray: tempPassiveRadiators },
          { conditions: CoaxialsConditions, tempArray: tempCoaxials },

          //KITS
          { conditions: SBAcousticsKitsConditions, tempArray: tempSBAcousticsKits },
          { conditions: OpenSourceKitsConditions, tempArray: tempOpenSourceKits },
          { conditions: AccessoriesConditions, tempArray: tempAccessories },

        ];
    
        // Loop through navbarData and check every condition
        navbarData.forEach((product) => {
          conditionsAndTemps.forEach(({ conditions, tempArray }) => {
            const meetsConditions = conditions.every(condition =>
              product.categories.some(cat => cat.type === condition.type && cat.name === condition.name)
            );

            if (meetsConditions) {

              const productPriority = priority.find((val) =>
                val.productName === product.name &&
                conditions.find((cat) => cat.name === val.categoryName)
              )?.priority ?? '999';

              const newItem = {
                title: product.name,
                href: product.href,
                parent: "",
                url: product.url,
                imageDesc: product.navbarNotes,
                priority: productPriority,
                newProd: product.newProduct,
                hasProduct: false,
                tempAllFinished: product.tempAllFinished ? product.tempAllFinished : false,
              };

              // Insert `newItem` into `tempArray` at correct sorted position
              const indexToInsert = tempArray.findIndex(
                (item) => Number(productPriority) < Number(item.priority)
              );

              if (indexToInsert === -1) {
                tempArray.push(newItem);
              } else {
                tempArray.splice(indexToInsert, 0, newItem);
              }
            }
          });
        });

        //NEW PRODUCTS
        setnewProductsMenu(tempNewProduct)
        setnewKitsMenu(tempNewKits)



        const submenuMappingDriver: Record<string, NavbarComponents[]> = {
          "Tweeters-Drivers": TweetersSubMenu,
          "Widebanders / Full Ranges-Drivers": [...tempWidebanders, ...WidebandersDefaultSubMenu],
          "Midranges-Drivers": MidrangesSubMenu,
          "Midwoofers-Drivers": MidwoofersSubMenu,
          "Woofers-Drivers": WoofersSubMenu,
          "Subwoofers-Drivers": [...tempSubwoofers, ...SubwoofersDefaultSubMenu],
          "Passive Radiators-Drivers": tempPassiveRadiators,
          "Coaxials-Drivers": tempCoaxials,
          "OEM-Drivers": OEMSubMenu,
        };
        setDriverSubMenuMapping(submenuMappingDriver)


        const subsubmenuMappingDriver: Record<string, NavbarComponents[]> = {
          "Dome Tweeters-Tweeters": tempDomeTweeter,
          "Ring Radiators-Tweeters": tempRingRadiators,
          "SATORI Tweeters-Tweeters": tempSATORITweeters,
          "Full Ranges-Widebanders / Full Ranges": tempFullRanges,
          "NRX Midranges-Midranges": tempNRXMidranges,
          "SATORI Midranges-Midranges": tempSATORIMidranges,
          "CAC Midwoofers-Midwoofers": tempCACMidwoofers,
          "CRC Midwoofers-Midwoofers": tempCRCMidwoofers,
          "MFC Midwoofers-Midwoofers": tempMFCMidwoofers,
          "NBAC Midwoofers-Midwoofers": tempNBACMidwoofers,
          "NRX Midwoofers-Midwoofers": tempNRXMidwoofers,
          "PAC Midwoofers-Midwoofers": tempPACMidwoofers,
          "PFCR Midwoofers-Midwoofers": tempPFCRMidwoofers,
          "SATORI Midwoofers-Midwoofers": tempSATORIMidwoofers,
          "SFCR Midwoofers-Midwoofers": tempSFCRMidwoofers,
          "CAC Woofers-Woofers": tempCACWoofers,
          "PFCR Woofers-Woofers": tempPFCRWoofers,
          "SFCL Woofers-Woofers": tempSFCLWoofers,
          "NRX Woofers-Woofers": tempNRXWoofers,
          "NBAC Woofers-Woofers": tempNBACWoofers,
          "SATORI Woofers-Woofers": tempSATORIWoofers,
          "Shallow Subwoofers-Subwoofers": tempShallowSubwoofers,
          "Tweeters OEM-OEM": tempTweetersOEM,
          "Midranges OEM-OEM": tempMidrangesOEM,
          "Midwoofers OEM-OEM": OEMMidwoofersSubMenu,
          "Woofers OEM-OEM": tempWoofersOEM,
          "Subwoofers OEM-OEM": tempSubwoofersOEM,
          "Shallow Subwoofers OEM-OEM": tempShallowSubwoofersOEM,
          "Passive Radiators OEM-OEM": tempPassiveRadiatorsOEM,
          "Coaxials OEM-OEM": tempCoaxialsOEM,
        };
        setDriverSubSubMenuMapping(subsubmenuMappingDriver)


        const subSubSubMenuMappingDriver: Record<string, NavbarComponents[]> = {
          "NBAC Midwoofers OEM-OEM Midwoofers": tempNBACMidwoofersOEM,
          "NRX Midwoofers OEM-OEM Midwoofers": tempNRXMidwoofersOEM,
          "PFCR Midwoofers OEM-OEM Midwoofers": tempPFCRMidwoofersOEM,
          "SATORI Midwoofers OEM-OEM Midwoofers": tempSATORIMidwoofersOEM,
        };
        setDriverSubSubSubMenuMapping(subSubSubMenuMappingDriver)


        const submenuMappingKits: Record<string, NavbarComponents[]> = {
          "SB Acoustics Kits-Kits": tempSBAcousticsKits,
          "Open Source Kits-Kits": tempOpenSourceKits,
          "Accessories-Kits": tempAccessories,
        };
        setKitsSubMenuMapping(submenuMappingKits)



      } catch (error) {
        console.error('Error fetching navbar products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    }


    
  }, [changeBrand]);


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


  function searchSubMenu(name: string, parent: string) { 
    const key = `${name}-${parent}`;
    if (driverSubMenuMapping[key]) {
      setDriversSubMenu(driverSubMenuMapping[key]);
    }
  }  
  function searchSubSubMenu(name: string, parent: string) {
    const key = `${name}-${parent}`;
    if (driverSubSubMenuMapping[key]) {
      setDriversSubSubMenu(driverSubSubMenuMapping[key]);
      setDriversSubSubSubMenu(EmptyMenu);
      setHoveredDriverSubMenu(name);
      setHoveredDriverSubSubMenu("");
      setHoveredKitsMenu("");
    }
  }
  function searchKitsMenu(name: string, parent: string) {
    const key = `${name}-${parent}`;
    if (kitsSubMenuMapping[key]) {
      setKitsSubMenu(kitsSubMenuMapping[key]);
    }
  }
  function searchSubSubSubMenu(name: string, parent: string) {
    const key = `${name}-${parent}`;
    if (driverSubSubSubMenuMapping[key]) {
      setDriversSubSubSubMenu(driverSubSubSubMenuMapping[key]);
      setHoveredDriverSubSubMenu(name);
      setHoveredKitsMenu("");
    }
  }

  

  

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

  const isVisible = useScrollDirection();

  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 0);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

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
                    '/images/sbaudience/logo_sbaudience.webp' : pathname.includes('sbautomotive') ? '/images/sbautomotive/logo_sbautomotive_white.webp' : '/images/sbacoustics/logo_sbacoustics_black_clean.webp'}
                className="cursor-pointer max-w-[150px] h-8 z-101 object-contain"
                alt={pathname.includes('sbaudience') ? "Logo of SB Audience" : pathname.includes('sbautomotive') ? "Logo of SB Automotive" : "Logo of SB Acoustics"}
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
              <NavigationMenuItem>
                <Link href={getHref(pathname, 'drivers')} passHref>
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
                        setHoveredDriverMenu("");
                        setHoveredDriverSubMenu("");
                        setHoveredDriverSubSubMenu("");
                        setHoveredKitsMenu("");
                        setDriversSubMenu(EmptyMenu);
                        setDriversSubSubMenu(EmptyMenu);
                        setDriversSubSubSubMenu(EmptyMenu);
                        setKitsSubMenu(EmptyMenu);
                        setDriversSubMenuUrl("");
                        setPictureSlugUrl("");
                        setPictureDesc("");
                        setactivedriverhovered("");
                        setDriversSubSubMenuUrl("");
                        setDriversSubSubSubMenuUrl("");
                        setOpenedContentForBg(true);
                      }}
                    >
                      Drivers
                    </NavigationMenuTrigger>
                  </div>
                </Link>

                <NavigationMenuContent
                  className={`relative z-50 ${pathname.includes('sbaudience') ? 'bg-foreground' : 'bg-background'}`} // Lower z-index
                  onMouseLeave={() => setOpenedContentForBg(false)}
                  onMouseEnter={() => setOpenedContentForBg(true)}
                >
                  <div className='xl:pl-[72px] xl:pr-[72px] lg:pl-[56px] lg:pr-[56px] px-8 py-4 pt-20'>
                    <SearchBoxNavbar changeBrand/>
                  </div>
                  <div className="grid grid-cols-5 w-screen xl:px-16 lg:px-12 px-8 py-4 h-[550px]">
                    <div className={`overflow-y-auto overflow-x-hidden border-r-2 z-40 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'}`}>
                      <ul className="gap-1 p-1">



                        
                        
                        {firstMenu.map((driver, index) => (
                          <NavigationMenuLink href={getHref(pathname, driver.href)} key={index}>
                            <div
                              onMouseEnter={() => {
                                setHoveredDriverMenu(driver.title);
                                setHoveredDriverSubMenu("");
                                setHoveredDriverSubSubMenu("");
                                setHoveredKitsMenu("");
                                setactivedriverhovered("");
                                setDriversSubMenu(driverSubMenuMapping[driver.title.concat('-', driver.parent)] || EmptyMenu);
                                setDriversSubSubMenu(EmptyMenu);
                                setDriversSubSubSubMenu(EmptyMenu);
                                setKitsSubMenu(EmptyMenu);
                                setDriversSubMenuUrl("");
                                setDriversSubSubMenuUrl("");
                                setDriversSubSubSubMenuUrl("");
                              }}
                              className={`px-2 transform duration-200 ${
                                hoveredDriverMenu === driver.title ? "translate-x-2" : ""
                              }`}
                            >
                              <div
                                className={`${styledDropdown} flex justify-between items-center align-middle ${
                                  hoveredDriverMenu === driver.title ? "text-primary" : pathname.includes('sbaudience') ? "text-white" : ''
                                }`}
                              >
                                {driver.title}
                                <ChevronRight
                                  size={15}
                                  className={`pb-1 ${
                                    hoveredDriverMenu === driver.title
                                      ? "text-primary"
                                      : ""
                                  }`}
                                />
                              </div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                          
                      </ul>
                    </div>
                    {driversubMenu && driverMenu.length > 0 && driversubsubMenu && driversubsubMenu.length > 0 &&
                      <div className={`overflow-y-auto overflow-x-hidden border-r-2 transform transition-all z-30 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'} ${driversubMenu[0]?.title === ''? '-translate-x-1/2' : 'translate-x-0'} ${driversubsubMenu[0]?.title!=''? '' : driversubMenuUrl===''? 'border-transparent' : ''}`}>
                        <ul className="gap-1 p-1">
                          {driversubMenu.map((products, index) => (
                            <div key={index} onMouseEnter={() => searchSubSubMenu(products.title, products.parent)} 
                              className={`px-2 transform duration-200 ${hoveredDriverSubMenu===products.title ? 'translate-x-2' : ''}`}
                            >
                              {products.parent===""? 
                                  <NavigationMenuLink href={getHref(pathname, products.href)}>
                                    <div className={`${styledDropdown} hover:text-primary ${activedriverhovered === products.title? 'text-primary': pathname.includes("sbaudience") ? 'text-white' : ''} ${products.tempAllFinished && products.tempAllFinished === true && 'text-green-500'}`} onMouseEnter={() => (setDriversSubMenuUrl(products.url), setPictureSlugUrl(products.href), setPictureDesc(products.imageDesc), setactivedriverhovered(products.title), setDriversSubSubMenu(EmptyMenu), setHoveredDriverSubMenu(''), setnameForHoveredPicture(products.title), setDriversSubSubMenuUrl('') ,setDriversSubSubSubMenuUrl(''))} >
                                    {products.newProd ? <>{products.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></> : products.title}
                                    </div>
                                  </NavigationMenuLink>
                              :
                                  <NavigationMenuLink href={getHref(pathname, products.href)}>
                                    <div className={`${styledDropdown} flex justify-between items-center align-middle ${hoveredDriverSubMenu===products.title ? 'text-primary' : pathname.includes("sbaudience") ? 'text-white' : ''}`} onMouseEnter={()=>(setDriversSubSubMenuUrl(''), setDriversSubSubSubMenuUrl(''), setactivedriverhovered(''))}>
                                      {products.title}
                                      <ChevronRight size={15} className={`pb-1 ${hoveredDriverSubMenu===products.title ? 'text-primary' : ''}`}/>
                                    </div>
                                  </NavigationMenuLink>
                              }
                            </div>
                          ))}
                        </ul>
                      </div>
                    }
                    {driversubMenu && driverMenu.length > 0 && driversubsubMenu && driversubsubMenu.length > 0 && driversubsubsubMenu && driversubsubsubMenu.length > 0 &&
                      <div className={`overflow-y-auto overflow-x-hidden border-r-2 transform transition-all z-20 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'} ${driversubMenuUrl === ''? '-translate-x-1/2' : 'translate-x-0'} ${driversubsubMenu[0]?.title === ''? '-translate-x-1/2' : 'translate-x-0'} ${driversubsubsubMenu[0]?.title!=''? '' : driversubsubMenuUrl===''? 'border-transparent': ''}`}>
                        <ul className="gap-1 p-1">
                          {driversubsubMenu.map((products, index) => (
                            <div key={index} onMouseEnter={() => searchSubSubSubMenu(products.title, products.parent)}
                            className={`px-2 transform duration-200 ${hoveredDriverSubSubMenu===products.title ? 'translate-x-2' : ''}`}
                            >
                              {products.parent===""? 
                                products.title != ''?
                                    <NavigationMenuLink href={getHref(pathname, products.href)}>
                                      <div className={`${styledDropdown} hover:text-primary ${activedriverhovered === products.title? 'text-primary': pathname.includes("sbaudience") ? 'text-white' : ''} ${products.tempAllFinished && products.tempAllFinished === true && 'text-green-500'}`} onMouseEnter={() => (setDriversSubSubMenuUrl(products.url), setPictureSlugUrl(products.href), setPictureDesc(products.imageDesc), setactivedriverhovered(products.title), setDriversSubSubSubMenu(EmptyMenu), setHoveredDriverSubSubMenu(''), setnameForHoveredPicture(products.title))}>
                                      {products.newProd ? <>{products.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></> : products.title}
                                      </div>
                                    </NavigationMenuLink>
                                :
                                  driversubMenuUrl != '' &&
                                      <NavigationMenuLink href={getHref(pathname, pictureSlugUrl)} className={`${pathname.includes("sbaudience") ? 'text-white' : ''}`}>
                                        <div className="relative overflow-hidden flex items-center justify-center h-full w-50" onMouseEnter={() => (setactivedriverhovered(nameForHoveredPicture))}>
                                          <LazyImageCustom src={driversubMenuUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubMenuUrl}` : driversubMenuUrl} alt={activedriverhovered} classname='w-50 h-fit z-10' width={500} height={500} lazy/>
                                        </div>
                                        <div className='flex justify-center items-center text-center h-full'>
                                          {pictureDesc}
                                        </div>
                                      </NavigationMenuLink>
                              : 
                                  <NavigationMenuLink href={getHref(pathname, products.href)}>
                                    <div className={`${styledDropdown} flex justify-between items-center align-middle ${hoveredDriverSubSubMenu===products.title ? 'text-primary' : pathname.includes("sbaudience") ? 'text-white' : ''}`} onMouseEnter={()=>(setDriversSubSubSubMenuUrl(''), setactivedriverhovered(''))}>
                                      {products.title}
                                      <ChevronRight size={15} className={`pb-1 ${hoveredDriverSubSubMenu===products.title ? 'text-primary' : ''}`}/>
                                    </div>
                                  </NavigationMenuLink>
                              }
                            </div>
                          ))}
                        </ul>
                      </div>
                    }
                    {driversubMenu && driverMenu.length > 0 && driversubsubMenu && driversubsubMenu.length > 0 && driversubsubsubMenu && driversubsubsubMenu.length > 0 &&
                      <div className={`overflow-y-auto overflow-x-hidden border-r-2 px-2 transform transition-all z-10 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'} ${driversubsubMenuUrl === ''? '-translate-x-1/2' : 'translate-x-0'} ${driversubsubsubMenu[0]?.title === ''? '-translate-x-1/2' : 'translate-x-0'} ${driversubsubsubMenuUrl===''? 'border-transparent' : ''}`}>
                        <ul className="gap-1 p-1">
                          {driversubsubsubMenu.map((products) => (
                            products.parent===""?
                              products.title != ''?
                                  <NavigationMenuLink key={products.title} href={getHref(pathname, products.href)}>
                                    <div className={`${styledDropdown} hover:text-primary ${activedriverhovered === products.title? 'text-primary': pathname.includes("sbaudience") ? 'text-white' : ''} ${products.tempAllFinished && products.tempAllFinished === true && 'text-green-500'}`} onMouseEnter={() => (setDriversSubSubSubMenuUrl(products.url), setPictureSlugUrl(products.href), setPictureDesc(products.imageDesc), setactivedriverhovered(products.title), setnameForHoveredPicture(products.title))}>
                                    {products.newProd ? <>{products.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></> : products.title}
                                    </div>
                                  </NavigationMenuLink>
                              :
                                driversubsubMenuUrl != '' &&
                                    <NavigationMenuLink href={getHref(pathname, pictureSlugUrl)} key={products.title} className={`${pathname.includes("sbaudience") ? 'text-white' : ''}`}>
                                      <div className="relative overflow-hidden flex items-center justify-center h-full w-50" onMouseEnter={() => (setactivedriverhovered(nameForHoveredPicture))}>
                                        <LazyImageCustom key={products.title} src={driversubsubMenuUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubsubMenuUrl}` : driversubsubMenuUrl} alt={activedriverhovered} classname='w-50 h-fit z-10' width={500} height={500} lazy/>
                                      </div>
                                      <div className='flex justify-center items-center text-center h-full'>
                                        {pictureDesc}
                                      </div>
                                    </NavigationMenuLink>
                            :
                                <NavigationMenuLink key={products.title} href={getHref(pathname, products.href)}>
                                  <div className={`${styledDropdown} flex justify-between items-center align-middle ${pathname.includes("sbaudience") ? 'text-white' : ''}`}>
                                    {products.title}
                                    <ChevronRight size={15} className='pb-1'/>
                                  </div>
                                </NavigationMenuLink>
                            ))
                          }
                        </ul>
                      </div>
                    }
                    <div className={`overflow-y-auto overflow-x-hidden transform transition-all z-0 ${pathname.includes("sbaudience") ? 'bg-foreground' : 'bg-background'} ${driversubsubsubMenuUrl === ''? '-translate-x-1/2' : 'translate-x-0'}`}>
                      <ul className="gap-1 p-1">
                        {driversubsubsubMenuUrl != '' &&
                            <NavigationMenuLink href={getHref(pathname, pictureSlugUrl)} className={`${pathname.includes("sbaudience") ? 'text-white' : ''}`}>
                              <div className="relative overflow-hidden flex items-center justify-center h-full w-50" onMouseEnter={() => (setactivedriverhovered(nameForHoveredPicture))}>

                                <LazyImageCustom src={driversubsubsubMenuUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubsubsubMenuUrl}` : driversubsubsubMenuUrl } alt={activedriverhovered} classname='w-50 h-fit z-10' width={500} height={500} lazy/>
                                </div>
                              <div className='flex justify-center items-center text-center h-full'>
                                {pictureDesc}
                              </div>
                            </NavigationMenuLink>
                        }
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              

              {pathname.includes('sbaudience') || pathname.includes('sbautomotive') ? null :
                <NavigationMenuItem>
                    <NavigationMenuLink href={getHref(pathname, 'kits')}>
                      <div className="p-0 relative z-101">
                        <NavigationMenuTrigger className={navigationMenuTriggerStyle().concat(" bg-transparent text-foreground hover:text-primary")} onMouseLeave={() => setOpenedContentForBg(false)} onMouseEnter={() => {
                          setKitsSubMenu(EmptyMenu)
                          setHoveredDriverMenu("");
                          setHoveredDriverSubMenu("");
                          setHoveredDriverSubSubMenu("");
                          setHoveredKitsMenu("");
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
                          Kits
                        </NavigationMenuTrigger>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuContent onMouseLeave={() => setOpenedContentForBg(false)} onMouseEnter={() => setOpenedContentForBg(true)}>
                    <div className='xl:pl-[72px] xl:pr-[72px] lg:pl-[56px] lg:pr-[56px] py-4 pt-20 bg-background'>
                        <SearchBoxNavbar changeBrand/>
                      </div>
                      <div className='grid grid-cols-5 w-screen xl:px-16 lg:px-12 px-8 py-4 h-[550px]'>
                        <div className='overflow-y-auto overflow-x-hidden border-r-2 z-40 bg-background'>
                          <ul className="gap-1 p-1">

                            {KitsMenu.map((kit, index) => (
                              <NavigationMenuLink href={getHref(pathname, kit.href)} key={index}>
                                <div
                                  onMouseEnter={() => {
                                    setKitsSubMenu(kitsSubMenuMapping[kit.title.concat('-', kit.parent)] || EmptyMenu)
                                    setHoveredDriverMenu("");
                                    setHoveredDriverSubMenu("");
                                    setHoveredDriverSubSubMenu("");
                                    setHoveredKitsMenu(kit.title);
                                    setDriversSubMenu(EmptyMenu);
                                    setDriversSubSubMenu(EmptyMenu);
                                    setDriversSubSubSubMenu(EmptyMenu);
                                    setDriversSubMenuUrl('');
                                    setactivedriverhovered("");
                                  }}
                                  className={`px-2 transform duration-200 ${hoveredKitsMenu === kit.title ? 'translate-x-2' : ''}`}
                                >
                                  <div className={`${styledDropdown} flex justify-between items-center align-middle ${hoveredKitsMenu === kit.title ? 'text-primary' : ''}`}>
                                    {kit.title}
                                    <ChevronRight size={15} className={`pb-1 ${hoveredKitsMenu=== kit.title ? 'text-primary' : ''}`}/>
                                  </div>
                                </div>
                              </NavigationMenuLink>
                            ))}
                            
                          </ul>
                        </div>
                        <div className={`overflow-y-auto overflow-x-hidden border-r-2 px-2 transform transition-all z-30 bg-background ${kitssubMenu.length>0 && kitssubMenu[0]?.title === ''? '-translate-x-1/2' : 'translate-x-0'} ${driversubMenuUrl===''? 'border-transparent' : ''}`}>
                          <ul className="gap-1 p-1">
                            {kitssubMenu.map((products, index) => (
                              products.parent === ""?
                                  <NavigationMenuLink key={index} href={getHref(pathname, products.href)}>
                                    <div className={`${styledDropdown} hover:text-primary ${activedriverhovered === products.title? 'text-primary': ''} ${products.tempAllFinished && products.tempAllFinished === true && 'text-green-500'}`} onMouseEnter={() => (setDriversSubMenuUrl(products.url), setPictureSlugUrl(products.href), setPictureDesc(products.imageDesc), setactivedriverhovered(products.title),setnameForHoveredPicture(products.title))}>
                                    {products.newProd ? <>{products.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></> : products.title}
                                    </div>
                                  </NavigationMenuLink>
                              :
                                  <NavigationMenuLink key={index} href={getHref(pathname, products.href)}>
                                    <div className={`${styledDropdown} flex justify-between items-center align-middle ${hoveredDriverSubMenu===products.title ? 'text-primary' : ''}`} onMouseEnter={()=>(setDriversSubSubMenuUrl(''), setDriversSubSubSubMenuUrl(''), setactivedriverhovered(''))}>
                                      {products.title}
                                      <ChevronRight size={15} className='pb-1'/>
                                    </div>
                                  </NavigationMenuLink>
                              ))
                            }
                          </ul>
                        </div>
                        <div className={`overflow-y-auto overflow-x-hidden transform transition-all z-20 bg-background ${driversubMenuUrl === ''? '-translate-x-1/2' : 'translate-x-0'}`}>
                          <ul className="gap-1 p-1">
                            {driversubMenuUrl != '' &&
                                <NavigationMenuLink href={getHref(pathname, pictureSlugUrl)}>
                                  <div className="relative overflow-hidden flex items-center justify-center h-full w-50" onMouseEnter={() => (setactivedriverhovered(nameForHoveredPicture))}>
                                    
                                    <LazyImageCustom src={driversubMenuUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubMenuUrl}` : driversubMenuUrl} alt={activedriverhovered} classname='w-50 h-fit z-10' width={500} height={500} lazy/>
                                  </div>
                                  <div className='flex justify-center items-center text-center h-full'>
                                    {pictureDesc}
                                  </div>
                                </NavigationMenuLink>
                            }    
                          </ul>
                        </div>
                      </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
              }

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
                        setKitsSubMenu(EmptyMenu)
                        setHoveredDriverMenu("");
                        setHoveredDriverSubMenu("");
                        setHoveredDriverSubSubMenu("");
                        setHoveredKitsMenu("");
                        setDriversSubMenu(EmptyMenu);
                        setDriversSubSubMenu(EmptyMenu);
                        setDriversSubSubSubMenu(EmptyMenu);
                        setPictureSlugUrl('');
                        setPictureDesc('');
                        setactivedriverhovered('');
                        setDriversSubMenuUrl('');
                        setDriversSubSubMenuUrl('');
                        setDriversSubSubSubMenuUrl('');
                        setactivekitshovered('');
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
                                <div className={`${styledDropdown} hover:text-primary ${activedriverhovered === products.name? 'text-primary': pathname.includes("sbaudience") ? 'text-white' : ''}`} onMouseEnter={() => (setDriversSubMenuUrl(products.image_url), setPictureSlugUrl(products.href), setPictureDesc(products.navbarNotes), setactivekitshovered(''), setactivedriverhovered(products.name),setnameForHoveredPicture(products.name))}>
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
                                  <div className={`${styledDropdown} hover:text-primary ${activekitshovered === products.name? 'text-primary': pathname.includes("sbaudience") ? 'text-white' : ''}`} onMouseEnter={() => (setDriversSubMenuUrl(products.image_url), setPictureSlugUrl(products.href), setPictureDesc(products.navbarNotes), setactivedriverhovered(''), setactivekitshovered(products.name),setnameForHoveredPicture(products.name))}>
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
                              <NavigationMenuLink href={getHref(pathname, pictureSlugUrl)} className={`${pathname.includes("sbaudience") ? 'text-white' : ''}`}>
                                <div className="relative overflow-hidden flex items-center justify-center h-full w-50" onMouseEnter={() => (setactivedriverhovered(nameForHoveredPicture))}>
                                  <LazyImageCustom src={driversubMenuUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${driversubMenuUrl}` : driversubMenuUrl} alt={activedriverhovered} classname='w-50 h-fit z-10' width={500} height={500} lazy/>
                                </div>
                                <div className='flex justify-center items-center text-center h-full'>
                                  {pictureDesc}
                                </div>
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

              {pathname.includes('sbaudience') &&
              <NavigationMenuItem>
                  <NavigationMenuLink href={getHref(pathname, 'application')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                    <div className="p-0 relative z-101">
                      Application
                    </div>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              }

              {!pathname.includes('sbaudience') &&
              <NavigationMenuItem>
                  <NavigationMenuLink href={getHref(pathname, 'technical')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                    <div className="p-0 relative z-101">
                      Technical
                    </div>
                  </NavigationMenuLink>
              </NavigationMenuItem>
              }


              <NavigationMenuItem>
                {/* <Link href="/distributors" passHref> */}
                  <NavigationMenuLink href={getHref(pathname, 'distributors')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                    <div className="p-0 relative z-101">
                      Distributors
                    </div>
                  </NavigationMenuLink>
              </NavigationMenuItem>


              <NavigationMenuItem>
                {/* <Link href="/contact" passHref> */}
                  <NavigationMenuLink href={getHref(pathname, 'contact')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                    <div className="p-0 relative z-101">
                      Contact
                    </div>
                  </NavigationMenuLink>
                {/* </Link> */}
              </NavigationMenuItem>

              {pathname.includes('sbautomotive') &&
                <NavigationMenuItem>
                  {/* <Link href="/contact" passHref> */}
                    <NavigationMenuLink href={getHref(pathname, 'certificate')} className={navigationMenuTriggerStyle().concat(" bg-transparent")}>
                      <div className="p-0 relative z-101">
                        Certificate
                      </div>
                    </NavigationMenuLink>
                  {/* </Link> */}
                </NavigationMenuItem>
              }
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className={`w-1/4 hidden xl:flex justify-end`}>
          <SearchBox changeBrand/>
        </div>


        <div className='flex xl:hidden'>
          <Sheet open={isLgScreen?false:undefined}>
            <SheetTrigger asChild>
              <Button variant={null} className='w-fit p-0' aria-label='Mobile Menu'>
                <Menu size={30} />
              </Button>
            </SheetTrigger>
            {/* <SheetContent className={`w-full h-auto p-0 z-50 overflow-y-auto ${pathname.includes('sbaudience') ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}> */}
            <SheetContent className={`w-full h-auto p-0 z-50 ${pathname.includes('sbaudience') ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}>
              <div className="overflow-y-auto max-h-screen">
                <div className='pt-4 pl-6'>
                  <SearchLightbox changeBrand/>
                </div>
                <SheetTitle/>
                <SheetDescription/>
                <div className="grid pt-2"> 
                  <Accordion type="single" collapsible className="w-full px-6">
                    <AccordionItem value="item-1">
                      <AccordionTrigger onClick={() =>{
                        setDriversMenu(DriversMenu)
                      }} 
                      className='hover:text-primary px-2'>
                        Drivers
                      </AccordionTrigger>
                      <AccordionContent>
                        {/* <Button asChild variant={"default"} className='w-full '> */}
                        <Link href={getHref(pathname, 'drivers')} className='w-full'>
                          <SheetClose className='w-full flex text-center justify-center p-1 bg-primary text-white rounded-xl'>
                            Show All Drivers
                          </SheetClose>
                        </Link>
                        {/* </Button> */}
                        <Accordion type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-50'} w-full pl-2 rounded-lg`}>
                          {firstMenu.map((menu, indexdriver) => 
                            <AccordionItem key={menu.title} value={"item-".concat(indexdriver.toString())}>
                              {menu.parent===""? 
                                <Link href={getHref(pathname, menu.href)} key={menu.title}>
                                  <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                  <Image src={menu.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${menu.url}` : menu.url} alt={menu.title} width={100} height={100} className='object-contain max-h-14 w-fit col-span-1'/>
                                  {menu.newProd ? <div className="col-span-5">{menu.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></div> : <div className="col-span-5">{menu.title}</div>}
                                  </SheetClose>
                                </Link>
                              :
                                <AccordionTrigger value={menu.title} onClick={() =>{
                                  searchSubMenu(menu.title, menu.parent)
                                }} className='hover:text-primary px-2'>
                                  {menu.title}
                                </AccordionTrigger>
                              }
                              <AccordionContent>
                                <Link href={getHref(pathname, menu.href)} className='w-full'>
                                  <SheetClose className='w-full flex text-center justify-center p-1 bg-primary text-white rounded-xl'>
                                    Show All {menu.title === 'Widebanders / Full Ranges' ? 'Widebanders' : menu.title}
                                  </SheetClose>
                                </Link>
                                <Accordion type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-700' : 'bg-zinc-100'} w-full pl-2 rounded-lg`}>
                                  {driversubMenu.map((submenu) => 
                                    <AccordionItem key={submenu.title} value={submenu.title}>
                                      {submenu.parent===""? 
                                        <Link key={submenu.title} href={getHref(pathname, submenu.href)}>
                                          <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                            <Image src={submenu.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${submenu.url}` : submenu.url} alt={submenu.title} width={100} height={100} className='object-contain max-h-14 w-fit col-span-1'/>
                                            {submenu.newProd ? <div className="col-span-5">{submenu.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></div> : <div className="col-span-5">{submenu.title}</div>}
                                          </SheetClose>
                                        </Link>
                                      :
                                        <AccordionTrigger value={submenu.title} onClick={() =>{
                                          searchSubSubMenu(submenu.title, submenu.parent)
                                        }} className='hover:text-primary px-2'>
                                          {submenu.title}
                                        </AccordionTrigger>
                                      }
                                      <AccordionContent>
                                        <Link href={getHref(pathname, submenu.href)} className='w-full'>
                                          <SheetClose className='w-full flex text-center justify-center p-1 bg-primary text-white rounded-xl'>
                                            Show All {submenu.title}
                                          </SheetClose>
                                        </Link>
                                        <Accordion type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-600' : 'bg-zinc-200'} w-full pl-2 rounded-lg`}> 
                                          {driversubsubMenu.map((subsubmenu) =>
                                            <AccordionItem key={subsubmenu.title} value={subsubmenu.title}>
                                              {subsubmenu.parent===""? 
                                                <Link key={subsubmenu.title} href={getHref(pathname, subsubmenu.href)}>
                                                  <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                                  <Image src={subsubmenu.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${subsubmenu.url}` : subsubmenu.url} alt={subsubmenu.title} width={100} height={100} className='object-cover max-h-14 w-fit col-span-1'/>
                                                    {subsubmenu.newProd ? <div className="col-span-5">{subsubmenu.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></div> : <div className="col-span-5">{subsubmenu.title}</div>}
                                                  </SheetClose>
                                                </Link>
                                              :
                                                <AccordionTrigger value={subsubmenu.title} onClick={() =>{
                                                  searchSubSubSubMenu(subsubmenu.title, subsubmenu.parent)
                                                }} className='hover:text-primary px-2'>
                                                  {subsubmenu.title}
                                                </AccordionTrigger>
                                              }
                                              <AccordionContent className={`${pathname.includes('sbaudience') ? 'bg-zinc-500' : 'bg-zinc-300'} rounded-lg`}>
                                                <Link href={getHref(pathname, subsubmenu.href)} className='w-full'>
                                                  <SheetClose className='w-full flex text-center justify-center p-1 bg-primary text-white rounded-xl'>
                                                    Show All {subsubmenu.title}
                                                  </SheetClose>
                                                </Link>
                                                {driversubsubsubMenu.map((subsubsubmenu) => 
                                                  <Link key={subsubsubmenu.title} href={getHref(pathname, subsubsubmenu.href)}>
                                                    <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                                      <Image src={subsubsubmenu.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${subsubsubmenu.url}` : subsubsubmenu.url} alt={subsubsubmenu.title} width={100} height={100} className='object-cover max-h-14 w-fit col-span-1'/>
                                                      {subsubsubmenu.newProd ? <div className="col-span-5">{subsubsubmenu.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></div> : <div className="col-span-5">{subsubsubmenu.title}</div>}
                                                    </SheetClose>
                                                  </Link>
                                                )}
                                              </AccordionContent>
                                            </AccordionItem>
                                          )}
                                        </Accordion>
                                      </AccordionContent>
                                    </AccordionItem>
                                  )}
                                </Accordion>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                    {pathname.includes('sbaudience') || pathname.includes('sbautomotive') ? null :
                    <AccordionItem value="item-2">
                      <AccordionTrigger onClick={() =>{
                        setKitMenu(KitsMenu)
                      }} className='hover:text-primary px-2'>
                        Kits
                      </AccordionTrigger>
                      <AccordionContent>
                        <Link href={getHref(pathname, 'kits')} className='w-full'>
                          <SheetClose className='w-full flex text-center justify-center p-1 bg-primary text-white rounded-xl'>
                            Show All Kits
                          </SheetClose>
                        </Link>
                        <Accordion type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-50'} w-full pl-2 rounded-lg`}>
                          {kitMenu.map((kits) => 
                            <AccordionItem key={kits.title} value={kits.title}>
                              {kits.parent===""? 
                                <Link href={getHref(pathname, kits.href)} key={kits.title}>
                                  <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                    <Image src={kits.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${kits.url}` : kits.url} alt={kits.title} width={100} height={100} className='object-cover max-h-14 w-fit col-span-1'/>
                                    {kits.newProd ? <div className="col-span-5">{kits.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></div> : <div className="col-span-5">{kits.title}</div>}
                                  </SheetClose>
                                </Link>
                              :
                                <AccordionTrigger onClick={() =>{
                                  searchKitsMenu(kits.title, kits.parent)
                                }} className='hover:text-primary px-2'>
                                  {kits.title}
                                </AccordionTrigger>
                              }
                              <AccordionContent>
                                <Link href={getHref(pathname, kits.href)} className='w-full'>
                                  <SheetClose className='w-full flex text-center justify-center p-1 bg-primary text-white rounded-xl'>
                                    Show All {kits.title}
                                  </SheetClose>
                                </Link>
                                {kitssubMenu.map((kitsubmenu, index) => 
                                  <Accordion key={kitsubmenu.title} type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-700' : 'bg-zinc-100'} w-full pl-2 ${index === 0 ? 'rounded-t-lg' : index === kitssubMenu.length -1 ? 'rounded-b-lg' : 'rounded-none'}`}>
                                    <AccordionItem key={kitsubmenu.title} value={kitsubmenu.title.concat(index.toString())}> 
                                      <Link key={kitsubmenu.title} href={getHref(pathname, kitsubmenu.href)}>
                                        <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                          <Image src={kitsubmenu.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${kitsubmenu.url}` : kitsubmenu.url} alt={kitsubmenu.title} width={100} height={100} className='object-cover max-h-14 w-fit col-span-1'/>
                                          {kitsubmenu.newProd ? <div className="col-span-5">{kitsubmenu.title.split(" / ")[0]} <div className="inline-flex text-primary">NEW</div></div> : <div className="col-span-5">{kitsubmenu.title}</div>}
                                        </SheetClose>
                                      </Link>
                                    </AccordionItem>
                                  </Accordion>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                    }
                    <AccordionItem value="item-3">
                      <AccordionTrigger className='hover:text-primary px-2'>
                        New Products
                      </AccordionTrigger>
                      <AccordionContent>
                        <Accordion type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-50'} w-full pl-2 rounded-lg`}>
                          <AccordionItem key={'New Drivers'} value={'New Drivers'}>
                            <AccordionTrigger className='hover:text-primary px-2'>
                              Drivers
                            </AccordionTrigger>
                            <AccordionContent>
                              {newProductsMenu.map((newsubmenu, index) => 
                                <Accordion key={newsubmenu.name} type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-700' : 'bg-zinc-100'} w-full pl-2 ${index === 0 ? 'rounded-t-lg' : index === newProductsMenu.length -1 ? 'rounded-b-lg' : 'rounded-none'}`}>
                                  <AccordionItem key={newsubmenu.name} value={newsubmenu.name.concat(index.toString())}> 
                                    <Link key={newsubmenu.name} href={getHref(pathname, newsubmenu.href)}>
                                      <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                          <Image src={newsubmenu.image_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${newsubmenu.image_url}` : newsubmenu.image_url} alt={newsubmenu.name} width={100} height={100} className='object-cover max-h-14 w-fit col-span-1'/>
                                        <div className="col-span-5">{newsubmenu.name} <div className="inline-flex text-primary">NEW</div></div>
                                      </SheetClose>
                                    </Link>
                                  </AccordionItem>
                                </Accordion>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                          {pathname.includes('sbaudience') || pathname.includes('sbautomotive') ? null :
                          <AccordionItem key={'New Kits'} value={'New Kits'}>
                            <AccordionTrigger className='hover:text-primary px-2'>
                              Kits
                            </AccordionTrigger>
                            <AccordionContent>
                              {newKitsMenu.map((newsubmenu, index) => 
                                <Accordion key={newsubmenu.name} type="single" collapsible className={`${pathname.includes('sbaudience') ? 'bg-zinc-700' : 'bg-zinc-100'} w-full pl-2 ${index === 0 ? 'rounded-t-lg' : index === newKitsMenu.length -1 ? 'rounded-b-lg' : 'rounded-none'}`}>
                                  <AccordionItem key={newsubmenu.name} value={newsubmenu.name.concat(index.toString())}> 
                                    <Link key={newsubmenu.name} href={getHref(pathname, newsubmenu.href)}>
                                      <SheetClose className='p-2 w-full hover:text-primary text-left items-center gap-2 grid grid-cols-6'>
                                          <Image src={newsubmenu.image_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${newsubmenu.image_url}` : newsubmenu.image_url} alt={newsubmenu.name} width={100} height={100} className='object-cover max-h-14 w-fit col-span-1'/>
                                        <div className="col-span-5">{newsubmenu.name} <div className="inline-flex text-primary">NEW</div></div>
                                      </SheetClose>
                                    </Link>
                                  </AccordionItem>
                                </Accordion>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                          }
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                {pathname.includes('sbaudience') && 
                  <>
                    <Button variant={null} asChild className='px-6 py-0'>
                      <Link href={getHref(pathname, 'application')} className='p-0'>
                        <SheetClose className='w-full text-base text-left hover:text-primary pl-2'>
                          Application
                        </SheetClose>
                      </Link>
                    </Button>
                  </>
                }
                {!pathname.includes('sbaudience') &&
                  <Button variant={null} asChild className='px-6 py-0'>
                    <Link href={getHref(pathname, 'technical')} className='p-0'>
                      <SheetClose className='w-full text-base text-left hover:text-primary pl-2'>
                        Technical
                      </SheetClose>
                    </Link>
                  </Button>
                }
                  <Button variant={null} asChild className='px-6 py-0'>
                    <Link href={getHref(pathname, 'distributors')} className='p-0'>
                      <SheetClose className='w-full text-base text-left hover:text-primary pl-2'>
                        Distributors
                      </SheetClose>
                    </Link>
                  </Button>
                  <Button variant={null} asChild className='px-6 py-0'>
                    <Link href={getHref(pathname, 'contact')} className='p-0'>
                      <SheetClose className='w-full text-base text-left hover:text-primary pl-2'>
                        Contact
                      </SheetClose>
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
    </div>




    
      <div className={`${height > 600 ? 'fixed' : 'absolute'} 
        ${scrolled ? '-top-8' : 'top-0'} transition-all duration-300 ease-in-out left-0 z-35 w-screen flex items-start justify-left`}>
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