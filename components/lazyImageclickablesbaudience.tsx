"use client"

import { Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx"; // Optional: for conditional classes

export const LazyImageClickableSBAudience = ({ src, alt, width, height, classname }: { src: string; alt: string; width: number; height: number; classname: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex items-center justify-center h-full w-full">
        {/* Loader */}
        {isLoading && (
            <div className="absolute flex items-center justify-center z-0 w-10 h-10">
                <Loader2 className="animate-spin text-gray-500" size={20} />
            </div>
        )}


      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${classname} ${clsx("transition-transform duration-300 hover:scale-110 ", { "opacity-0": isLoading })}`} // Fade in effect
        onLoad={() => setIsLoading(false)}
        priority
      />
    </div>
  );
};