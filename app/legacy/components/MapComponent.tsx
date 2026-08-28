// "use client"

// import React, { useEffect, useMemo, useRef, useState } from "react"
// import {
//   Facebook,
//   Globe,
//   Instagram,
//   Mail,
//   MapPin,
//   Phone,
// } from "lucide-react"
// import Link from "next/link"
// import { distributors } from "@prisma/client"
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// //@ts-ignore
// import "leaflet/dist/leaflet.css";
// import { LatLngExpression } from "leaflet";
// import L from "leaflet";
// //@ts-ignore
// import 'mapbox-gl/dist/mapbox-gl.css'
// import { usePathname } from "next/navigation"

// interface DistributorProps {
//   asianDistributors: distributors[]
//   europeDistributors: distributors[]
//   americaDistributors: distributors[]
//   oceaniaDistributors: distributors[]
//   africaDistributors: distributors[]
//   antarticaDistributors: distributors[]
// }

// const getIcons = () => {
//   const defaultIcon = new L.Icon({
//     iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
//     iconSize: [20, 35],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//     shadowSize: [30, 30],
//   });

//   const activeIcon = new L.Icon({
//     iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//     iconSize: [30, 50],
//     iconAnchor: [15, 50],
//     popupAnchor: [1, -34],
//     shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//     shadowSize: [41, 41],
//   });

//   return { defaultIcon, activeIcon };
// };

// function createPinIcon(active: boolean) {
//   const color = active ? "#dc2626" : "#2563eb"

//   return L.divIcon({
//     className: "",
//     iconSize: [28, 36],
//     iconAnchor: [14, 36],
//     popupAnchor: [0, -36],
//     html: `
//       <div style="
//         width: 24px;
//         height: 24px;
//         background: ${color};
//         border: 3px solid #ffffff;
//         border-radius: 50% 50% 50% 0;
//         box-shadow: 0 2px 6px rgba(0,0,0,.35);
//         transform: rotate(-45deg);
//       ">
//         <div style="
//           width: 8px;
//           height: 8px;
//           margin: 5px;
//           background: #ffffff;
//           border-radius: 50%;
//         "></div>
//       </div>
//     `,
//   })
// }

// function FocusMap({ distributor }: { distributor?: distributors }) {
//   const map = useMap()

//   React.useEffect(() => {
//     if (!distributor) return

//     const position: [number, number] = [
//       Number(distributor.lat),
//       Number(distributor.lng),
//     ]

//     if (Number.isFinite(position[0]) && Number.isFinite(position[1])) {
//       map.setView(position, 4, { animate: false })
//     }
//   }, [distributor, map])

//   return null
// }

// const styles: Record<string, React.CSSProperties> = {
//   page: {
//     width: "100%",
//     color: "#18181b",
//     fontFamily: "Arial, sans-serif",
//   },
//   hiddenTitle: {
//     position: "absolute",
//     width: "1px",
//     height: "1px",
//     padding: 0,
//     margin: "-1px",
//     overflow: "hidden",
//     clip: "rect(0, 0, 0, 0)",
//     whiteSpace: "nowrap",
//     border: 0,
//   },
//   mapSection: {
//     position: "relative",
//     width: "100%",
//     minHeight: "400px",
//   },
//   activePanelWrapper: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     width: "100%",
//     padding: "0 32px",
//     boxSizing: "border-box",
//   },
//   activePanel: {
//     width: "100%",
//     padding: "20px",
//     backgroundColor: "rgba(255, 255, 255, 0.85)",
//     backdropFilter: "blur(4px)",
//     boxSizing: "border-box",
//   },
//   activeTitle: {
//     marginBottom: "16px",
//     textAlign: "center",
//     fontSize: "20px",
//     fontWeight: 700,
//   },
//   detailsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//     gap: "10px 20px",
//     fontSize: "15px",
//   },
//   detail: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     minWidth: 0,
//   },
//   detailText: {
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
//   link: {
//     color: "inherit",
//     textDecoration: "underline",
//   },
//   distributorsSection: {
//     padding: "64px 32px",
//     boxSizing: "border-box",
//   },
//   heading: {
//     margin: "0 0 24px",
//     textAlign: "center",
//     fontSize: "30px",
//     fontWeight: 700,
//   },
//   cardsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//     gap: "16px",
//   },
//   card: {
//     width: "100%",
//     maxHeight: "500px",
//     overflowY: "auto",
//     border: "1px solid #e4e4e7",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//   },
//   cardHeader: {
//     padding: "16px",
//     backgroundColor: "#3f3f46",
//     color: "#ffffff",
//     fontSize: "18px",
//     fontWeight: 700,
//   },
//   cardContent: {
//     padding: "12px",
//   },
//   distributorButton: {
//     display: "block",
//     width: "100%",
//     padding: "12px",
//     marginBottom: "8px",
//     border: 0,
//     backgroundColor: "transparent",
//     color: "#18181b",
//     textAlign: "left",
//     cursor: "pointer",
//   },
//   country: {
//     margin: 0,
//     fontSize: "18px",
//     fontWeight: 400,
//   },
//   name: {
//     margin: "4px 0 0",
//     fontSize: "15px",
//     fontWeight: 600,
//   },
// }

