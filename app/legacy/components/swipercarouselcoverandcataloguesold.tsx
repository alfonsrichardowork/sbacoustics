"use client"

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

// Import Swiper styles
//@ts-ignore
import 'swiper/css';
//@ts-ignore
import 'swiper/css/free-mode';
//@ts-ignore
import 'swiper/css/navigation';
//@ts-ignore
import 'swiper/css/thumbs';
//@ts-ignore
import '@/app/globals.css';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';


import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Captions from "yet-another-react-lightbox/plugins/captions";
//@ts-ignore
import 'yet-another-react-lightbox/styles.css'
//@ts-ignore
import 'yet-another-react-lightbox/plugins/thumbnails.css'
//@ts-ignore
import "yet-another-react-lightbox/plugins/captions.css";
import "./style/all-style.css"
import { LazyImageCustom } from '@/components/lazyImageCustom';


type PropType = {
  name: string
  cover: string
  image_catalogues: { url: string; name: string }[]
}

const SwiperCarouselOneProductOld: React.FC<PropType> = (props) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const [initialized, setInitialized] = useState(false);
  const [multipleslides, setmultipleslides] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [hoverImage, setHoverImage] = useState<boolean>(false)
  const [totalCatalgouesOnView, settotalCatalgouesOnView] = useState<number>(4)
  const { name, cover, image_catalogues } = props
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const checkMobile = () => {
          setIsMobile(window.innerWidth < 768);
      };

      checkMobile();

      window.addEventListener("resize", checkMobile);

      return () => {
          window.removeEventListener("resize", checkMobile);
      };
  }, []);

  useEffect(() => {
    const updateSwiperSettings = () => {
      image_catalogues && image_catalogues.length > 0 ? setmultipleslides(true) : setmultipleslides(false)
      cover && image_catalogues && image_catalogues.length < 2 ? settotalCatalgouesOnView(2) : cover && image_catalogues && image_catalogues.length < 3 ? settotalCatalgouesOnView(3) : settotalCatalgouesOnView(4)
      setInitialized(true); // allow rendering Swiper after settings are correct
    };

    updateSwiperSettings();
  }, []);
  
  if (!initialized) return null; // wait until loop/slidesPerView is set correctly

  const sortedImages = image_catalogues.length > 0 ? [...image_catalogues].sort((a, b) => {
    const aIsPicture = a.name.toLowerCase().startsWith("picture");
    const bIsPicture = b.name.toLowerCase().startsWith("picture");

    if (aIsPicture && !bIsPicture) return -1;
    if (!aIsPicture && bIsPicture) return 1;

    if (aIsPicture && bIsPicture) {
      const aNum = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
      const bNum = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);
      return aNum - bNum;
    }

    return a.name.localeCompare(b.name);
  }) : []

  return (
    <>
    <div className='single-product-page-SwiperCarouselOneProductOld'>
      <Swiper
        style={{
          "--swiper-pagination-color": "#000000",
          "--swiper-navigation-sides-offset": "0px",
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-size": "25px",
          height: "100%",
          backgroundColor: 'transparent',

        } as CSSProperties}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex)
        }}
        slidesPerView={1}
        loop={multipleslides}
        spaceBetween={0}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {cover && (
          //   <SwiperSlide>
          //                   <img 
          //                     src={cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover} 
          //                     alt={name} 
          //                     width={500}
          //                     height={500}
          //                     style={{
          //                       objectFit: 'contain',
          //                       height: "100%",
          //                       width: '100%',
          //                       zIndex: 10,
          //                     }}
          //                     loading='eager'
          //                   />
          // </SwiperSlide>
          <SwiperSlide>
                <div style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'zoom-in'
                }} onClick={() => openLightbox(0)}>
                  <div style={{
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    borderStyle: 'none',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      paddingInline: '24px',
                      paddingBottom: '24px',
                      paddingTop: '0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'transparent'
                    }}
                      onMouseEnter={() => setHoverImage(true)}
                      onMouseLeave={() => setHoverImage(false)}
                    >
                      <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%'
                      }}>
                        <div style={{
                          zIndex: 10,
                          width: '100%',
                          height: 'fit-content'
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
                              src={cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover} 
                              alt={name} 
                              width={500}
                              height={500}
                              style={{
                                objectFit: 'contain',
                                height: '100%',
                                width: 'fit-content',
                                zIndex: 10
                              }}
                              loading={'eager'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          </SwiperSlide>
        )}
        {multipleslides && sortedImages.map((item, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`}>
              <div style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'zoom-in'
                }} onClick={() => openLightbox(index+1)}>
                <div style={{
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    borderStyle: 'none',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <div style={{
                      paddingInline: '24px',
                      paddingBottom: '24px',
                      paddingTop: '0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={() => setHoverImage(true)}
                    onMouseLeave={() => setHoverImage(false)}>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%'
                      }}>
                        <div style={{
                          zIndex: 10,
                          width: '100%',
                          height: 'fit-content'
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
                              src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                              alt={item.name} 
                              width={500}
                              height={500}
                              style={{
                                objectFit: 'cover',
                                height: '100%',
                                width: 'fit-content'
                              }}
                              loading={'eager'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      



      {multipleslides &&
      <div className='single-product-page-SwiperCarouselOneProductOld-thumbnail'>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={totalCatalgouesOnView}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {cover && (
          <SwiperSlide style={{
            opacity: activeIndex === 0 ? '100%' : '50%',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}  
          onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(0);
            }
          }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%'
            }}>
              <div style={{
                zIndex: 10,
                height: '75px'
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
                  src={cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover} 
                  alt={name} 
                  width={1000}
                  height={1000}
                  style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: 'fit-content'
                  }}
                  loading='eager'
                />
              </div>
              </div>
            </div>
          </SwiperSlide>
        )}
        {multipleslides && sortedImages.map((item, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`} 
          style={{
            opacity: activeIndex - 1 === index ? '100%' : '50%',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(index + 1);
            }
          }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%'
            }}>
              <div style={{
                zIndex: 10,
                height: '75px'
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
                  src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                  alt={item.name} 
                  width={1000}
                  height={1000}
                  style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: 'fit-content'
                  }}
                  loading='eager'
                />
              </div>
                </div>
              </div>
          </SwiperSlide>
        ))} 
      </Swiper>
      </div>
      }
    </>
  );
}

export default SwiperCarouselOneProductOld
