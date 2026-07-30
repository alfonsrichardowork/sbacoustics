"use client"

import React from 'react';
import { Skeleton } from '../ui/skeleton';
import dynamic from 'next/dynamic';

const SwiperCarouselOneProduct = dynamic(
    () => import("@/components/single-product-page/swipercarouseloneproduct"),
    {
        ssr: false,
        loading: () => (
        <Skeleton className="min-w-full aspect-square max-h-[400px] animate-pulse bg-zinc-200 rounded-lg" />
        ),
    }
);

type PropType = {
  name: string
  cover: string
  image_catalogues: { url: string; name: string }[]
  drawing: string
  graph: string
}

const SwiperCarouselOneProductLoading: React.FC<PropType> = (props) => {
  return (
    <>
      <SwiperCarouselOneProduct name={props.name} cover={props.cover} image_catalogues={props.image_catalogues} drawing={props.drawing} graph={props.graph}/>
    </>
  );
}

export default SwiperCarouselOneProductLoading