// export const DistributorMap: React.FC<DistributorProps> = ({
//   asianDistributors,
//   europeDistributors,
//   americaDistributors,
//   oceaniaDistributors,
//   africaDistributors,
//   antarticaDistributors,
// }) => {
//   // const [activeMap, setActiveMap] = useState<distributors | undefined>(
//   //   asianDistributors[0]
//   // )
//   //   // const [isScrolling, setIsScrolling] = useState(false);
//   //   // const [center, setCenter]= useState<LatLngExpression>([Number(asianDistributors[1]?.lat ?? 0), Number(asianDistributors[1]?.lng ?? 0)]);
//   //   // const [icons, setIcons] = useState<{ defaultIcon: L.Icon; activeIcon: L.Icon } | null>(null);
//   //   // const mapRef = useRef<L.Map | null>(null);
//   //   // const pathname = usePathname();
//   //   // const allDistributors = [
//   //   //   ...asianDistributors,
//   //   //   ...europeDistributors,
//   //   //   ...americaDistributors,
//   //   //   ...oceaniaDistributors,
//   //   //   ...africaDistributors,
//   //   //   ...antarticaDistributors
//   //   // ]
  
//   //   // // Initialize icons on client only
//   //   // useEffect(() => {
//   //   //   setIcons(getIcons());
//   //   // }, []);
  
//   //   // useEffect(() => {
//   //   //   const fetchIpAndSetMap = async () => {
//   //   //     try {
//   //   //       const res = await fetch('/api/ip');
//   //   //       const data = await res.json();
//   //   //       const res_2 = await fetch(`https://ipapi.co/${data.ip}/json/`);
//   //   //       const data_2 = await res_2.json();
  
    
          
//   //   //       const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//   //   //         const toRad = (value: number) => (value * Math.PI) / 180;
//   //   //         const R = 6371; // Earth radius in km
          
//   //   //         const dLat = toRad(lat2 - lat1);
//   //   //         const dLon = toRad(lon2 - lon1);
//   //   //         const a =
//   //   //           Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//   //   //           Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//   //   //           Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   //   //         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          
//   //   //         return R * c;
//   //   //       };
          
//   //   //       const closestDistributor = allDistributors.reduce((closest, distributor) => {
//   //   //         const distributorDistance = getDistance(data_2.latitude, data_2.longitude, Number(distributor.lat), Number(distributor.lng));
//   //   //         const closestDistance = getDistance(data_2.latitude, data_2.longitude, Number(closest?.lat ?? 0), Number(closest?.lng ?? 0));
          
//   //   //         return distributorDistance < closestDistance ? distributor : closest;
//   //   //       }, asianDistributors[0]);
          
//   //   //       setActiveMap(closestDistributor);
//   //   //       setCenter([Number(closestDistributor?.lat ?? 0), Number(closestDistributor?.lng ?? 0)]);
//   //   //     } catch (error) {
//   //   //       console.error('Error fetching IP:', error);
//   //   //     }
//   //   //   };
    
