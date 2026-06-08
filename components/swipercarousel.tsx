"use client"

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

//@ts-ignore
import 'swiper/css';
//@ts-ignore
import 'swiper/css/navigation';

import { Autoplay, Navigation } from 'swiper/modules';
import { FeaturedProducts } from '@/app/(frontend)/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

type PropType = {
  slides: FeaturedProducts[];
  brand: string
};

const SwiperCarousel: React.FC<PropType> = (props) => {
  const { slides, brand } = props;
  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const swiperRefMobile = useRef<SwiperClass | null>(null);
  const pathname = usePathname()
  return (
    <>
    <div className="absolute top-0 left-0 w-full h-full object-cover bg-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={20} />
      </div>
      <h2 className='sr-only'>{brand === 'sbaudience' ? 'SB Audience Featured Products' : 'SB Acoustics Featured Products'}</h2>
    {slides && slides.length > 0 && 
    <>
      <div className="lg:block hidden">
        <Swiper
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            const indexAttr = swiper.slides[swiper.activeIndex]?.getAttribute('data-swiper-slide-index');
            const real = indexAttr ? parseInt(indexAttr) : 0;
            setRealIndex(real);
          }}
          slidesPerView={1}
          // navigation={true}
          modules={[Autoplay]}
          className="swiper"
          // style={{
          //   '--swiper-navigation-color': '#e60013',
          // } as CSSProperties}
        >
          {slides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-screen">
                <img src={item.featuredImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.featuredImgUrl}` : item.featuredImgUrl} alt={item.name} className='w-full h-full object-cover' />

                <div className={`absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end ${'bg-linear-to-t from-black to-transparent'}`}>
                    <div className="grid gap-0 grid-cols-1 w-fit">
                      <h3 className="text-left font-bold xl:text-5xl text-3xl text-foreground pb-4 lg:text-white">
                        {item.name}
                      </h3>
                      <div className="text-left text-sm text-foreground pb-4 hidden md:block lg:text-white">
                        {item.featuredDesc}
                      </div>
                      <div className="items-start pb-4">
                        <Button asChild size={"sm"}>
                          <Link href={brand === 'sbaudience' ? `/sbaudience/products/${item.slug}`: `/products/${item.slug}`}>Product Page</Link>
                        </Button>
                      </div>
                    </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideToLoop(index);
              }
            }}
            className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
              realIndex === index ? 'bg-primary scale-125' : 'bg-zinc-700'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
      </div>


      <div className="lg:hidden block">
        <Swiper
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          onSwiper={(swiper) => (swiperRefMobile.current = swiper)}
          onSlideChange={(swiper) => {
            const indexAttr = swiper.slides[swiper.activeIndex]?.getAttribute('data-swiper-slide-index');
            const real = indexAttr ? parseInt(indexAttr) : 0;
            setRealIndex(real);
          }}
          slidesPerView={1}
          navigation={false}
          modules={[Autoplay, Navigation]}
          className="swiper"
          style={{
            '--swiper-navigation-color': '#e60013',
          } as CSSProperties}
        >
          {slides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-screen">
                <img src={item.featuredImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.featuredImgUrl}` : item.featuredImgUrl} alt={item.name} className='w-full h-full object-cover' fetchPriority='high'/>

                <div className={`absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end ${pathname.includes('sbaudience') ? 'bg-linear-to-t from-black to-transparent': 'bg-linear-to-r from-white/80 to-white/0'}`}>
                    <div className={`grid gap-0 grid-cols-1 w-fit`}>
                      <h3 className={`text-left font-bold xl:text-5xl text-3xl text-foreground pb-4 lg:text-white ${pathname.includes("sbaudience") && 'text-white'}`}>
                        {item.name}
                      </h3>
                      <div className={`text-left text-sm text-foreground pb-4 hidden md:block lg:text-white ${pathname.includes("sbaudience") && 'text-white'}`}>
                        {item.featuredDesc}
                      </div>
                      <div className="items-start pb-4">
                        <Button asChild size={"sm"}>
                          <Link href={brand === 'sbaudience' ? `/sbaudience/products/${item.slug}`: `/products/${item.slug}`}>Product Page</Link>
                        </Button>
                      </div>
                    </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (swiperRefMobile.current) {
                  swiperRefMobile.current.slideToLoop(index);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                realIndex === index ? 'bg-primary scale-125' : 'bg-zinc-700'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    
       

      </>
      }
      </div>
    </>
  );
};

export default SwiperCarousel;
