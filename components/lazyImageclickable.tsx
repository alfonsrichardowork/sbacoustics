"use client"

import { Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx"; // Optional: for conditional classes
import { Skeleton } from "./ui/skeleton";

export const LazyImageClickable = ({ src, alt, width, height, testid }: { src: string; alt: string; width: number; height: number; testid?: string }) => {
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
        className={clsx("w-full h-full object-contain transition-transform duration-300 hover:scale-105 ", { "opacity-0": isLoading })} // Fade in effect
        onLoad={() => setIsLoading(false)}
        priority
        data-testid={testid}
      />
    </div>
  );
};