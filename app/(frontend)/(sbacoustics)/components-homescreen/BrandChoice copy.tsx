import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import prismadb from '@/lib/prismadb';

export default async function BrandChoice() {
  const brandImagesSBAudience = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
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
  if(!brandImagesSBAudience || brandImagesSBAudience.homepage_brand_choice_url === ''){
    return null
  }
  if(!brandImagesSBAutomotive || brandImagesSBAutomotive.homepage_brand_choice_url === ''){
    return null
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <Card className="relative overflow-hidden border-none group rounded-none">
        <h2 className='sr-only'>Explore Our Brands: SB Audience</h2>
        <div className="relative w-auto h-screen bg-cover bg-no-repeat flex items-center">
          <Image
            src={brandImagesSBAudience.homepage_brand_choice_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImagesSBAudience.homepage_brand_choice_url}` : brandImagesSBAudience.homepage_brand_choice_url}
            alt="SB Audience"
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="bottom-0 absolute xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 text-white bg-linear-to-t from-black to-transparent w-full">
            <div className="sm:w-2/3 w-4/5">
              <div className="w-full h-auto pb-4">
                <Image
                  src="/images/sbacoustics/logo_sbaudience.png"
                  alt="SB Audience Logo"
                  width={1000}
                  height={1000}
                  className="sm:w-1/2 w-full h-full"
                />
              </div>
              <div className="text-left text-sm text-white hidden md:block pb-4">
                {brandImagesSBAudience.homepage_brand_choice_text}
              </div>
              <div className="items-start pb-4">
                <Button asChild size={"sm"}>
                  <Link href="/sbaudience">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden border-none group rounded-none">
        <h2 className='sr-only'>Explore Our Brands: SB Automotive</h2>
        <div className="relative w-auto h-screen bg-cover bg-no-repeat flex items-center">
          <Image
            src={brandImagesSBAutomotive.homepage_brand_choice_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImagesSBAutomotive.homepage_brand_choice_url}` : brandImagesSBAutomotive.homepage_brand_choice_url}
            alt="SB Automotive"
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="bottom-0 absolute xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 text-white bg-linear-to-t from-black to-transparent w-full">
            <div className="sm:w-2/3 w-4/5">
              <div className="w-full h-auto pb-4">
                <Image
                  src="/images/sbacoustics/logo_sbautomotive_white.webp"
                  alt="SB Automotive Logo"
                  width={1000}
                  height={1000}
                  className="sm:w-1/2 w-full h-full"
                />
              </div>
              <div className="text-left text-sm text-white hidden md:block pb-4">
                {brandImagesSBAutomotive.homepage_brand_choice_text}
              </div>
              <div className="items-start pb-4">
                <Button asChild size={"sm"}>
                  <Link href="/sbautomotive">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
