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
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
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
  
    const openLightbox = (index: number) => {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
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


    if (!initialized) return null; // wait until loop/slidesPerView is set correctly

  return (
    <>
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex)
        }}
        thumbs={{ swiper: thumbsSwiper }}
        navigation={true}
        modules={[Navigation, Thumbs, FreeMode]}
        className="oneproductswiper h-72 custom-swiper"
        style={{
          "--swiper-pagination-color": "#000000",
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-sides-offset": "0px",
          "--swiper-navigation-size": "20px",
        } as CSSProperties}
      >
        {cover && (
          <SwiperSlide>
          {/* <Dialog>
            <DialogTrigger asChild> */}
              <div className="h-full flex justify-center items-center cursor-pointer" onClick={() => openLightbox(0)}>
                <Card className="border-none h-full w-full flex items-center justify-center">
                  <CardContent className="p-6 flex items-center justify-center w-full h-full bg-white"
                      onMouseEnter={() => setHoverImage(true)}
                      onMouseLeave={() => setHoverImage(false)}>
                    <div className="relative flex items-center justify-center h-full w-full">
                    {/* <div
                          className={`absolute top-0 right-0 transform transition-all duration-300 ease-in-out ${hoverImage ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} z-20`}
                        >
                          <Eye size={25} />
                        </div> */}
                        <div className='z-10 w-full h-fit'>
                          <LazyImageCustom 
                            src={cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover} 
                            alt={name} 
                            width={200}
                            height={200}
                            classname={`object-contain h-full w-fit transition-transform duration-300 ${hoverImage ? 'scale-110' : ''}`}
                            lazy={false}
                            testid="cover-image-single-product-page"
                          />
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
        </SwiperSlide>
        )}
        {image_catalogues && image_catalogues.length > 0 && sortedImages.map((item, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`}>
              <div className="h-full flex justify-center items-center cursor-pointer" onClick={() => openLightbox(index + 1)}>
                <Card className="border-none h-full w-full flex items-center justify-center">
                  <CardContent className="p-6 flex items-center justify-center w-full h-full bg-white"
                      onMouseEnter={() => setHoverImage(true)}
                      onMouseLeave={() => setHoverImage(false)}>
                    <div className="relative flex items-center justify-center h-full w-full">
                    {/* <div
                          className={`absolute top-0 right-0 transform transition-all duration-300 ease-in-out ${hoverImage ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} z-20`}
                        >
                          <Eye size={25} />
                        </div> */}
                        <div className='z-10 w-full h-fit'>
                        <LazyImageCustom 
                          src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                          alt={`${item.name} - ${index.toString()}`} 
                          width={200}
                          height={200}
                          classname={`object-contain h-full w-fit transition-transform duration-300 ${hoverImage ? 'scale-110' : ''}`}
                          lazy={true}
                          testid={`image-catalogues-${index}-single-product-page`}
                        />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
          </SwiperSlide>
        ))}
        {drawing !== '' &&
          <SwiperSlide>
            <div className="h-full flex justify-center items-center cursor-pointer" onClick={() => openLightbox(image_catalogues.length + 1)}>
              <Card className="border-none h-full w-full flex items-center justify-center">
                <CardContent className="p-6 flex items-center justify-center w-full h-full bg-white"
                  onMouseEnter={() => setHoverImage(true)}
                  onMouseLeave={() => setHoverImage(false)}>
                  <div className="relative  flex items-center justify-center h-full w-full">
                  {/* <div
                      className={`absolute top-0 right-0 transform transition-all duration-300 ease-in-out ${hoverImage ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} z-20`}
                    >
                      <Eye size={25} />
                    </div> */}
                    <div className='z-10 w-full h-fit'>
                    <LazyImageCustom 
                      src={drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing} 
                      alt={`${name} - Drawing`} 
                      width={200}
                      height={200}
                      classname={`object-contain h-full w-fit transition-transform duration-300 ${hoverImage ? 'scale-110' : ''}`}
                      lazy={true}
                      testid='drawing-image-single-product-page'
                    />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SwiperSlide>
        }
        {graph !== '' &&
          <SwiperSlide>
            <div className="h-full flex justify-center items-center cursor-pointer" onClick={() => openLightbox(image_catalogues.length + 2)}>
              <Card className="border-none h-full w-full flex items-center justify-center">
                <CardContent className="p-6 flex items-center justify-center w-full h-full bg-white"
                  onMouseEnter={() => setHoverImage(true)}
                  onMouseLeave={() => setHoverImage(false)}>
                  <div className="relative  flex items-center justify-center h-full w-full"> 
                  {/* <div
                      className={`absolute top-0 right-0 transform transition-all duration-300 ease-in-out ${hoverImage ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} z-20`}
                    >
                      <Eye size={25} />
                    </div> */}
                    <div className='z-10 w-full h-fit'>
                    <LazyImageCustom 
                      src={graph.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${graph}` : graph} 
                      alt={`${name} - Frequency Response`} 
                      width={200}
                      height={200}
                      classname={`object-contain h-full w-fit transition-transform duration-300 ${hoverImage ? 'scale-110' : ''}`}
                      lazy={true}
                      testid='frequency-response-image-single-product-page'
                    />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SwiperSlide>
        }
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={totalCatalgouesOnView}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper h-[100px]"
      >
        <SwiperSlide className={`${activeIndex === 0? "opacity-100": "opacity-50"} h-fit flex items-center justify-center hover:cursor-pointer hover:opacity-100`}
        onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(0);
            }
          }}>
        <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
          <div className='z-10 h-[75px]'>
          <LazyImageCustom 
            src={cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover} 
            alt={name} 
            width={100}
            height={100}
            classname="object-contain w-fit h-full"
            lazy={false}
          />
          </div>
          </div>
        </SwiperSlide>
        {image_catalogues && image_catalogues.length > 0 && sortedImages.map((item, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`} className={`${activeIndex - 1 === index? "opacity-100": "opacity-50"} h-fit flex items-center justify-center hover:cursor-pointer hover:opacity-100`}
          onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(index + 1);
            }
          }}>
            <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
              <div className='z-10 h-[75px]'>
            <LazyImageCustom 
              src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
              alt={`${item.name} - ${index.toString()}`} 
              width={100}
              height={100}
              classname="object-contain w-fit h-full"
              lazy={false}
            />
            </div>
            </div>
          </SwiperSlide>
        ))}
        {drawing !== '' &&
          <SwiperSlide className={`${activeIndex - image_catalogues.length - 1 === 0 ? "opacity-100": "opacity-50"} h-fit flex items-center justify-center hover:cursor-pointer hover:opacity-100`}
          onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(image_catalogues.length + 1);
            }
          }}>
            <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
            <div className='z-10 h-[75px]'>
            <LazyImageCustom 
              src={drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing} 
              alt={`${name} - Drawing`} 
              width={100}
              height={100}
              classname="object-contain w-fit h-full"
              lazy={false}
            />
            </div>
            </div>
          </SwiperSlide>
        }
        {graph !== '' &&
          <SwiperSlide className={`${activeIndex - image_catalogues.length - 2 === 0 ? "opacity-100": "opacity-50"} h-fit flex items-center justify-center hover:cursor-pointer hover:opacity-100`}
          onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(image_catalogues.length + 2);
            }
          }}>
            <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
            <div className='z-10 h-[75px]'>
            <LazyImageCustom 
              src={graph.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${graph}` : graph} 
              alt={`${name} - Frequency Response`} 
              width={100}
              height={100}
              classname="object-contain w-fit h-full"
              lazy={false}
            />
            </div>
            </div>
          </SwiperSlide>
        }
      </Swiper>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={[
          {
            src: cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover,
            title: name,
            description: "Cover",
            alt: name,
          },
          ...sortedImages.map((item, index) => ({
            src: item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url,
            title: `${item.name} - ${index.toString()}`,
            description: `Catalogue ${index.toString()}`,
            alt: `${item.name} - ${index.toString()}`,
          })),
          ...(drawing !== ''
            ? [
                {
                  src: drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing,
                  title: `${name} - Drawing`,
                  description: "Drawing",
                  alt: `${name} - Drawing`,
                },
              ]
            : []),
          ...(graph !== ''
            ? [
                {
                  src: graph.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${graph}` : graph,
                  title: `${name} - Frequency Response`,
                  description: "Frequency Response",
                  alt: `${name} - Frequency Response`,
                },
              ]
            : []),
        ]}
        plugins={[Zoom, Thumbnails, Captions]}
      />
    </>
  );
}

export default SwiperCarouselOneProduct