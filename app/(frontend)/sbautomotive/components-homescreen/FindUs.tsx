"use client"

import { socialmedia } from '@prisma/client';
import { usePathname } from 'next/navigation';
import getAllSocialMedia from '../../actions/get-all-social-media';
import { Skeleton } from '@/components/ui/skeleton';
import { SocialIcon } from 'react-social-icons';
import { useEffect, useState } from 'react';

export default function FindUs() {
  const [allSocialMedia, setAllSocialMedia] = useState<socialmedia[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const pathname = usePathname()
  useEffect(() => {
    const fetchData = async () => {
      const allSM: socialmedia[] = await getAllSocialMedia(pathname);
      setAllSocialMedia(allSM)
      setLoading(false)
    };
    
    fetchData().catch((error) => {
      console.error("Error fetching social media: ", error);
    });
  }, [pathname]);
  return (
    <>
      <div className='xl:h-96 lg:h-80 md:h-72 sm:h-72 h-60 w-full flex flex-col justify-center items-start xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 bg-white'>
        <h2 className='sr-only'>Where to Find SB Automotive</h2>
        <div className="text-left font-bold xl:text-5xl text-3xl text-black py-4">
          Social:
        </div>
        <div className='md:flex hidden md:justify-start pb-4 gap-2 w-full'>
        {loading ? 
          <>
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
          </>
          :
          allSocialMedia && allSocialMedia.length > 0 &&
            allSocialMedia.map((logo, index) => (
              <SocialIcon network={logo.type} style={{ width: 80, height: 80 }} url={logo.value} key={index}/>
            ))
          }
        </div>
        <div className='md:hidden flex justify-start pb-4 gap-2 w-full'>
          {loading ? 
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </>
          :
          allSocialMedia && allSocialMedia.length > 0 &&
            allSocialMedia.map((logo, index) => (
              <SocialIcon network={logo.type} style={{ width: 48, height: 48 }} url={logo.value} key={index}/>
            ))
          }
        </div>
      </div>
    </>
  );
}
