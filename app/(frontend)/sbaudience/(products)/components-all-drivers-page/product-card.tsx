"use client";

import React from "react";
import Link from "next/link";
import { AllFilterProductsOnlyType } from "@/app/(frontend)/types";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyImageClickableSBAudience } from "@/components/lazyImageclickablesbaudience";

interface ReviewCard {
  data: AllFilterProductsOnlyType | null;
  hovered: boolean;
}

const ProductCard: React.FC<ReviewCard> = React.memo(
  ({ data, hovered }) => {

    if (!data) {
      return (
        <div className="bg-white group cursor-pointer">
          <div className="flex flex-col items-center justify-center text-center relative p-4" style={{ aspectRatio: "1/1" }}>
            <Skeleton className="w-full h-full rounded-md" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-6 w-32 rounded-md mt-2" />
          </div>
        </div>
      );
    }

    return (
      <Link
        href={`/sbaudience/products/${data.products.slug}`}
        className="bg-white group cursor-pointer"
      >  

        <div className="flex flex-col items-center justify-center text-center relative p-4" style={{ aspectRatio: "1/1" }}>
      
          <LazyImageClickableSBAudience
            src={data.products.cover_img.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${data.products.cover_img}` : data.products.cover_img}
            alt={data.products.name}
            width={500}
            height={500}
            classname={'w-fit h-full object-contain'}
          />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg lg:text-xl font-bold text-center pb-2 z-10">
            {data.products.name}
          </h2>
        </div>
      </Link>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if data or hovered changes
    // Handle null data gracefully
    const prevSlug = prevProps.data?.products.slug;
    const nextSlug = nextProps.data?.products.slug;
    
    return (
      prevSlug === nextSlug &&
      prevProps.hovered === nextProps.hovered
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
