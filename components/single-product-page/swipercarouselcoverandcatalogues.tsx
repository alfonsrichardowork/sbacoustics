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
import '@/app/globals.css';

// import required modules
import { FreeMode, Navigation } from 'swiper/modules';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';


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
import { LazyImageCustom } from '@/components/lazyImageCustom';


type PropType = {
  name: string
  cover: string
  image_catalogues: { url: string; name: string }[]
}

const SwiperCarouselOneProduct: React.FC<PropType> = (props) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const thumbnailSwiperRef = useRef<SwiperClass | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [multipleslides, setmultipleslides] = useState(false);
  const [hoverImage, setHoverImage] = useState<boolean>(false)
  const [totalCatalgouesOnView, settotalCatalgouesOnView] = useState<number>(4)
  const { name, cover, image_catalogues } = props
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
  const slides: { src: string; name: string; kind: 'cover' | 'catalogue' }[] = [
    ...(cover ? [{
      src: cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover,
      name,
      kind: 'cover' as const,
    }] : []),
    ...sortedImages.map((item) => ({
      src: item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url,
      name: item.name,
      kind: 'catalogue' as const,
    })),
  ]

  return (
    <>

    <div className='lg:px-12 px-10'>
      <Swiper
        style={{
          "--swiper-pagination-color": "#000000",
          "--swiper-navigation-sides-offset": "0px",
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-size": "25px",
        } as CSSProperties}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex)
          const thumbnailSwiper = thumbnailSwiperRef.current
          const activeThumbnailIsVisible = thumbnailSwiper && Array.from(thumbnailSwiper.slides).some(
            (slide) =>
              slide.getAttribute('data-swiper-slide-index') === String(swiper.realIndex) &&
              slide.classList.contains('swiper-slide-visible')
          )
          if (thumbnailSwiper && !activeThumbnailIsVisible) {
            thumbnailSwiper.slideToLoop(swiper.realIndex)
          }
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
          }
        }}
        loop={multipleslides}
        spaceBetween={0}
        navigation={true}
        modules={[FreeMode, Navigation]}
        className="mySwiper2 aspect-square max-h-[750px] bg-transparent custom-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`${slide.kind}-${slide.name}-${index}`}>
              <div className="h-full flex justify-center items-center cursor-zoom-in" onClick={() => openLightbox(index)}>
                <Card className="border-none h-full w-full flex items-center justify-center">
                  <CardContent className="p-6 flex items-center justify-center w-full h-full bg-background"
                    onMouseEnter={() => setHoverImage(true)}
                    onMouseLeave={() => setHoverImage(false)}>
                    <div className="relative flex items-center justify-center h-full w-full">
                      <div className='z-10 w-full h-fit'>
                        <LazyImageCustom 
                          src={slide.src} 
                          alt={slide.name} 
                          width={500}
                          height={500}
                          classname={`${slide.kind === 'cover' ? 'object-contain' : 'object-cover'} h-full w-fit transition-transform duration-300 ${slide.kind === 'cover' ? 'z-10' : ''} ${hoverImage ? 'scale-105' : ''}`}
                          lazy={slide.kind !== 'cover'}
                          testid={slide.kind === 'cover' ? 'cover-image-single-product-page' : `image-catalogues-${index - (cover ? 1 : 0)}-single-product-page`}
                        />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
          </SwiperSlide>
        ))}
        <button ref={prevRef} type="button" className="custom-prev" aria-label="Previous image">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button ref={nextRef} type="button" className="custom-next" aria-label="Next image">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </Swiper>
      </div>
      

      {multipleslides &&
      <div className='lg:px-16 px-10'>
      <Swiper
        onSwiper={(swiper) => (thumbnailSwiperRef.current = swiper)}
        loop={slides.length > 1}
        spaceBetween={10}
        slidesPerView={totalCatalgouesOnView}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`${slide.kind}-${slide.name}-${index}`} className={`${activeIndex === index ? "opacity-100": "opacity-50"} h-fit flex items-center justify-center hover:cursor-pointer hover:opacity-100`} 
          onClick={() => {
            if (swiperRef.current) {
              swiperRef.current.slideToLoop(index);
            }
          }}>
            <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
              <div className='z-10 h-[75px]'>
                <LazyImageCustom
                  src={slide.src} 
                  alt={slide.name} 
                  width={300}
                  height={300}
                  classname="object-cover h-full w-fit"
                  lazy={slide.kind !== 'cover'}
                />
                </div>
              </div>
          </SwiperSlide>
        ))} 
      </Swiper>
      </div>
      }

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-white"
          style={{
            position: "fixed",
            inset: 0,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
          </div>

          {multipleslides ?
            <Lightbox
              styles={{ 
                container: { 
                  backgroundColor: "rgba(255, 255, 255, 1)"
                },
                root: {
                  backgroundColor: "#000",
                },
              }}
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={lightboxIndex}
              slides={slides.map((slide, index) => ({
                src: slide.src,
                title: slide.kind === 'cover' ? slide.name : `${slide.name} - ${index - (cover ? 1 : 0)}`,
                alt: slide.name,
              }))}
              plugins={[Zoom, Thumbnails, Captions]}
            />
            :
            <Lightbox
              styles={{ 
                container: { 
                  backgroundColor: "rgba(255, 255, 255, 1)" 
                },
                root: {
                  backgroundColor: "#000",
                },
              }}
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={lightboxIndex}
              slides={slides.map((slide) => ({
                src: slide.src,
                title: slide.name,
                alt: slide.name,
              }))}
              plugins={[Zoom, Captions]}
            />
          } 
        </div>
      )}
    </>
  );
}

export default SwiperCarouselOneProduct
