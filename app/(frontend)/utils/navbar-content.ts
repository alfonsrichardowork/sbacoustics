import { NavbarComponents } from "../types"


export const allDriverCatForGenerateStaticParams = [
  'tweeters',
  'widebanders',
  'midranges',
  'midwoofers',
  'woofers',
  'subwoofers',
  'passive-radiators',
  'coaxials',
  'oem',
  'full-ranges',
  'shallow-subwoofers'
]

export const allDriverSubCatForGenerateStaticParams = [
  ['tweeters', 'satori-tweeters'],
  ['tweeters', 'dome-tweeters'],
  ['tweeters', 'ring-radiators'],
  ['midranges', 'satori-midranges'],
  ['midranges', 'nrx-midranges'],
  ['midwoofers', 'satori-midwoofers'],
  ['midwoofers', 'cac-midwoofers'],
  ['midwoofers', 'nbac-midwoofers'],
  ['midwoofers', 'crc-midwoofers'],
  ['midwoofers', 'mfc-midwoofers'],
  ['midwoofers', 'nrx-midwoofers'],
  ['midwoofers', 'pfcr-midwoofers'],
  ['midwoofers', 'sfcr-midwoofers'],
  ['midwoofers', 'pac-midwoofers'],
  ['woofers', 'satori-woofers'],
  ['woofers', 'cac-woofers'],
  ['woofers', 'nbac-woofers'],
  ['woofers', 'nrx-woofers'],
  ['woofers', 'pfcr-woofers'],
  ['woofers', 'sfcl-woofers'],
  ['oem', 'tweeters-oem'],
  ['oem', 'midranges-oem'],
  ['oem', 'midwoofers-oem'],
  ['oem', 'woofers-oem'],
  ['oem', 'subwoofers-oem'],
  ['oem', 'shallow-subwoofers-oem'],
  ['oem', 'passive-radiators-oem'],
  ['oem', 'coaxials-oem'],
  ['oem', 'satori-midwoofers-oem'],
  ['oem', 'nbac-midwoofers-oem'],
  ['oem', 'nrx-midwoofers-oem'],
  ['oem', 'pfcr-midwoofers-oem']
]

export const allKitsCatForGenerateStaticParams = [
  'sb-acoustics-kits',
  'open-source-kits',
  'accessories',
]

