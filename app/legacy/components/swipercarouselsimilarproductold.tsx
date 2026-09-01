"use client"

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
//@ts-ignore
import 'swiper/css';
//@ts-ignore
import 'swiper/css/navigation';
import { Navigation, Thumbs } from 'swiper/modules';

type PropType = {
  similar: {similarProduct: {name: string, slug: string, cover_img_url: string}}[]
  brand: string
}

const SwiperCarouselSimilarProductOld: React.FC<PropType> = ({ similar, brand }) => {
  const [initialized, setInitialized] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [spaceBetween, setSpaceBetween] = useState(0);
  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    const updateSwiperSettings = () => {
      const width = window.innerWidth;

      if (width > 1280) {
        setSlidesPerView(Math.min(similar.length, 3));
        setSpaceBetween(20);
      } else if (width > 768) {
        if (similar.length < 3) {
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

  const shouldShowControls = similar.length > slidesPerView;
  return (
    <div style={{
      borderWidth: '2px',
      borderRadius: '8px',
      paddingInline: '16px',
      paddingTop: '16px',
      paddingBottom: shouldShowControls ? '16px' : '0px'
    }}>
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
        style={{
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-size": "20px",
          height: '300px'
        } as CSSProperties}
      >
        {similar.map((sim, index) => (
          <SwiperSlide key={index} style={{
            padding: !shouldShowControls ? '0px' : '8px'
          }}>
            <a href={brand === 'sbaudience' ? `/legacy/sbaudience/products/${sim.similarProduct.slug}` : `/legacy/products/${sim.similarProduct.slug}`}>
              <div style={{
                borderRadius: '12px',
                borderWidth: '2px',
                backgroundColor: '#ffffff',
                boxShadow: '12px',
                width: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{
                  padding: '8px',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  marginBlockStart: '6px',
                  marginBlockEnd: '6px'
                }}>
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%'
                  }}>
                    <img 
                      src={sim.similarProduct.cover_img_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${sim.similarProduct.cover_img_url}` : sim.similarProduct.cover_img_url}
                      alt={sim.similarProduct.name}
                      width={500}
                      height={500}
                      style={{
                        aspectRatio: 'auto',
                        height: '100%',
                        width: 'fit-content',
                        objectFit: 'contain',
                        alignSelf: 'center'
                      }}
                      loading={'eager'}
                    />
                  </div>



                </div>
                <div style={{
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  height: '100%',
                }}>
                  <div style={{
                    fontSize: '16px',
                    lineHeight: '1.5',
                    fontWeight: 700,
                    lineHeightStep: 1,
                    letterSpacing: '-0.025em',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#000000',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1
                  }}>
                    {sim.similarProduct.name}
                  </div>
                </div>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {shouldShowControls &&
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {similar.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: 'calc(infinity * 1px)',
                transitionProperty: 'all',
                backgroundColor: realIndex === index ? '#e6001b' : '#3f3f46',
                scale: realIndex === index ? '125%' : '100%'
              }}
            ></button>
          ))}
        </div>
      }
    </div>
  );
};

export default SwiperCarouselSimilarProductOld;
