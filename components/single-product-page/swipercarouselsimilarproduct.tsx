"use client"

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Thumbs } from 'swiper/modules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LazyImageCustom } from '@/components/lazyImageCustom';
import { SimpleProdTypes } from '@/app/(frontend)/types';

type PropType = {
  similar: SimpleProdTypes[]
}

const SwiperCarouselSimilarProduct: React.FC<PropType> = ({ similar }) => {
  const [initialized, setInitialized] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [spaceBetween, setSpaceBetween] = useState(0);
  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    const updateSwiperSettings = () => {
      const width = window.innerWidth;

      if (width > 1280) {
        if (similar.length < 3) {
          setSlidesPerView(1);
        } else if (similar.length < 4) {
          setSlidesPerView(2);
        } else {
          setSlidesPerView(3);
        }
        setSpaceBetween(20);
      } else if (width > 768) {
        if (similar.length < 4) {
          setSlidesPerView(1);
        } else {
          setSlidesPerView(2);
        }
        setSpaceBetween(10);
      } else {
        setSlidesPerView(1);
        setSpaceBetween(0);
      }

      setInitialized(true); // allow rendering Swiper after settings are correct
    };

    updateSwiperSettings();
    window.addEventListener("resize", updateSwiperSettings);
    return () => window.removeEventListener("resize", updateSwiperSettings);
  }, [similar.length]);

  if (!initialized) return null; // wait until loop/slidesPerView is set correctly

  return (
    <>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={true}
        loop={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          const indexAttr = swiper.slides[swiper.activeIndex]?.getAttribute('data-swiper-slide-index');
          const real = indexAttr ? parseInt(indexAttr) : 0;
          setRealIndex(real);
        }}
        modules={[Navigation, Thumbs]}
        className={`mySwiper h-[265px]`}
        style={{
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-size": "20px",
        } as CSSProperties}
      >
        {similar.map((sim, index) => (
          <SwiperSlide key={index}>
            <Link href={sim.href}>
              <Card className="w-full h-[250px] flex flex-col border-2 hover:border-primary">
                <CardHeader className="p-2 h-[200px]">
                  <LazyImageCustom
                    src={sim.image_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${sim.image_url}` : sim.image_url}
                    alt={sim.name}
                    width={500}
                    height={500}
                    classname="aspect-auto h-full w-fit object-contain self-center"
                    lazy={false}
                  />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 h-full p-2">
                  <CardTitle className="text-center justify-center items-center font-bold text-base text-black whitespace-normal break-words pb-2">
                    {sim.name}
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center gap-2">
        {similar.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              realIndex === index ? 'bg-primary scale-125' : 'bg-zinc-700'
            }`}
          ></button>
        ))}
      </div>
    </>
  );
};

export default SwiperCarouselSimilarProduct;
