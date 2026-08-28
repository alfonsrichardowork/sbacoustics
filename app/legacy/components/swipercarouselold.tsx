"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FeaturedProducts } from "@/app/(frontend)/types";
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

//@ts-ignore
import 'swiper/css';
//@ts-ignore
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';

type PropType = {
  slides: FeaturedProducts[];
  brand: string;
};

const SwiperCarouselOld: React.FC<PropType> = ({ slides, brand }) => {
  const pathname = usePathname();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsDesktop(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  /*
   * Hide loading screen once slides are available.
   */
  useEffect(() => {
    if (slides && slides.length > 0) {
      setIsLoading(false);
    }
  }, [slides]);

  /*
   * Autoplay
   */
  useEffect(() => {
    if (!slides || slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((previousIndex) => {
        if (previousIndex >= slides.length - 1) {
          return 0;
        }

        return previousIndex + 1;
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [slides]);

  /*
   * Make sure current index is valid if slides change.
   */
  useEffect(() => {
    if (slides.length > 0 && currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides, currentIndex]);

  if (!slides || slides.length === 0) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pathname.includes("sbaudience")
            ? "#000000"
            : pathname.includes("sbautomotive")
              ? "transparent"
              : "#ffffff",
          zIndex: 0,
        }}
      >
        ...
      </div>
    );
  }

  const safeCurrentIndex = Math.min(currentIndex, slides.length - 1);
  const currentSlide = slides[safeCurrentIndex];
 
  if (!currentSlide) {
    return null;
  }
  
  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            backgroundColor: pathname.includes("sbaudience")
              ? "#000000"
              : pathname.includes("sbautomotive")
                ? "transparent"
                : "#ffffff",

            zIndex: 100,
          }}
        >
          ...
        </div>
      )}



    <div 
      style={{
        // display: isMobile ? "none" : "block",
        flexShrink: 1
      }}
    >
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
        style={{
          height: "100%"
        }}
      >
        {slides.map((item, index) => (
          <SwiperSlide
            key={index}
          >
            <div style={{
              position: "relative",
              width: "100%",
              height: "100vh"
            }}>
              <img 
                src={item.featuredImgUrl.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.featuredImgUrl}` : item.featuredImgUrl} 
                alt={item.name} 
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />


        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            boxSizing: "border-box",

            paddingTop: "16px",
            paddingRight: isMobile ? "16px" : "64px",
            paddingBottom: isMobile ? "16px" : "32px",
            paddingLeft: isMobile ? "16px" : "64px",

            display: "flex",
            alignItems: "flex-end",

            color: "#000000",

            background: pathname.includes('sbaudience') ? 
            "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.6), rgba(0,0,0,0))"
            :
            "linear-gradient(to left, rgba(255,255,255,0.7), rgba(255,255,255,0.6), rgba(255,255,255,0))",

            zIndex: 50,
          }}
        >
          <div
            style={{
              display: "block",
              width: "fit-content",
            }}
          >
            <h2
              style={{
                margin: 0,
                padding: 0,
                marginBottom: "16px",

                fontSize: isMobile ? "30px" : "48px",
                lineHeight: "1.1",
                fontWeight: 700,

                textAlign: "left",
                color: pathname.includes('sbaudience') ? "#ffffff" : "#000000",
              }}
            >
              {item.name}
            </h2>

            {!isMobile && (
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  marginBottom: "16px",

                  fontSize: "14px",
                  lineHeight: "1.5",

                  textAlign: "left",
                  color: pathname.includes('sbaudience') ? "#ffffff" : "#000000",
                }}
              >
                {item.featuredDesc}
              </div>
            )}

            <div
              style={{
                display: "block",
                marginBottom: "16px",
              }}
            >
        
              {pathname.includes('sbautomotive') ? 
                <button disabled>
                  Product Page  
                </button> 
              :
                <button style={{
                  paddingInline: '16px',
                  paddingBlock: '8px',
                  color: '#ffffff',
                  backgroundColor: '#e6001b',
                  borderRadius: '8px'
                  
                }}>
                  <a href={brand === 'sbaudience' ? `/legacy/sbaudience/products/${item.slug}`: `/legacy/products/${item.slug}`}>Product Page</a>
                </button>
              }
            </div>
          </div>
        </div>
            </div>
          </SwiperSlide>
        ))}
        
      {/* Pagination Dots */}
      <div
        style={{
            bottom: "max(1rem, env(safe-area-inset-bottom))",
            position: "absolute",
            left: '50%',
            translate: "50%",
            zIndex: 50,
            display: 'flex',
            gap: '8px'
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
            style={{
              width: '16px',
              height: '16px',
              borderRadius: 'calc(infinity * 1px)',
              transitionProperty: 'all',
              transitionDuration: "300ms",
              animationDuration: "300ms",
              cursor: 'pointer',
              backgroundColor: realIndex === index ? '#e6001b' : '#3f3f46'
            }}
          />
        ))}
      </div>
      </Swiper>
      
    </div>

    </>
  );
};

export default SwiperCarouselOld;