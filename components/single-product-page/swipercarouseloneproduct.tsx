"use client"

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

//@ts-ignore
import 'swiper/css';
//@ts-ignore
import 'swiper/css/pagination';
//@ts-ignore
import 'swiper/css/navigation';
//@ts-ignore
import '@/app/globals.css';


// import required modules
import { Navigation, FreeMode } from 'swiper/modules';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Captions from "yet-another-react-lightbox/plugins/captions"
//@ts-ignore
import 'yet-another-react-lightbox/styles.css'
//@ts-ignore
import 'yet-another-react-lightbox/plugins/thumbnails.css'
//@ts-ignore
import "yet-another-react-lightbox/plugins/captions.css";
import { LazyImageCustom } from '@/components/lazyImageCustom';
import { FilesProp } from '@/app/(frontend)/types';



type PropType = {
  name: string
  cover: string
  image_catalogues: { url: string; name: string }[]
  drawing: string
  graph: string
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
  
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverImage, setHoverImage] = useState<boolean>(false)
    const { name, cover, image_catalogues, drawing, graph } = props

    const [totalCatalgouesOnView, settotalCatalgouesOnView] = useState<number>(4)
    const swiperRef = useRef<SwiperClass | null>(null);
    const [initialized, setInitialized] = useState(false);
    // const [multipleslides, setmultipleslides] = useState(false);

    useEffect(() => {
      const updateSwiperSettings = () => {
        // catalogues && catalogues.length > 0 ? setmultipleslides(true) : setmultipleslides(false)
        cover && image_catalogues && drawing && graph && (image_catalogues.length < 1) ? settotalCatalgouesOnView(3) : settotalCatalgouesOnView(4)
        setInitialized(true); // allow rendering Swiper after settings are correct
      };
  
      updateSwiperSettings();
    }, []);

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

    const slides: {
      src: string;
      alt: string;
      title: string;
      description: string;
      kind: 'cover' | 'catalogue' | 'drawing' | 'graph';
      testid: string;
      lazy: boolean;
    }[] = [
      ...(cover ? [{
        src: cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover,
        alt: name,
        title: name,
        description: 'Cover',
        kind: 'cover' as const,
        testid: 'cover-image-single-product-page',
        lazy: false,
      }] : []),
      ...sortedImages.map((item, index) => ({
        src: item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url,
        alt: `${item.name} - ${index.toString()}`,
        title: `${item.name} - ${index.toString()}`,
        description: `Catalogue ${index.toString()}`,
        kind: 'catalogue' as const,
        testid: `image-catalogues-${index}-single-product-page`,
        lazy: true,
      })),
      ...(drawing !== '' ? [{
        src: drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing,
        alt: `${name} - Drawing`,
        title: `${name} - Drawing`,
        description: 'Drawing',
        kind: 'drawing' as const,
        testid: 'drawing-image-single-product-page',
        lazy: true,
      }] : []),
      ...(graph !== '' ? [{
        src: graph.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${graph}` : graph,
        alt: `${name} - Frequency Response`,
        title: `${name} - Frequency Response`,
        description: 'Frequency Response',
        kind: 'graph' as const,
        testid: 'frequency-response-image-single-product-page',
        lazy: true,
      }] : []),
    ]

    if (!initialized) return null; // wait until loop/slidesPerView is set correctly

  return (
    <>
      <Swiper
        loop={slides.length > 1}
        pagination={{
          clickable: true,
        }}
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
        navigation={true}
        modules={[Navigation, FreeMode]}
        className="oneproductswiper h-72 custom-swiper"
        style={{
          "--swiper-pagination-color": "#000000",
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-sides-offset": "0px",
          "--swiper-navigation-size": "20px",
        } as CSSProperties}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`${slide.kind}-${index}`}>
            <div className="h-full flex justify-center items-center cursor-pointer" onClick={() => openLightbox(index)}>
              <Card className="border-none h-full w-full flex items-center justify-center">
                <CardContent className="p-6 flex items-center justify-center w-full h-full bg-white"
                  onMouseEnter={() => setHoverImage(true)}
                  onMouseLeave={() => setHoverImage(false)}>
                  <div className="relative flex items-center justify-center h-full w-full">
                    <div className='z-10 w-full h-full'>
                      <LazyImageCustom
                        src={slide.src}
                        alt={slide.alt}
                        width={200}
                        height={200}
                        classname={`object-contain h-full w-fit transition-transform duration-300 ${hoverImage ? 'scale-105' : ''}`}
                        lazy={slide.lazy}
                        testid={slide.testid}
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
      <Swiper
        onSwiper={(swiper) => (thumbnailSwiperRef.current = swiper)}
        loop={slides.length > 1}
        spaceBetween={10}
        slidesPerView={totalCatalgouesOnView}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation]}
        className="mySwiper h-[100px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={`${slide.kind}-${index}`}
            className={`${activeIndex === index ? "opacity-100" : "opacity-50"} h-fit flex items-center justify-center hover:cursor-pointer hover:opacity-100`}
            onClick={() => swiperRef.current?.slideToLoop(index)}
          >
            <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
              <div className='z-10 h-[75px]'>
                <LazyImageCustom
                  src={slide.src}
                  alt={slide.alt}
                  width={100}
                  height={100}
                  classname="object-contain w-fit h-full"
                  lazy={false}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      

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

          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slides.map(({ src, title, description, alt }) => ({
              src,
              title,
              description,
              alt,
            }))}
            plugins={[Zoom, Thumbnails, Captions]}
            styles={{
              root: {
                backgroundColor: "#000",
              },
            }}
          />
        </div>
      )}
    </>
  );
}

export default SwiperCarouselOneProduct