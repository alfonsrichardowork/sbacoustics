"use client"

import * as React from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BrandChoice() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <Card className="relative overflow-hidden border-none group rounded-none hover:cursor-pointer" onClick={() => router.push('/')}>
        <h2 className='sr-only'>Explore Our Brands: SB Acoustics</h2>
        <div className="relative w-auto h-screen bg-cover bg-no-repeat flex items-center">
          <Image
            src="/images/sbacoustics/sbaudience_choice_v2.webp"
            alt="SB Audience"
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="bottom-0 absolute xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 text-white sm:w-2/3 w-4/5">
              <div className="w-full h-auto pb-4">
                <Image
                  src="/images/sbaudience/logo_sbacoustics.png"
                  alt="SB Acoustics Logo"
                  width={1000}
                  height={1000}
                  className="sm:w-1/2 w-full h-full"
                  priority
                />
              </div>
              <div className="text-left text-sm text-white hidden md:block pb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <div className="items-start pb-4">
                <Button asChild size={"sm"}>
                  <Link href="/">Learn More</Link>
                </Button>
              </div>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden border-none group rounded-none hover:cursor-pointer" onClick={() => router.push('/sbaudience')}>
        <h2 className='sr-only'>Explore Our Brands: SB Audience</h2>
        <div className="relative w-auto h-screen bg-cover bg-no-repeat flex items-center">
          <Image
            src="/images/sbacoustics/sbautomotive_choice_v2.webp"
            alt="SB Audience"
            width={1000}
            height={1000}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="bottom-0 absolute xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 text-white sm:w-2/3 w-4/5">
              <div className="w-full h-auto pb-4">
                <Image
                  src="/images/sbaudience/logo_sbaudience.webp"
                  alt="SB Audience Logo"
                  width={1000}
                  height={1000}
                  className="sm:w-1/2 w-full h-full"
                  priority
                />
              </div>
              <div className="text-left text-sm text-white hidden md:block pb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <div className="items-start pb-4">
                <Button asChild size={"sm"}>
                  <Link href="/sbaudience">Learn More</Link>
                </Button>
              </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
