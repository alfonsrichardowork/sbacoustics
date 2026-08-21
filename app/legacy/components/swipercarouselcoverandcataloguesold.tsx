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

    <div style={{
      paddingInline: '40px'
    }}>
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
            <SwiperSlide>
                {/* <div className="h-full flex justify-center items-center cursor-zoom-in" onClick={() => openLightbox(0)}>
                  <Card className="border-none h-full w-full flex items-center justify-center">
                    <CardContent className="p-6 flex items-center justify-center w-full h-full bg-background"
                      onMouseEnter={() => setHoverImage(true)}
                      onMouseLeave={() => setHoverImage(false)}
                    >
                      <div className="relative flex items-center justify-center h-full w-full">
                        <div className='z-10 w-full h-fit'>
                          <div className="relative flex items-center justify-center h-full w-full"> */}
                            <img 
                              src={cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover} 
                              alt={name} 
                              width={500}
                              height={500}
                              style={{
                                objectFit: 'contain',
                                height: "100%",
                                width: '100%',
                                zIndex: 10,
                              }}
                              loading='eager'
                            />
                          {/* </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div> */}
          </SwiperSlide>
        )}
        {multipleslides && sortedImages.map((item, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`}>
              {/* <div className="h-full flex justify-center items-center cursor-zoom-in" onClick={() => openLightbox(index+1)}>
                <Card className="border-none h-full w-full flex items-center justify-center">
                  <CardContent className="p-6 flex items-center justify-center w-full h-full bg-background"
                    onMouseEnter={() => setHoverImage(true)}
                    onMouseLeave={() => setHoverImage(false)}>
                    <div className="relative flex items-center justify-center h-full w-full">
                      <div className='z-10 w-full h-fit'>
                          <div className="relative flex items-center justify-center h-full w-full"> */}
                            <img 
                              src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                              alt={item.name} 
                              width={500}
                              height={500}
                              style={{
                                objectFit: 'contain',
                                height: '100%',
                                width: '100%',
                                zIndex: 10,
                              }}
                              loading='lazy'
                            />
                          {/* </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div> */}
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      



      {multipleslides &&
      <div style={{
        paddingInline: isMobile ? '40px' : '64px'
      }}>
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
                    objectFit: 'contain',
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
                    objectFit: 'contain',
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

      {multipleslides ?
        <Lightbox
          styles={{ container: { backgroundColor: "rgba(255, 255, 255, 1)" } }}
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides=
          {[
            { 
              src: cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover, 
              title: name, 
              alt: name 
            },
            ...sortedImages.map((item, index) => ({ 
              src: item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url, 
              title: `${item.name} - ${index.toString()}`, 
              alt: `${item.name} - ${index.toString()}`
            }))
          ]}
          plugins={[Zoom, Thumbnails, Captions]}
        />
        :
        <Lightbox
          styles={{ container: { backgroundColor: "rgba(255, 255, 255, 1)" } }}
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={[{ 
            src: cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover, 
            title: name, 
            alt: name 
          }]}
          plugins={[Zoom, Captions]}
        />
      } 
    </>
  );
}

export default SwiperCarouselOneProductOld
