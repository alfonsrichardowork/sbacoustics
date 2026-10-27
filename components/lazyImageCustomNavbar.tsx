"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export const LazyImageCustomNavbar = ({
  src,
  alt,
  width,
  height,
  classname,
  lazy,
  testid,
  containerheight,
  containerwidth,
  pathname
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  classname: string;
  lazy: boolean;
  testid?: string;
  containerheight: string;
  containerwidth: string;
  pathname?: string
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative inline-flex ${containerheight} ${containerwidth} items-center`}>
      {isLoading && (
        <Skeleton className={`absolute inset-0 z-10 h-full w-full rounded-md ${pathname?.includes('sbaudience') && 'bg-background/10'}`} />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${classname} transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        loading={lazy ? "lazy" : "eager"}
        priority={!lazy}
        data-testid={testid}
      />
    </div>
  );
};