//   //   //   fetchIpAndSetMap();
//   //   // }, []);
    
    
//   //   // useEffect(() => {
//   //   //       if (mapRef.current) {
//   //   //           mapRef.current.flyTo(center, 3, { duration: 1.5 });
//   //   //       }
//   //   //   }, [center])
    
  
//   //   // const handleScrollToTop = () => {
//   //   //   if (typeof window === 'undefined') return;
    
//   //   //   setIsScrolling(true);
  
//   //   //   window.scrollTo({
//   //   //     top: 0,
//   //   //     behavior: 'smooth',
//   //   //   });
  
//   //   //   const scrollCheck = setInterval(() => {
//   //   //     if (window.scrollY === 0) {
//   //   //       clearInterval(scrollCheck);
//   //   //       setIsScrolling(false);
//   //   //     }
//   //   //   }, 100);
//   //   // };
  
//   //   // if (!icons) {
//   //   //   return null;
//   //   // }

//   // const regions = [
//   //   { name: "Asia", distributors: asianDistributors },
//   //   { name: "The Americas", distributors: americaDistributors },
//   //   { name: "Europe", distributors: europeDistributors },
//   //   { name: "Oceania", distributors: oceaniaDistributors },
//   //   { name: "Africa", distributors: africaDistributors },
//   //   { name: "Antarctica", distributors: antarticaDistributors },
//   // ]

//   // return (
//   //   <div style={styles.page}>
//   //     <h1 style={styles.hiddenTitle}>Distributors | SB Acoustics</h1>
        
//   //       {/* <div 
//   //         style={{ 
//   //           position: "relative", 
//   //           display: "flex",
//   //           alignItems: "center",
//   //           justifyContent: "center",
//   //           zIndex: 0,
//   //           width: "100%", 
//   //           height: "100%" 
//   //         }}
//   //       >
//   //       <MapContainer
//   //         center={center}
//   //         zoom={3}
//   //         attributionControl={false}
//   //         className='z-10 mt-12 md:h-[500px] h-[400px] w-full'
//   //         ref={(mapInstance) => {
//   //           if (mapInstance && !mapRef.current) {
//   //             mapRef.current = mapInstance;
//   //           }
//   //         }}
//   //       >
//   //         <TileLayer
//   //           url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
//   //         />
//   //         {allDistributors.map((loc) => (
//   //           <Marker 
//   //             key={loc.name} 
//   //             position={[Number(loc.lat), Number(loc.lng)]}
//   //             icon={activeMap?.name === loc.name ? icons.activeIcon : icons.defaultIcon}
//   //             eventHandlers={{
//   //               click: () => {
//   //                 setActiveMap(loc), 
//   //                 mapRef.current?.flyTo([Number(loc.lat), Number(loc.lng)], 3, { duration: 1.5 });
//   //               }
//   //             }}>
//   //             <Popup>{loc.name}</Popup>
//   //           </Marker>
//   //         ))}
//   //       </MapContainer>
//   //       </div> */}
//   //     <div style={styles.mapSection}>
//   //       {activeMap && (
//   //         <div style={styles.activePanelWrapper}>
//   //           <div style={styles.activePanel}>
//   //             <div style={styles.activeTitle}>{activeMap.name}</div>

//   //             <div style={styles.detailsGrid}>
//   //               {activeMap.country && (
//   //                 <div style={styles.detail}>
//   //                   {/* <MapPin size={16} /> */}
//   //                   <span style={styles.detailText}>{activeMap.country}</span>
//   //                 </div>
//   //               )}

//   //               {activeMap.phone && (
//   //                 <div style={styles.detail}>
//   //                   {/* <Phone size={16} /> */}
//   //                   <span style={styles.detailText}>{activeMap.phone}</span>
//   //                 </div>
//   //               )}

