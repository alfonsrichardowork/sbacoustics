"use client"

import dynamic from 'next/dynamic';
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const SwiperCarouselSimilarProduct = dynamic(
    () => import("@/components/single-product-page/swipercarouselsimilarproduct"),
    {
        ssr: false,
        loading: () => (
        <Skeleton className="min-w-full aspect-square max-h-[250px] animate-pulse bg-zinc-200 rounded-lg" />
        ),
    }
);

type PropType = {
  similar: {similarProduct: {name: string, slug: string, cover_img_url: string}}[]
  brand: string
}

const SwiperCarouselSimilarProductLoading: React.FC<PropType> = ({ similar, brand }) => {
  return (
    <>
      <SwiperCarouselSimilarProduct similar={similar} brand={brand}/>
    </>
  );
};

export default SwiperCarouselSimilarProductLoading;
