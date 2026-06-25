
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import prismadb from '@/lib/prismadb';

export default async function BrandChoice() {
  const brandImagesSBAcoustics = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
    },
    select: {
      homepage_brand_choice_url: true,
      homepage_brand_choice_text: true
    }
  })
  const brandImagesSBAutomotive = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID
    },
    select: {
      homepage_brand_choice_url: true,
      homepage_brand_choice_text: true
    }
  })
  if(!brandImagesSBAcoustics || brandImagesSBAcoustics.homepage_brand_choice_url === ''){
    return null
  }
  if(!brandImagesSBAutomotive || brandImagesSBAutomotive.homepage_brand_choice_url === ''){
    return null
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-5">
      <div className="relative overflow-hidden group rounded-none col-span-3">
        <h2 className='sr-only'>Explore Our Brands: SB Acoustics</h2>
        <div className="relative w-auto h-[50vh] bg-cover bg-no-repeat flex items-center">
          <img
            src={brandImagesSBAcoustics.homepage_brand_choice_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImagesSBAcoustics.homepage_brand_choice_url}` : brandImagesSBAcoustics.homepage_brand_choice_url}
            alt="SB Acoustics"
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            fetchPriority='high'
          />
          <div className="right-0 absolute bg-linear-to-l from-zinc-200 to-transparent w-1/3 h-full md:block hidden"/>
          <div className="bottom-0 absolute xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 text-white w-full">
            <div className="sm:w-2/3 w-4/5">
              <div className="w-full h-auto pb-4">
                <img
                  src="/images/sbacoustics/logo_sbacoustics_black_clean.webp"
                  alt="SB Acoustics Logo"
                  width={500}
                  height={500}
                  className="sm:w-1/2 w-full h-full"
                  fetchPriority='high'
                />
              </div>
              <div className="text-left text-sm text-black hidden md:block pb-4 md:max-w-2/3 w-full">
                {/* {brandImagesSBAcoustics.homepage_brand_choice_text} */}
              </div>
              <div className="items-start pb-4">
                <Button asChild size={"sm"}>
                  <Link href="/">Go to HiFi drivers</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden group rounded-none col-span-2 md:block hidden">
        <div className="relative w-auto h-[50vh] bg-cover bg-no-repeat flex items-center bg-zinc-200">
          {/* <Image
            src={brandImagesSBAutomotive.homepage_brand_choice_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImagesSBAutomotive.homepage_brand_choice_url}` : brandImagesSBAutomotive.homepage_brand_choice_url}
            alt="SB Automotive"
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
          /> */}
          <div className="h-full flex items-center xl:px-16 lg:px-12 px-8 text-black w-full ">
            <div className="sm:w-2/3 w-4/5">
              <div className="text-left text-sm text-black hidden md:block">
                {brandImagesSBAcoustics.homepage_brand_choice_text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