//   //               {activeMap.email && (
//   //                 <div style={styles.detail}>
//   //                   {/* <Mail size={16} /> */}
//   //                   <Link
//   //                     href={`mailto:${activeMap.email}`}
//   //                     style={{ ...styles.link, ...styles.detailText }}
//   //                   >
//   //                     {activeMap.email}
//   //                   </Link>
//   //                 </div>
//   //               )}

//   //               {activeMap.website && (
//   //                 <div style={styles.detail}>
//   //                   {/* <Globe size={16} /> */}
//   //                   <Link
//   //                     href={activeMap.website}
//   //                     target="_blank"
//   //                     rel="noopener noreferrer"
//   //                     style={{ ...styles.link, ...styles.detailText }}
//   //                   >
//   //                     {activeMap.website}
//   //                   </Link>
//   //                 </div>
//   //               )}

//   //               {activeMap.facebook && (
//   //                 <div style={styles.detail}>
//   //                   {/* <Facebook size={16} /> */}
//   //                   <Link
//   //                     href={activeMap.facebook}
//   //                     target="_blank"
//   //                     rel="noopener noreferrer"
//   //                     style={styles.link}
//   //                   >
//   //                     Visit Facebook
//   //                   </Link>
//   //                 </div>
//   //               )}

//   //               {activeMap.instagram && (
//   //                 <div style={styles.detail}>
//   //                   {/* <Instagram size={16} /> */}
//   //                   <Link
//   //                     href={activeMap.instagram}
//   //                     target="_blank"
//   //                     rel="noopener noreferrer"
//   //                     style={styles.link}
//   //                   >
//   //                     Visit Instagram
//   //                   </Link>
//   //                 </div>
//   //               )}

//   //               {activeMap.address && (
//   //                 <div style={styles.detail}>
//   //                   {/* <MapPin size={16} /> */}
//   //                   <Link
//   //                     href={activeMap.address}
//   //                     target="_blank"
//   //                     rel="noopener noreferrer"
//   //                     style={styles.link}
//   //                   >
//   //                     Location
//   //                   </Link>
//   //                 </div>
//   //               )}
//   //             </div>
//   //           </div>
//   //         </div>
//   //       )}
//   //     </div>

//   //     <div style={styles.distributorsSection}>
//   //       <h2 style={styles.heading}>Our Distributors</h2>

//   //       <div style={styles.cardsGrid}>
//   //         {regions.map(
//   //           (region) =>
//   //             region.distributors?.length > 0 && (
//   //               <div key={region.name} style={styles.card}>
//   //                 <div style={styles.cardHeader}>{region.name}</div>

//   //                 <div style={styles.cardContent}>
//   //                   {region.distributors.map((distributor) => (
//   //                     <button
//   //                       key={distributor.id}
//   //                       type="button"
//   //                       style={styles.distributorButton}
//   //                       onClick={() => setActiveMap(distributor)}
//   //                       onMouseEnter={(event) => {
//   //                         event.currentTarget.style.backgroundColor = "#f4f4f5"
//   //                       }}
//   //                       onMouseLeave={(event) => {
//   //                         event.currentTarget.style.backgroundColor =
//   //                           "transparent"
//   //                       }}
//   //                     >
//   //                       <p style={styles.country}>{distributor.country}</p>
//   //                       <p style={styles.name}>{distributor.name}</p>
//   //                     </button>
//   //                   ))}
//   //                 </div>
//   //               </div>
//   //             )
//   //         )}
//   //       </div>
//   //     </div>
//   //   </div>
//   // )



//   const allDistributors = useMemo(
//     () => [
//       ...asianDistributors,
//       ...europeDistributors,
//       ...americaDistributors,
//       ...oceaniaDistributors,
//       ...africaDistributors,
//       ...antarticaDistributors,
//     ],
//     [
//       asianDistributors,
//       europeDistributors,
//       americaDistributors,
//       oceaniaDistributors,
//       africaDistributors,
//       antarticaDistributors,
//     ]
//   )

//   const [activeDistributor, setActiveDistributor] = useState<
//     distributors | undefined
//   >(allDistributors[0])

