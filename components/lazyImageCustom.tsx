"use client"

import { lazy, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export const LazyImageCustom = ({ src, alt, width, height, classname, lazy, testid }: { src: string; alt: string; width: number; height: number; classname: string; lazy: boolean, testid?: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex items-center justify-center h-full w-full">
        {/* Loader */}
        
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-md" />
      )}

      <Image 
        src={src} 
        alt={alt} 
        width={width}
        height={height}
        className={classname}
        onLoad={() => setIsLoading(false)}
        loading={lazy ? 'lazy' : 'eager'}
        priority={lazy ? false : true}
        data-testid={testid}
      />
    </div>
  );
};