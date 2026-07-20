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
        <h2 className='sr-only'>{brand === 'sbaudience' ? 'SB Audience Featured Products' : 'SB Acoustics Featured Products'}</h2>
        
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
                        src={item.featuredImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.featuredImgUrl}` : item.featuredImgUrl} 
                        alt={item.name} 
                        className='w-full h-full object-cover' 
                        data-testid="featured-products-swiper-desktop-main-image" 
                      />

                      <div className={`absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end bg-gradient-to-t from-black to-transparent`}>
                        <div className="grid gap-0 grid-cols-1 w-fit">
                          <h3 className="text-left font-bold xl:text-5xl text-3xl text-white pb-4 lg:text-white" data-testid={`featured-products-swiper-desktop-title-${index + 1}`}>
                            {item.name}
                          </h3>
                          <div className="text-left text-sm text-white pb-4 hidden md:block lg:text-white" data-testid="featured-products-swiper-desktop-description">
                            {item.featuredDesc}
                          </div>
                          <div className="items-start pb-5">
                            {pathname.includes('sbautomotive') ? 
                              <Button size="sm" disabled>
                                Product Page  
                              </Button> 
                            :
                              <Button asChild size={"sm"} data-testid="featured-products-swiper-desktop-button">
                                <Link href={brand === 'sbaudience' ? `/sbaudience/products/${item.slug}`: `/products/${item.slug}`}>Product Page</Link>
                              </Button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Pagination Dots */}
              <div
                className="absolute left-1/2 -translate-x-1/2 z-50 flex gap-2"
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
                    className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                      realIndex === index ? 'bg-primary scale-125' : 'bg-zinc-700'
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
                        src={item.featuredImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.featuredImgUrl}` : item.featuredImgUrl} 
                        alt={item.name} 
                        className='w-full h-full object-cover' 
                        data-testid="featured-products-swiper-mobile-main-image" 
                      />

                      <div className={`absolute inset-x-0 bottom-0 px-4 py-4 h-fit flex items-end bg-gradient-to-t from-black to-transparent`}>
                        <div className="grid gap-0 grid-cols-1 w-fit">
                          <h3 className="text-left font-bold text-2xl text-white pb-4" data-testid={`featured-products-swiper-mobile-title-${index + 1}`}>
                            {item.name}
                          </h3>
                          <div className="text-left text-xs text-white pb-4" data-testid="featured-products-swiper-mobile-description">
                            {item.featuredDesc}
                          </div>
                          <div className="items-start pb-5">
                            {pathname.includes('sbautomotive') ? 
                              <Button size="sm" disabled>
                                Product Page  
                              </Button> 
                            :
                              <Button asChild size={"sm"} data-testid="featured-products-swiper-mobile-button">
                                <Link href={brand === 'sbaudience' ? `/sbaudience/products/${item.slug}`: `/products/${item.slug}`}>Product Page</Link>
                              </Button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Pagination Dots - with safe area padding */}
              <div
                className="absolute left-1/2 -translate-x-1/2 z-50 flex gap-2"
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

export default SwiperCarousel;
