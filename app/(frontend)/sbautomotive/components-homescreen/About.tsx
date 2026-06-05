import * as React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const About: React.FC = () => {
  return (
    <div className="relative w-full h-[calc(100vh)]">
    <img
      src='/images/sbacoustics/New_SBE.webp'
      alt='Sinar Baja Electric Facility'
      width={1000}
      height={1000}
      className="object-cover w-full h-full grayscale-75"
    />  
     <div className="absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end">
     <div className="grid gap-0 grid-cols-1 w-fit">
        <h2 className='sr-only'>About SB Automotive</h2>
            <div className="text-left font-bold xl:text-5xl text-3xl pb-4 text-white">About</div>
            <div className="text-left text-sm text-white pb-4 hidden md:block">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
            <div className="items-start pb-4">
              <Button size={"sm"} asChild>
                <Link href={'/sbautomotive/aboutus'}>
                  Learn More
                </Link>
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default About;