"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { LazyImageClickable } from '@/components/lazyImageclickable'
import { getHref } from '@/app/(frontend)/utils/getHref';
import { brand, socialmedia } from '@prisma/client';
import getOneBrand from '@/app/(frontend)/actions/get-one-brand';
import { useEffect, useState } from 'react';
import getAllSocialMedia from '@/app/(frontend)/actions/get-all-social-media';
import { SocialIcon } from 'react-social-icons';
import { Skeleton } from './ui/skeleton';
import CookieSettings from './cookie-settings';

export default function Footer() {
  const pathname = usePathname()
  const [allSocialMedia, setAllSocialMedia] = useState<socialmedia[]>([])
  const [finalData, setFinalData] = useState<brand>()
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchData = async () => {
      const brand: brand = await getOneBrand(pathname);
      setFinalData(brand)
      const allSM: socialmedia[] = await getAllSocialMedia(pathname);
      setAllSocialMedia(allSM)
      setLoading(false) 
    };
  
    fetchData().catch((error) => {
      console.error("Error fetching data: ", error);
    });
    
  }, [pathname]); 
  
  if (showSettings) {
    return <CookieSettings onClose={() => setShowSettings(false)} />
  }
  return (
    <footer className="bg-black text-white">
      <h2 className='sr-only'>{!loading && finalData && `${finalData.name} Footer Navigation`}</h2>
      <div className="w-dvw xl:px-16 lg:px-12 px-8 py-12">
      <div className="md:grid-cols-2 grid pb-6 items-center justify-center">
            <div className="md:order-2 order-1 flex flex-col items-center md:items-end">
                <div className="w-full max-w-[200px] h-auto rounded-lg shadow-lg transition-transform hover:scale-105">
                  <Link href={pathname.includes('sbaudience') ? '/sbaudience' : pathname.includes('sbautomotive') ? '/sbautomotive' : '/'}>
                    <LazyImageClickable
                      src={pathname.includes('sbaudience') ? '/images/sbaudience/logo_sbaudience.webp' : pathname.includes('sbautomotive') ? '/images/sbautomotive/logo_sbautomotive_white.webp' : '/images/sbacoustics/logo_sbacoustics_white_clean.webp'}
                      alt={pathname.includes('sbaudience') ? "Logo of SB Audience" : pathname.includes('sbautomotive') ? "Logo of SB Automotive" : "Logo of SB Acoustics"}
                      width={500}
                      height={500}
                    />
                  </Link>
                </div>
                

              {pathname.includes('sbaudience') ?
                <>
                  <div className="w-full pt-2 max-w-[100px] h-auto rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Link href={'/'}>
                      <LazyImageClickable
                        src={'/images/sbacoustics/logo_sbacoustics_white_clean.webp'}
                        alt={"Logo of SB Acoustics"}
                        width={500}
                        height={500}
                      />
                    </Link>
                  </div>
                  {/* <div className="w-full pt-2 max-w-[100px] h-auto rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Link href={'/sbautomotive'}>
                      <LazyImageClickable
                        src={'/images/sbautomotive/logo_sbautomotive_white.webp'}
                        alt={"Logo of SB Automotive"}
                        width={500}
                        height={500}
                      />
                    </Link>
                  </div> */}
                </>
                :
                
                <>
                  <div className="w-full pt-2 max-w-[100px] h-auto rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Link href={'/sbaudience'}>
                      <LazyImageClickable
                        src={'/images/sbaudience/logo_sbaudience.webp'}
                        alt={"Logo of SB Audience"}
                        width={500}
                        height={500}
                      />
                    </Link>
                  </div>
                  {/* <div className="w-full pt-2 max-w-[100px] h-auto rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Link href={'/sbautomotive'}>
                      <LazyImageClickable
                        src={'/images/sbautomotive/logo_sbautomotive_white.webp'}
                        alt={"Logo of SB Automotive"}
                        width={500}
                        height={500}
                      />
                    </Link>
                  </div> */}
                </>
              }



            </div>
            <div className='flex flex-col md:order-1 order-2 items-center md:items-start md:pt-0 pt-12'>
              <div className="w-full max-w-[100px] h-auto rounded-lg shadow-lg transition-transform hover:scale-105 md:block flex items-center justify-center">
                <Link href={'https://sinarbajaelectric.com/'} target='_blank'>
                  <LazyImageClickable
                    src={'/images/sbacoustics/logo SBE-white.webp'}
                    alt={"Sinar Baja Electric"}
                    width={500}
                    height={500}
                  />
                </Link>
              </div>
            </div>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">


        <div className="flex flex-col space-y-6 items-center md:items-start">
          <ul className="space-y-4 text-center md:text-left">
            <li className="group">
              <h3 className="text-2xl font-bold bg-clip-text text-white">
                Sinar Baja Electric
              </h3>  
            </li>
            <li className="flex items-start justify-center md:justify-start group">
                {loading ?
                  <Skeleton className="h-5 w-[250px] bg-background/20" />
                :
                <>
                  <MapPin className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm">
                    {finalData && finalData.address}
                  </span>
                </>
                }
            </li>
            <li className="flex items-center justify-center md:justify-start group">
                {loading ?
                  <Skeleton className="h-5 w-[250px] bg-background/20" />
                :
                  <>  
                    <Phone className="mr-2 h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">
                      {finalData && finalData.telephone}
                    </span>
                  </>
                }
            </li>
            <li className="flex items-center justify-center md:justify-start group">
                {loading ?
                  <Skeleton className="h-5 w-[250px] bg-background/20" />
                :
                  <>
                    <Mail className="mr-2 h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">
                      {finalData && finalData.email}
                    </span>
                  </>
                }
            </li>
          </ul>
        </div>


          <div className="flex flex-col md:items-end items-center md:pt-0 pt-6">
            <h3 className="text-lg font-semibold text-primary">Newsletter</h3>
            <p className="text-sm py-4 text-white md:text-right text-center">
              Subscribe to the newsletter for the latest updates
            </p>
              <Button type="submit" className="bg-primary text-white transition-colors flex items-center" asChild>
                <Link href={'/newsletter'} className="bg-primary rounded-lg text-sm font-semibold w-fit">
                  Subscribe
                  <Mail className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div
          className="flex col-span-3 flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className='w-1/3 md:block hidden items-center'>
            <div className="text-sm text-white text-center md:text-left flex">
              © {new Date().getFullYear()}{' '}
              {loading ?
                <div className='px-2'>
                  <Skeleton className="h-4 w-18 bg-background/20"/>
                </div>
              :
                finalData && finalData.name
              }
              . All rights reserved.
            </div>
            <div className='lg:space-x-4 space-x-2 text-xs text-gray-400 pt-1'>
              <Link href={'/privacy'} className="hover:text-white transition-colors">Privacy policy</Link>
              <Button
                variant="ghost"
                onClick={() => setShowSettings(true)}
                className="hover:text-white transition-colors hover:bg-transparent p-0 h-fit hover:cursor-pointer text-xs"
              >
                Cookie settings
              </Button>
              <Link href={'/legal'} className="hover:text-white transition-colors">Terms of use</Link>
            </div>
          </div>
          <div className="flex space-x-4 md:w-1/3 w-full justify-center">
            {loading ? 
              <>
                <Skeleton className="h-[35px] w-[35px] rounded-full bg-background/20" />
                <Skeleton className="h-[35px] w-[35px] rounded-full bg-background/20" />
                <Skeleton className="h-[35px] w-[35px] rounded-full bg-background/20" />
                <Skeleton className="h-[35px] w-[35px] rounded-full bg-background/20" />
              </>
            :
              allSocialMedia && allSocialMedia.length > 0 &&
                allSocialMedia.map((logo, index) => (
                  <SocialIcon network={logo.type} style={{ width: 35, height: 35 }} url={logo.value} key={index} fgColor='#c4c4c4' bgColor='#2e2e2e'/>
                ))
            }
          </div>
          <div className="flex space-x-4 text-xs text-gray-400 w-1/3 md:justify-end justify-center  ">
            <Link href={getHref(pathname, 'aboutus')} className="hover:text-white transition-colors">
              About Us
            </Link>
          </div>
          
          <div className="text-xs text-white text-center w-full md:hidden block">
            © {new Date().getFullYear()} {!loading && finalData && finalData.name}. All rights reserved.
          </div>
          
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-gray-400 md:hidden">
              <Link
                href="/privacy"
                className="whitespace-nowrap hover:text-white transition-colors"
              >
                Privacy policy
              </Link>

              <Button
                variant="ghost"
                onClick={() => setShowSettings(true)}
                className="whitespace-nowrap hover:text-white transition-colors hover:bg-transparent p-0 h-fit hover:cursor-pointer text-xs"
              >
                Cookie settings
              </Button>

              <Link
                href="/legal"
                className="whitespace-nowrap hover:text-white transition-colors"
              >
                Terms of use
              </Link>
            </div>
          </div>
      </div>
    </footer>
  )
}