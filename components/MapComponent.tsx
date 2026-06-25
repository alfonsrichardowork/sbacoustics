"use client"

import React, { useEffect, useRef, useState } from 'react'
//@ts-ignore
import 'mapbox-gl/dist/mapbox-gl.css'
import { Facebook, Globe, Instagram, Loader2, Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
import { CustomScrollbar } from './always-visible-scrollbar-distributor'

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
    ...asianDistributors,
    ...europeDistributors,
    ...americaDistributors,
    ...oceaniaDistributors,
    ...africaDistributors,
    ...antarticaDistributors
  ]

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
      <h1 className='sr-only'>Distributors | SB Acoustics</h1>
      {/* <ScrollableData /> */}
      <div className="w-screen h-[400px] md:h-[500px] relative">
      <div className="relative flex items-center justify-center h-full w-full">
        {/* Loader */}
        {isLoadingLoader && (
          <div className="absolute flex items-center justify-center z-0 w-10 h-10">
            <Loader2 className="animate-spin text-gray-500" size={20} />
          </div>
        )}
        <MapContainer
          center={center}
          zoom={3}
          attributionControl={false}
          className='z-10 mt-12 md:h-[500px] h-[400px] w-full'
          ref={(mapInstance) => {
            if (mapInstance && !mapRef.current) {
              mapRef.current = mapInstance;
            }
          }}
        >
          {/* <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {allDistributors.map((loc) => (
            <Marker 
              key={loc.name} 
              position={[Number(loc.lat), Number(loc.lng)]}
              icon={activeMap?.name === loc.name ? icons.activeIcon : icons.defaultIcon}
              eventHandlers={{
                click: () => {
                  setActiveMap(loc), 
                  mapRef.current?.flyTo([Number(loc.lat), Number(loc.lng)], 3, { duration: 1.5 });
                }
              }}>
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
        </div>
        <div className='absolute w-screen 2xl:px-96 xl:px-72 lg:px-12 px-8 bottom-0'>
          <div className="grid md:grid-cols-1 gap-4">
            <Card className="w-full justify-self-start md:p-4 p-2 md:max-h-full h-full bg-background/70 backdrop-blur-xs z-30 rounded-none border-none">
              {activeMap &&
                <CardContent className="p-0 text-black">
                  <div className="md:text-xl text-base font-bold md:mb-4 mb-2 w-full text-center">{activeMap.name}</div>
                  <div className="grid md:grid-cols-2 grid-cols-1 md:space-y-2 space-y-1 text-sm">
                    {activeMap.country && (
                      <p className="flex items-center md:text-base text-xs gap-2">
                        <MapPin size={14} className='min-w-4' />
                          <p className='line-clamp-1'>{activeMap.country}</p>
                      </p>
                    )}
                    {activeMap.phone && (
                      <p className="flex items-center md:text-base text-xs gap-2">
                        <Phone size={14} className='min-w-4' />
                          <p className='line-clamp-1'>{activeMap.phone}</p>
                      </p>
                    )}
                    {activeMap.email && (
                      <p className="flex items-center md:text-base text-xs gap-2">
                        <Mail size={14} className='min-w-4' />
                        <Link href={`mailto:${activeMap.email}`} className="underline line-clamp-1">
                          {activeMap.email}
                        </Link>
                      </p>
                    )}
                    {activeMap.website && (
                      <p className="flex items-center md:text-base text-xs gap-2">
                        <Globe size={14} className='min-w-4' />
                        <Link
                          href={activeMap.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline line-clamp-1"
                        >
                          {activeMap.website}
                        </Link>
                      </p>
                    )}
                    {activeMap.facebook && (
                      <p className="flex items-center md:text-base text-xs gap-2">
                        <Facebook size={14} className='min-w-4'/>
                        <Link href={`${activeMap.facebook}`} target="_blank" rel="noopener noreferrer" className="underline">Visit Facebook</Link>
                      </p>
                    )}
                    {activeMap.instagram && (
                      <p className="flex items-center md:text-base text-xs gap-2">
                        <Instagram size={14} className='min-w-4' />
                        <Link href={`${activeMap.instagram}`} target="_blank" rel="noopener noreferrer" className="underline">Visit Instagram</Link>
                      </p>
                    )}
                    {activeMap.address && (
                      <p className="flex items-start md:text-base text-xs gap-2">
                        <MapPin size={14} className="min-w-4 mt-1" />
                        <Link href={activeMap.address} target='blank' className="block underline">
                          Location
                        </Link>
                      </p>
                    )}
                  </div>
                </CardContent>
              }
            </Card>
          </div>
        </div>
      </div>
      
    <div className="py-16 2xl:px-96 xl:px-72 lg:px-12 px-8">
      <div className='text-3xl font-bold mb-6 text-center'>
        Our Distributors
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {asianDistributors && asianDistributors.length > 0 &&
          <Card className="w-full max-h-[500px] shadow-lg justify-self-end rounded-none">
            <CardHeader className='bg-zinc-700 text-white md:py-4 md:px-4 py-2 px-3'>
              <CardTitle>
                Asia
              </CardTitle>
            </CardHeader>
            <CardContent className='md:p-4 p-2'>
              {/* <ScrollArea className="max-h-[400px] overflow-y-auto w-full"> */}
              <CustomScrollbar containerHeight="400px">
                {asianDistributors.map((distributor, index) => (
                  <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger className='w-full text-left'>
                      <div
                        className={`md:mb-4 mb-2 md:p-4 p-2 ${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-100'} hover:text-primary hover:cursor-pointer ${activeMap === distributor? 'border-primary border-2' : ''} ${isScrolling ? ' pointer-events-none' : ''}`}
                        onClick={() => {setActiveMap(distributor); setIsLoadingLoader(true); handleScrollToTop(); 
                          mapRef.current?.flyTo([Number(distributor.lat), Number(distributor.lng)], 3, { duration: 1.5 }); }}
                      >
                        <h4 className={`${pathname.includes('sbaudience') ? 'text-gray-400' : 'text-gray-600'} flex items-center md:text-xl text-base`}>
                        {distributor.country}
                        </h4>
                        <h5 className="md:text-lg text-sm font-semibold md:mb-2 mb-0">{distributor.name}</h5>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                ))}
              </CustomScrollbar>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        }
        {americaDistributors && americaDistributors.length > 0 &&
          <Card className="w-full max-h-[500px] shadow-lg justify-self-start rounded-none">
            <CardHeader className='bg-zinc-700 text-white md:py-4 md:px-4 py-2 px-3'>
              <CardTitle>
                The Americas
              </CardTitle>
            </CardHeader>
            <CardContent className='md:p-4 p-2'>
              {/* <ScrollArea className="max-h-[400px] overflow-y-auto w-full"> */}
              <CustomScrollbar containerHeight="400px">
                {americaDistributors.map((distributor, index) => (
                  <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger className='w-full text-left'>
                      <div
                        className={`md:mb-4 mb-2 md:p-4 p-2 ${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-100'} hover:text-primary hover:cursor-pointer ${activeMap === distributor? 'border-primary border-2' : ''} ${isScrolling ? ' pointer-events-none' : ''}`}
                        onClick={() => {setActiveMap(distributor); setIsLoadingLoader(true); handleScrollToTop(); 
                          mapRef.current?.flyTo([Number(distributor.lat), Number(distributor.lng)], 3, { duration: 1.5 });}}
                      >
                        <h4 className={`${pathname.includes('sbaudience') ? 'text-gray-400' : 'text-gray-600'} flex items-center md:text-xl text-base`}>
                        {distributor.country}
                        </h4>
                        <h5 className="md:text-lg text-sm font-semibold md:mb-2 mb-0">{distributor.name}</h5>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                ))}
                </CustomScrollbar>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        }
        {europeDistributors && europeDistributors.length > 0 &&
          <Card className="w-full max-h-[500px] shadow-lg justify-self-end rounded-none">
            <CardHeader className='bg-zinc-700 text-white md:py-4 md:px-4 py-2 px-3'>
              <CardTitle>
                Europe
              </CardTitle>
            </CardHeader>
            <CardContent className='md:p-4 p-2'>
              {/* <ScrollArea className="max-h-[400px] overflow-y-auto w-full"> */}
              <CustomScrollbar containerHeight="400px">
                {europeDistributors.map((distributor, index) => (
                  <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger className='w-full text-left'>
                      <div
                        className={`md:mb-4 mb-2 md:p-4 p-2 ${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-100'} hover:text-primary hover:cursor-pointer ${activeMap === distributor? 'border-primary border-2' : ''} ${isScrolling ? ' pointer-events-none' : ''}`}
                        onClick={() => {setActiveMap(distributor); setIsLoadingLoader(true); handleScrollToTop(); 
                          mapRef.current?.flyTo([Number(distributor.lat), Number(distributor.lng)], 3, { duration: 1.5 });}}
                      >
                        <h4 className={`${pathname.includes('sbaudience') ? 'text-gray-400' : 'text-gray-600'} flex items-center md:text-xl text-base`}>
                        {distributor.country}
                        </h4>
                        <h5 className="md:text-lg text-sm font-semibold md:mb-2 mb-0">{distributor.name}</h5>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                ))}
                </CustomScrollbar>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        }
        {oceaniaDistributors && oceaniaDistributors.length > 0 &&
          <Card className="w-full max-h-[500px] shadow-lg justify-self-start rounded-none">
            <CardHeader className='bg-zinc-700 text-white md:py-4 md:px-4 py-2 px-3'>
              <CardTitle>
                Oceania
              </CardTitle>
            </CardHeader>
            <CardContent className='md:p-4 p-2'>
              {/* <ScrollArea className="max-h-[400px] overflow-y-auto w-full"> */}
              <CustomScrollbar containerHeight="400px">
                {oceaniaDistributors.map((distributor, index) => (
                  <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger className='w-full text-left'>
                      <div
                        className={`md:mb-4 mb-2 md:p-4 p-2 ${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-100'} hover:text-primary hover:cursor-pointer ${activeMap === distributor? 'border-primary border-2' : ''} ${isScrolling ? ' pointer-events-none' : ''}`}
                        onClick={() => { setActiveMap(distributor); setIsLoadingLoader(true); handleScrollToTop();
                          mapRef.current?.flyTo([Number(distributor.lat), Number(distributor.lng)], 3, { duration: 1.5 });}}
                      >
                        <h4 className={`${pathname.includes('sbaudience') ? 'text-gray-400' : 'text-gray-600'} flex items-center md:text-xl text-base`}>
                        {distributor.country}
                        </h4>
                        <h5 className="md:text-lg text-sm font-semibold md:mb-2 mb-0">{distributor.name}</h5>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                ))}
                </CustomScrollbar>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        }
        {africaDistributors && africaDistributors.length > 0 &&
          <Card className="w-full max-h-[500px] shadow-lg justify-self-end rounded-none">
            <CardHeader className='bg-zinc-700 text-white md:py-4 md:px-4 py-2 px-3'>
              <CardTitle>
                Africa
              </CardTitle>
            </CardHeader>
            <CardContent className='md:p-4 p-2'>
              {/* <ScrollArea className="max-h-[400px] overflow-y-auto w-full"> */}
              
              <CustomScrollbar containerHeight="400px">
                {africaDistributors.map((distributor, index) => (
                  <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger className='w-full text-left'>
                      <div
                        className={`md:mb-4 mb-2 md:p-4 p-2 ${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-100'} hover:text-primary hover:cursor-pointer ${activeMap === distributor? 'border-primary border-2' : ''} ${isScrolling ? ' pointer-events-none' : ''}`}
                        onClick={() => { setActiveMap(distributor); setIsLoadingLoader(true); handleScrollToTop();
                          mapRef.current?.flyTo([Number(distributor.lat), Number(distributor.lng)], 3, { duration: 1.5 });}}
                      >
                        <h4 className={`${pathname.includes('sbaudience') ? 'text-gray-400' : 'text-gray-600'} flex items-center md:text-xl text-base`}>
                        {distributor.country}
                        </h4>
                        <h5 className="md:text-lg text-sm font-semibold md:mb-2 mb-0">{distributor.name}</h5>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                ))}
                </CustomScrollbar>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        }
        {antarticaDistributors && antarticaDistributors.length > 0 &&
          <Card className="w-full max-h-[500px] shadow-lg justify-self-start rounded-none">
            <CardHeader className='bg-zinc-700 text-white md:py-4 md:px-4 py-2 px-3'>
              <CardTitle>
                Antartica
              </CardTitle>
            </CardHeader>
            <CardContent className='md:p-4 p-2'>
              {/* <ScrollArea className="max-h-[400px] overflow-y-auto w-full"> */}
              
              <CustomScrollbar containerHeight="400px">
                {antarticaDistributors.map((distributor, index) => (
                  <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger className='w-full text-left'>
                      <div
                        className={`md:mb-4 mb-2 md:p-4 p-2 ${pathname.includes('sbaudience') ? 'bg-zinc-800' : 'bg-zinc-100'} hover:text-primary hover:cursor-pointer ${activeMap === distributor? 'border-primary border-2' : ''} ${isScrolling ? ' pointer-events-none' : ''}`}
                        onClick={() => {setActiveMap(distributor); setIsLoadingLoader(true); handleScrollToTop();
                          mapRef.current?.flyTo([Number(distributor.lat), Number(distributor.lng)], 3, { duration: 1.5 });}}
                      >
                        <h4 className={`${pathname.includes('sbaudience') ? 'text-gray-400' : 'text-gray-600'} flex items-center md:text-xl text-base`}>
                        {distributor.country}
                        </h4>
                        <h5 className="md:text-lg text-sm font-semibold md:mb-2 mb-0">{distributor.name}</h5>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click for more info</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                ))}
                </CustomScrollbar>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        }
      </div>
    </div>
    </>
  )
}