//   const regions = [
//     { name: "Asia", distributors: asianDistributors },
//     { name: "The Americas", distributors: americaDistributors },
//     { name: "Europe", distributors: europeDistributors },
//     { name: "Oceania", distributors: oceaniaDistributors },
//     { name: "Africa", distributors: africaDistributors },
//     { name: "Antarctica", distributors: antarticaDistributors },
//   ]

//   const initialCenter: [number, number] = [
//     Number(activeDistributor?.lat ?? 20),
//     Number(activeDistributor?.lng ?? 0),
//   ]

//   return (
//     <div
//       style={{
//         width: "100%",
//         color: "#18181b",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           height: "500px",
//           marginTop: "48px",
//         }}
//       >


        
//         <MapContainer
//           center={initialCenter}
//           zoom={2}
//           style={{ width: "100%", height: "100%" }}
//           attributionControl={false}
//           scrollWheelZoom={false}
//         >
//           <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

//           <FocusMap distributor={activeDistributor} />

//           {allDistributors.map((distributor) => {
//             const position: [number, number] = [
//               Number(distributor.lat),
//               Number(distributor.lng),
//             ]

//             return (
//               <Marker
//                 key={distributor.id}
//                 position={position}
//                 icon={createPinIcon(
//                   activeDistributor?.id === distributor.id
//                 )}
//                 eventHandlers={{
//                   click: () => setActiveDistributor(distributor),
//                 }}
//               >
//                 <Popup>{distributor.name}</Popup>
//               </Marker>
//             )
//           })}
//         </MapContainer>



//       </div>

//       {activeDistributor && (
//         <div
//           style={{
//             padding: "20px",
//             border: "1px solid #e4e4e7",
//             backgroundColor: "#ffffff",
//           }}
//         >
//           <h2 style={{ margin: "0 0 16px", fontSize: "20px" }}>
//             {activeDistributor.name}
//           </h2>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "10px 20px",
//             }}
//           >
//             <span>{activeDistributor.country}</span>
//             {activeDistributor.phone && <span>{activeDistributor.phone}</span>}

//             {activeDistributor.email && (
//               <Link href={`mailto:${activeDistributor.email}`}>
//                 {activeDistributor.email}
//               </Link>
//             )}

//             {activeDistributor.website && (
//               <Link
//                 href={activeDistributor.website}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {activeDistributor.website}
//               </Link>
//             )}
//           </div>
//         </div>
//       )}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//           gap: "16px",
//           padding: "48px 0",
//         }}
//       >
//         {regions.map(
//           (region) =>
//             region.distributors.length > 0 && (
//               <div
//                 key={region.name}
//                 style={{
//                   border: "1px solid #e4e4e7",
//                   backgroundColor: "#ffffff",
//                 }}
//               >
//                 <h3
//                   style={{
//                     margin: 0,
//                     padding: "16px",
//                     backgroundColor: "#3f3f46",
//                     color: "#ffffff",
//                   }}
//                 >
//                   {region.name}
//                 </h3>

//                 <div style={{ padding: "12px" }}>
//                   {region.distributors.map((distributor) => {
//                     const active =
//                       distributor.id === activeDistributor?.id

//                     return (
//                       <button
//                         key={distributor.id}
//                         type="button"
//                         onClick={() => setActiveDistributor(distributor)}
//                         style={{
//                           display: "block",
//                           width: "100%",
//                           padding: "12px",
//                           border: 0,
//                           borderBottom: "1px solid #e4e4e7",
//                           backgroundColor: active ? "#fee2e2" : "#ffffff",
//                           color: "#18181b",
//                           textAlign: "left",
//                           cursor: "pointer",
//                         }}
//                       >
//                         <strong>{distributor.country}</strong>
//                         <br />
//                         <span>{distributor.name}</span>
//                       </button>
//                     )
//                   })}
//                 </div>
//               </div>
//             )
//         )}
//       </div>
//     </div>
//   )
// }










"use client"

