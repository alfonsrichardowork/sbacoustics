"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';

const SwiperCarouselCoverandCatalogues = dynamic(
    () => import("@/components/single-product-page/swipercarouselcoverandcatalogues"),
    {
        ssr: false,
        loading: () => (
        <Skeleton className="min-w-full aspect-square max-h-[750px] animate-pulse bg-zinc-200 rounded-lg" />
        ),
    }
);

type PropType = {
  name: string
  cover: string
  image_catalogues: { url: string; name: string }[]
}

const SwiperCarouselOneProductSkeleton: React.FC<PropType> = (props) => {

  return (
    <>
    <SwiperCarouselCoverandCatalogues name={props.name} cover={props.cover} image_catalogues={props.image_catalogues}/>
    </>
  );
}

export default SwiperCarouselOneProductSkeleton
