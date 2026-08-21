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
  const goToPrevious = () => {
    setCurrentIndex((previousIndex) => {
        if (previousIndex <= 0) {
        return slides.length - 1;
        }

        return previousIndex - 1;
    });
    };

    const goToNext = () => {
    setCurrentIndex((previousIndex) => {
        if (previousIndex >= slides.length - 1) {
        return 0;
        }

        return previousIndex + 1;
    });
    };

  if (!currentSlide) {
    return null;
  }

  const imageUrl = currentSlide.featuredImgUrl.startsWith("/uploads/")
    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${currentSlide.featuredImgUrl}`
    : currentSlide.featuredImgUrl;

  const titleFontSize = isMobile ? "24px" : "48px";
  const descriptionFontSize = isMobile ? "12px" : "14px";

  const slideContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    overflow: "hidden",
  };

  const imageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    boxSizing: "border-box",

    paddingTop: isMobile ? "40px" : "80px",
    paddingRight: isMobile ? "16px" : "64px",
    paddingBottom: isMobile ? "16px" : "32px",
    paddingLeft: isMobile ? "16px" : "64px",

    display: "flex",
    alignItems: "flex-end",

    /*
     * Simple gradient supported by old Safari versions.
     */
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.95))",
  };

  const contentStyle: React.CSSProperties = {
    width: "auto",
    maxWidth: "100%",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    marginBottom: "16px",

    fontSize: titleFontSize,
    lineHeight: "1.1",
    fontWeight: 700,

    color: "#ffffff",
    textAlign: "left",
  };

  const descriptionStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    marginBottom: "16px",

    fontSize: descriptionFontSize,
    lineHeight: "1.5",

    color: "#ffffff",
    textAlign: "left",

    display: isMobile ? "block" : "block",
  };

  const productButtonStyle: React.CSSProperties = {
    display: "inline-block",

    padding: "8px 16px",

    border: "none",
    borderRadius: "4px",

    backgroundColor: "#e6001b",
    color: "#ffffff",

    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 500,

    textDecoration: "none",

    cursor: pathname.includes("sbautomotive")
      ? "default"
      : "pointer",

    boxSizing: "border-box",
  };

  const paginationStyle: React.CSSProperties = {
    position: "absolute",

    left: "50%",
    bottom: isMobile ? "16px" : "16px",

    transform: "translateX(-50%)",

    display: "flex",
    alignItems: "center",

    gap: isMobile ? "8px" : "8px",

    zIndex: 20,
  };

  const paginationButtonStyle = (
    active: boolean
  ): React.CSSProperties => ({
    width: isMobile ? "10px" : "16px",
    height: isMobile ? "10px" : "16px",

    padding: 0,
    margin: 0,

    border: "none",
    borderRadius: "50%",

    backgroundColor: active ? "#e6001b" : "#52525b",

    cursor: "pointer",

    /*
     * Avoid transform/transition/modern CSS here.
     * This keeps the dots very old-browser friendly.
     */
  });
  
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
{/* 
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          key={currentIndex}
          style={{
            ...slideContainerStyle,
            opacity: 1,
          }}
        >
          <img
            src={imageUrl}
            alt={currentSlide.name}
            style={imageStyle}
            data-testid={
              isMobile
                ? "featured-products-swiper-mobile-main-image"
                : "featured-products-swiper-desktop-main-image"
            }
          />

          <div style={overlayStyle}>
            <div style={contentStyle}>
              <h3
                style={titleStyle}
                data-testid={
                  isMobile
                    ? `featured-products-swiper-mobile-title-${currentIndex + 1}`
                    : `featured-products-swiper-desktop-title-${currentIndex + 1}`
                }
              >
                {currentSlide.name}
              </h3>

              <div
                style={descriptionStyle}
                data-testid={
                  isMobile
                    ? "featured-products-swiper-mobile-description"
                    : "featured-products-swiper-desktop-description"
                }
              >
                {currentSlide.featuredDesc}
              </div>

              <div>
                {pathname.includes("sbautomotive") ? (
                  <button
                    type="button"
                    disabled
                    style={{
                      ...productButtonStyle,
                      opacity: 0.6,
                    }}
                  >
                    Product Page
                  </button>
                ) : (
                  <a
                    href={
                      brand === "sbaudience"
                        ? `/sbaudience/products/${currentSlide.slug}`
                        : `/products/${currentSlide.slug}`
                    }
                    style={productButtonStyle}
                    data-testid={
                      isMobile
                        ? "featured-products-swiper-mobile-button"
                        : "featured-products-swiper-desktop-button"
                    }
                  >
                    Product Page
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div style={paginationStyle}>
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setCurrentIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={
                  isMobile
                    ? `featured-products-swiper-mobile-pagination-dot-${index + 1}`
                    : `featured-products-swiper-desktop-pagination-dot-${index + 1}`
                }
                data-index={index}
                style={paginationButtonStyle(
                  currentIndex === index
                )}
              />
            ))}
          </div>
        )}

        <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous slide"
        style={{
            position: "absolute",
            left: isMobile ? "10px" : "24px",
            top: "50%",

            width: isMobile ? "40px" : "50px",
            height: isMobile ? "40px" : "50px",

            padding: 0,

            border: "none",
            // borderRadius: "50%",

            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: isMobile ? "#ffffff" : "#000000",

            cursor: "pointer",

            zIndex: 30,

            fontSize: isMobile ? "40px" : "50px",
            lineHeight: isMobile ? "40px" : "50px",
            textAlign: "center",
        }}
        >
        &#8249;
        </button>

        <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        style={{
            position: "absolute",
            right: isMobile ? "10px" : "24px",
            top: "50%",

            width: isMobile ? "40px" : "50px",
            height: isMobile ? "40px" : "50px",

            padding: 0,

            border: "none",
            // borderRadius: "50%",

            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: isMobile ? "#ffffff" : "#000000",

            cursor: "pointer",

            zIndex: 30,

            fontSize: isMobile ? "40px" : "50px",
            lineHeight: isMobile ? "40px" : "50px",
            textAlign: "center",
        }}
        >
        &#8250;
        </button>
      </div> */}



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

            background:
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
                color: "#000000",
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
                  color: "#000000",
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