"use client";

import dynamic from "next/dynamic";
import { distributors } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { Card } from "./ui/card";

interface DistributorProps {
  asianDistributors: distributors[];
  europeDistributors: distributors[];
  americaDistributors: distributors[];
  oceaniaDistributors: distributors[];
  africaDistributors: distributors[];
  antarticaDistributors: distributors[];
}

const DistributorMap = dynamic(
  () => import("./MapComponent").then((mod) => ({ default: mod.DistributorMap })),
  {
    ssr: false,
    loading: () => (
      <>
        <div className="mt-6 w-screen h-100 md:h-125 flex items-center justify-center bg-zinc-300 animate-pulse"/>
        <div className="py-16 2xl:px-96 xl:px-72 lg:px-12 px-8">
          <div className='text-3xl font-bold mb-6 text-center'>
            Our Distributors
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card className={`w-full h-[500px] shadow-lg ${i % 2 === 0 ? 'justify-self-end' : 'justify-self-start'} rounded-none bg-zinc-300 animate-pulse`} key={i}>
              </Card>
            ))}
          </div>
        </div>
      </>
    ),
  }
);

export function DistributorMapWrapper(props: DistributorProps) {
  return <DistributorMap {...props} />;
}