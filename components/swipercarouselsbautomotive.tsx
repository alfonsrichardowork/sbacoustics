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
  slides: string[];
};

const SwiperCarouselSBAutomotive: React.FC<PropType> = (props) => {
  const { slides } = props;
  const [realIndex, setRealIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef<SwiperClass | null>(null);
  const swiperRefMobile = useRef<SwiperClass | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Set loading to false once slides are available
    if (slides && slides.length > 0) {
      setIsLoading(false);
    }
  }, [slides]);

  return (
    <>
        <div className={`w-full h-screen absolute top-0 left-0 flex items-center justify-center ${pathname.includes('sbaudience') ? 'bg-black' : pathname.includes('sbautomotive') ? '' : 'bg-white'} z-0`}>
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      
      <div className="w-full">
        
        {slides && slides.length > 0 && (
          <>
            {/* Desktop View */}
            <div className="lg:block hidden shrink">
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
                modules={[Autoplay]}
                className="swiper h-full"
                data-testid="featured-products-swiper-desktop-overall"
              >
                {slides.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    data-index={index}
                    data-testid={`featured-products-swiper-desktop-slide`}
                    className='h-full'
                  >
                    <div className="relative w-full min-h-dvh h-dvh">
                      <img 
                        src={item.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item}` : item} 
                        alt={''} 
                        className='w-full h-full object-cover' 
                        data-testid="featured-products-swiper-desktop-main-image" 
                      />

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Pagination Dots */}
              <div
                className="absolute pb-10 pr-4 right-0 -translate-x-1/2 z-10 flex gap-2"
                style={{
                    bottom: "max(1rem, env(safe-area-inset-bottom))",
                }}
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (swiperRef.current) {
                        swiperRef.current.slideToLoop(index);
                      }
                    }}
                    className={`w-6 h-6 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                      realIndex === index ? 'bg-primary scale-125' : 'bg-zinc-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    data-testid={`featured-products-swiper-desktop-pagination-dot-${index + 1}`}
                    data-index={index}
                  />
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden block shrink">
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
                modules={[Autoplay]}
                className="swiper h-full"
                data-testid="featured-products-swiper-mobile-overall"
              >
                {slides.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    data-testid={`featured-products-swiper-mobile-slide-${index + 1}`}
                    className='h-full'
                  >
                    <div className="relative w-full min-h-dvh h-dvh">
                      <img 
                        src={item.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item}` : item} 
                        alt={''} 
                        className='w-full h-full object-cover' 
                        data-testid="featured-products-swiper-mobile-main-image" 
                      />

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Pagination Dots - with safe area padding */}
              <div
                className="absolute left-1/2 -translate-x-1/2 z-10 flex gap-2"
                style={{
                    bottom: "max(1rem, env(safe-area-inset-bottom))",
                }}
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (swiperRefMobile.current) {
                        swiperRefMobile.current.slideToLoop(index);
                      }
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                      realIndex === index ? 'bg-primary scale-125' : 'bg-zinc-700'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    data-testid={`featured-products-swiper-mobile-pagination-dot-${index + 1}`}
                    data-index={index}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SwiperCarouselSBAutomotive;