//MENU
export const DriversMenu: NavbarComponents[] = [
  {
    title: "Tweeters",
    href: "/drivers/tweeters",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: false
  },
  {
    title: "Widebanders / Full Ranges",
    href: "/drivers/widebanders",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Midranges",
    href: "/drivers/midranges",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: false
  },
  {
    title: "Midwoofers",
    href: "/drivers/midwoofers",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: false
  },
  {
    title: "Woofers",
    href: "/drivers/woofers",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: false
  },
  {
    title: "Subwoofers",
    href: "/drivers/subwoofers",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Passive Radiators",
    href: "/drivers/passive-radiators",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Coaxials",
    href: "/drivers/coaxials",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "OEM",
    href: "/drivers/oem",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: false
  },
]
export const KitsMenu: NavbarComponents[] = [
  {
    title: "SB Acoustics Kits",
    href: "/kits/sb-acoustics-kits",
    parent: "Kits",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Open Source Kits",
    href: "/kits/open-source-kits",
    parent: "Kits",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Accessories",
    href: "/kits/accessories",
    parent: "Kits",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  // {
  //   title: "Discontinued",
  //   href: "/kits/discontinued",
  //   parent: "Kits",
  //   url: "",
  //   imageDesc: "",
  //   priority: "",
  //   newProd: false,
  //   hasProduct: true
  // },
]

//SUB MENU
export const TweetersSubMenu: NavbarComponents[] = [
  {
    title: "SATORI Tweeters",
    href: "/drivers/tweeters/satori-tweeters",
    parent: "Tweeters",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Dome Tweeters",
    href: "/drivers/tweeters/dome-tweeters",
    parent: "Tweeters",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Ring Radiators",
    href: "/drivers/tweeters/ring-radiators",
    parent: "Tweeters",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]
export const MidrangesSubMenu: NavbarComponents[] = [
  // {
  //   title: "Filler Drivers",
  //   href: "/drivers/filler-drivers",
  //   parent: "Midranges",
  //   url: "",
  //   imageDesc: "",
  //   priority: "",
  //   newProd: false,
  //   hasProduct: true
  // },
  {
    title: "SATORI Midranges",
    href: "/drivers/midranges/satori-midranges",
    parent: "Midranges",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "NRX Midranges",
    href: "/drivers/midranges/nrx-midranges",
    parent: "Midranges",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]
export const MidwoofersSubMenu: NavbarComponents[] = [
  {
    title: "SATORI Midwoofers",
    href: "/drivers/midwoofers/satori-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "CAC Midwoofers",
    href: "/drivers/midwoofers/cac-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "NBAC Midwoofers",
    href: "/drivers/midwoofers/nbac-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "CRC Midwoofers",
    href: "/drivers/midwoofers/crc-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "MFC Midwoofers",
    href: "/drivers/midwoofers/mfc-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "NRX Midwoofers",
    href: "/drivers/midwoofers/nrx-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "PFCR Midwoofers",
    href: "/drivers/midwoofers/pfcr-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "SFCR Midwoofers",
    href: "/drivers/midwoofers/sfcr-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "PAC Midwoofers",
    href: "/drivers/midwoofers/pac-midwoofers",
    parent: "Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]
export const WoofersSubMenu: NavbarComponents[] = [
  {
    title: "SATORI Woofers",
    href: "/drivers/woofers/satori-woofers",
    parent: "Woofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "CAC Woofers",
    href: "/drivers/woofers/cac-woofers",
    parent: "Woofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "NBAC Woofers",
    href: "/drivers/woofers/nbac-woofers",
    parent: "Woofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "NRX Woofers",
    href: "/drivers/woofers/nrx-woofers",
    parent: "Woofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "PFCR Woofers",
    href: "/drivers/woofers/pfcr-woofers",
    parent: "Woofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "SFCL Woofers",
    href: "/drivers/woofers/sfcl-woofers",
    parent: "Woofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]
export const OEMSubMenu: NavbarComponents[] = [
  {
    title: "Tweeters OEM",
    href: "/drivers/oem/tweeters-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Midranges OEM",
    href: "/drivers/oem/midranges-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Midwoofers OEM",
    href: "/drivers/oem/midwoofers-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: false
  },
  {
    title: "Woofers OEM",
    href: "/drivers/oem/woofers-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Subwoofers OEM",
    href: "/drivers/oem/subwoofers-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Shallow Subwoofers OEM",
    href: "/drivers/oem/shallow-subwoofers-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Passive Radiators OEM",
    href: "/drivers/oem/passive-radiators-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Coaxials OEM",
    href: "/drivers/oem/coaxials-oem",
    parent: "OEM",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]
//SUB MENU EXCEPTIONS
export const WidebandersDefaultSubMenu: NavbarComponents[] = [
  {
    title: "Full Ranges",
    href: "/drivers/full-ranges",
    parent: "Widebanders / Full Ranges",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]
export const SubwoofersDefaultSubMenu: NavbarComponents[] = [
  {
    title: "Shallow Subwoofers",
    href: "/drivers/shallow-subwoofers",
    parent: "Subwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]

//SUB SUB MENU
export const OEMMidwoofersSubMenu: NavbarComponents[] = [
  {
    title: "SATORI Midwoofers OEM",
    href: "/drivers/oem/satori-midwoofers-oem",
    parent: "OEM Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "NBAC Midwoofers OEM",
    href: "/drivers/oem/nbac-midwoofers-oem",
    parent: "OEM Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "NRX Midwoofers OEM",
    href: "/drivers/oem/nrx-midwoofers-oem",
    parent: "OEM Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "PFCR Midwoofers OEM",
    href: "/drivers/oem/pfcr-midwoofers-oem",
    parent: "OEM Midwoofers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]

//EMPTY MENU
export const EmptyMenu: NavbarComponents[] = [
  {
    title: "",
    href: "",
    parent: "",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: false
  },
]






//SB AUDIENCE

export const allDriverCatSBAudienceForGenerateStaticParams = [
  'subwoofers',
  'horn',
  'coaxials',
  'open-baffle-drivers',
  'woofers',
  'compression-drivers'
]

export const DriversSBAudienceMenu: NavbarComponents[] = [
  {
    title: "Compression Drivers",
    href: "/drivers/compression-drivers",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Woofers",
    href: "/drivers/woofers",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Subwoofers",
    href: "/drivers/subwoofers",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Open Baffle Drivers",
    href: "/drivers/open-baffle-drivers",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Coaxials",
    href: "/drivers/coaxials",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
  {
    title: "Horn",
    href: "/drivers/horn",
    parent: "Drivers",
    url: "",
    imageDesc: "",
    priority: "",
    newProd: false,
    hasProduct: true
  },
]



//SB AUTOMOTIVE

export const allDriverCatSBAutomotiveForGenerateStaticParams = []

export const DriversSBAutomotiveMenu: NavbarComponents[] = []