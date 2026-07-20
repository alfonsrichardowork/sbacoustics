import Link from 'next/link';
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
  const brandImagesSBAudience = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    },
    select: {
      homepage_brand_choice_url: true,
      homepage_brand_choice_text: true
    }
  })
  if(!brandImagesSBAcoustics || brandImagesSBAcoustics.homepage_brand_choice_url === ''){
    return null
  }
  if(!brandImagesSBAudience || brandImagesSBAudience.homepage_brand_choice_url === ''){
    return null
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative overflow-hidden group rounded-none col-span-1">
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
          <div className="bottom-0 absolute bg-linear-to-t from-zinc-100 to-transparent w-full h-2/5 md:block hidden z-0"/>
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
              <div className="text-left text-sm text-black hidden lg:block pb-4 md:max-w-2/3 w-full">
                {brandImagesSBAcoustics.homepage_brand_choice_text}
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

      <div className="relative overflow-hidden group rounded-none col-span-1">
        <div className="relative w-auto h-[50vh] bg-cover bg-no-repeat flex items-center bg-zinc-200">
          <img
            src={brandImagesSBAudience.homepage_brand_choice_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImagesSBAudience.homepage_brand_choice_url}` : brandImagesSBAudience.homepage_brand_choice_url}
            alt="SB Audience Logo"
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            fetchPriority='high'
          />
          <div className="bottom-0 absolute bg-linear-to-t from-zinc-900 to-transparent w-full h-2/5 md:block hidden z-0"/>
          <div className="bottom-0 absolute xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 text-white w-full">
            <div className="sm:w-2/3 w-4/5">
              <div className="w-full h-auto pb-4">
                <img
                  src="/images/sbacoustics/logo_sbaudience.png"
                  alt="SB Audience Logo"
                  width={500}
                  height={500}
                  className="sm:w-1/2 w-full h-full"
                  fetchPriority='high'
                />
              </div>
              <div className="text-left text-sm text-white hidden lg:block pb-4">
                {brandImagesSBAudience.homepage_brand_choice_text}
              </div>
              <div className="items-start pb-4">
                <Button asChild size={"sm"}>
                  <Link href="/sbaudience">Go to pro drivers</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
