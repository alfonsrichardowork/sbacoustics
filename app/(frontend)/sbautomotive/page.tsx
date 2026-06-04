"use client"

import React from "react";
import BrandChoice from "./components-homescreen/BrandChoice";
import PageLoader from "@/components/pageLoader";
import About from "./components-homescreen/About";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FindUs from "./components-homescreen/FindUs";
import Catalogues from "./components-homescreen/Catalogues";



export default function LandingPageSBAutomotive() {
  return (
    <>
    <PageLoader duration={500}/>
      <div className="relative">
        <h1 className='sr-only'>Welcome to SB Automotive Official Website!</h1>
        {/* <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
          <ComingSoon/>
        </div> */}



        <div className="relative min-h-screen">
          <BrandChoice />
        </div>
        {/* <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
          <OpenSourceKits />
        </div>
           */}
      

        {/* <div className="relative min-h-screen"> */}
            {/* <div className="xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 flex items-end z-50">
              <div className="grid gap-0 grid-cols-1 w-fit">
                <h3 className="text-left font-bold xl:text-5xl text-3xl pb-4 text-black">
                  Open Source Kits
                </h3>
                <div className="text-left text-sm pb-4 hidden md:block text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
                <div className="items-start pb-4">
                  <Button asChild size="sm">
                    <Link href="/kits/open-source-kits">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div> */}

          {/* <div className="relative min-h-screen">
            <About />
          </div>
        </div> */}

          {/* <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center bg-background">
            <Catalogues />
          </div>
          <div className="relative">
            <div className="xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 flex items-end z-50">
                <div className="grid gap-0 grid-cols-1 w-fit">
                  <h3 className="text-left font-bold xl:text-5xl text-3xl pb-4 text-foreground">
                    Catalogues
                  </h3>
                  <div className="text-left text-sm pb-4 hidden md:block text-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </div>
                  <div className="items-start pb-4">
                    <Button size={"sm"} asChild>
                      <Link href={'/sbautomotive/catalogues'}>
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
            </div>
            <FindUs />
        </div> */}
      </div>
    </>
  );
}