import React, { useEffect, useRef, useState } from 'react'
//@ts-ignore
import 'mapbox-gl/dist/mapbox-gl.css'
import Link from 'next/link'

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
//@ts-ignore
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { distributors } from '@prisma/client'
import { usePathname } from 'next/navigation'
//@ts-ignore
import '@/app/css/styles.scss'
//@ts-ignore
import '@/app/globals.css'
import '@/app/legacy/(sbacoustics)/distributors/distributor-map.css'

interface DistributorProps {
  asianDistributors: distributors[]
  europeDistributors: distributors[]
  americaDistributors: distributors[]
  oceaniaDistributors: distributors[]
  africaDistributors: distributors[]
  antarticaDistributors: distributors[]
}

// Function to create icons lazily (only on client)
const getIcons = () => {
  const defaultIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [30, 30],
  });

  const activeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  return { defaultIcon, activeIcon };
};

export const DistributorMap: React.FC<DistributorProps> = ({
  asianDistributors, europeDistributors, americaDistributors, oceaniaDistributors, africaDistributors, antarticaDistributors
}) => {
  const [activeMap, setActiveMap] = useState<distributors | undefined>(asianDistributors[0])
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoadingLoader, setIsLoadingLoader] = useState(true);
  const [center, setCenter]= useState<LatLngExpression>([Number(asianDistributors[1]?.lat ?? 0), Number(asianDistributors[1]?.lng ?? 0)]);
  const [icons, setIcons] = useState<{ defaultIcon: L.Icon; activeIcon: L.Icon } | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pathname = usePathname();
  const allDistributors = [
    ...americaDistributors,
    ...oceaniaDistributors,
    ...europeDistributors,
    ...asianDistributors,
    ...africaDistributors,
    ...antarticaDistributors
  ]

  const allD = [
    americaDistributors,
    oceaniaDistributors,
    europeDistributors,
    asianDistributors,
    africaDistributors,
    antarticaDistributors
  ]

  const titleDistributors = ['The Americas', 'Oceania', 'Europe', 'Asia', 'Africa', 'Antartica']

  // Initialize icons on client only
  useEffect(() => {
    setIcons(getIcons());
  }, []);

  useEffect(() => {
    const fetchIpAndSetMap = async () => {
      try {
        const res = await fetch('/api/ip');
        const data = await res.json();
        const res_2 = await fetch(`https://ipapi.co/${data.ip}/json/`);
        const data_2 = await res_2.json();

  
        
        const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const toRad = (value: number) => (value * Math.PI) / 180;
          const R = 6371; // Earth radius in km
        
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
          return R * c;
        };
        
        const closestDistributor = allDistributors.reduce((closest, distributor) => {
          const distributorDistance = getDistance(data_2.latitude, data_2.longitude, Number(distributor.lat), Number(distributor.lng));
          const closestDistance = getDistance(data_2.latitude, data_2.longitude, Number(closest?.lat ?? 0), Number(closest?.lng ?? 0));
        
          return distributorDistance < closestDistance ? distributor : closest;
        }, asianDistributors[0]);
        
        setActiveMap(closestDistributor);
        setCenter([Number(closestDistributor?.lat ?? 0), Number(closestDistributor?.lng ?? 0)]);
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };
  
    fetchIpAndSetMap();
  }, []);
  
  
  useEffect(() => {
        if (mapRef.current) {
            mapRef.current.flyTo(center, 3, { duration: 1.5 });
        }
    }, [center])
  

  const handleScrollToTop = () => {
    if (typeof window === 'undefined') return;
  
    setIsScrolling(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    const scrollCheck = setInterval(() => {
      if (window.scrollY === 0) {
        clearInterval(scrollCheck);
        setIsScrolling(false);
      }
    }, 100);
  };

  if (!icons) {
    return null;
  }


  return (
      <>
      <div style={{ width: '100%', height: 300, position: 'relative' }}>
        {/* <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
          {isLoadingLoader && (
            <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0, width: 40, height: 40 }}>
              ...
            </div>
          )}

          <MapContainer
            center={center}
            zoom={3}
            attributionControl={false}
            style={{ zIndex: 10, marginTop: 48, height: 500, width: '100%' }}
            ref={(mapInstance) => {
              if (mapInstance && !mapRef.current) mapRef.current = mapInstance
            }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            {allDistributors.map((loc) => (
              <Marker
                key={loc.name}
                position={[Number(loc.lat), Number(loc.lng)]}
                icon={activeMap?.name === loc.name ? icons.activeIcon : icons.defaultIcon}
                eventHandlers={{
                  click: () => {
                    setActiveMap(loc)
                    mapRef.current?.flyTo([Number(loc.lat), Number(loc.lng)], 3, { duration: 1.5 })
                  },
                }}
              >
                <Popup>{loc.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div> */}

        <div className="distributor-overlay">
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="distributor-card">
              {activeMap && (
                <div style={{ padding: 0, color: 'black' }}>
                  <div className="distributor-name">{activeMap.name}</div>
                  <div className="distributor-details">
                    {activeMap.country && <ContactRow icon={<ContactIcon type="location" />} value={activeMap.country} />}
                    {activeMap.phone && <ContactRow icon={<ContactIcon type="phone" />} value={activeMap.phone} />}
                    {activeMap.email && <ContactRow icon={<ContactIcon type="email" />} link={`mailto:${activeMap.email}`} value={activeMap.email} />}
                    {activeMap.website && <ContactRow icon={<ContactIcon type="website" />} link={activeMap.website} value={activeMap.website} external />}
                    {activeMap.facebook && <ContactRow icon={<ContactIcon type="facebook" />} link={activeMap.facebook} value="Visit Facebook" external />}
                    {activeMap.instagram && <ContactRow icon={<ContactIcon type="instagram" />} link={activeMap.instagram} value="Visit Instagram" external />}
                    {activeMap.address && <ContactRow icon={<ContactIcon type="location" />} link={activeMap.address} value="Location" external alignStart />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="distributors-section">
        <h1 className="distributors-heading">Our Distributors</h1>
        <div className="regions-grid">
          {allD.map((region, index) => {
            if (region.length === 0) return null
            return (
              <section className="region-column" key={index}>
                <h2 className={`region-heading ${index === 0 ? 'first-region' : ''}`}>{titleDistributors[index]}</h2>
                {region.map((distributor, idx) => (
                  <React.Fragment key={idx}>
                    <h3 className="country-heading">{distributor.country}</h3>
                    <div
                      className="country-block"
                      onClick={() => {
                        setActiveMap(distributor)
                        setIsLoadingLoader(true)
                        handleScrollToTop()
                        mapRef.current?.flyTo([Number(distributor.lat), Number(distributor.lng)], 3, { duration: 1.5 })
                      }}
                    >
                      <h4 className={`distributor-link ${activeMap === distributor ? 'active-distributor' : ''}`}>{distributor.name}</h4>
                    </div>
                  </React.Fragment>
                ))}
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}

type ContactIconType = 'location' | 'phone' | 'email' | 'website' | 'facebook' | 'instagram'

function ContactIcon({ type }: { type: ContactIconType }) {
  const commonProps = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (type === 'location') {
    return <svg {...commonProps}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
  }

  if (type === 'phone') {
    return <svg {...commonProps}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" /></svg>
  }

  if (type === 'email') {
    return <svg {...commonProps}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  }

  if (type === 'website') {
    return <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
  }

  if (type === 'facebook') {
    return <svg {...commonProps}><path d="M15 3h3V0h-3a6 6 0 0 0-6 6v3H6v3h3v9h3v-9h3l1-3h-4V6a3 3 0 0 1 3-3Z" /></svg>
  }

  return <svg {...commonProps}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
}


function ContactRow({ icon, value, link, external, alignStart }: { icon: React.ReactNode; value: string; link?: string; external?: boolean; alignStart?: boolean }) {
  const content = link ? <Link href={link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{value}</Link> : <span>{value}</span>
  return <p className={`contact-row ${alignStart ? 'align-start' : ''}`}><span className="contact-icon">{icon}</span><span className="truncate-text">{content}</span></p>
}