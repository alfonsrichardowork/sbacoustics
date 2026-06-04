"use client"

import React, { CSSProperties, useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Card, CardContent } from '@/components/ui/card';

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import "yet-another-react-lightbox/plugins/captions.css";
import { LazyImageCustom } from '@/components/lazyImageCustom';
import { FilesProp } from '@/app/(frontend)/types';

interface CombinedFilesProp {
    name: string
    url: string
    productId: string
    urlPreview: string
}

type PropType = {
  kits_finishing: FilesProp[]
  kits_finishing_preview: FilesProp[]
}

const SwiperCarouselKitsFinishing: React.FC<PropType> = (props) => {
  const [combinedFinishing, setCombinedFinishing] = useState<CombinedFilesProp[]>([])
  const [initialized, setInitialized] = useState(false);
  const [multipleslides, setmultipleslides] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [totalCatalgouesOnView, settotalCatalgouesOnView] = useState<number>(4)
  const { kits_finishing, kits_finishing_preview } = props
  kits_finishing.length > 0 && kits_finishing.map((val) => {
    
  })
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateSwiperSettings = () => {
      if(kits_finishing && kits_finishing.length > 0){ 
        let temp: CombinedFilesProp[] = []
        const previewMap = new Map(
          kits_finishing_preview.map(p => [p.name, p])
        )

        kits_finishing.forEach(val => {
          const preview = previewMap.get(val.name)

          temp.push({
            name: val.name,
            url: val.url,
            productId: val.productId,
            urlPreview: preview?.url ?? ''
          })
        })
        setCombinedFinishing(temp)
        setmultipleslides(true) 
      }
      else { 
        setmultipleslides(false)
      }
      kits_finishing.length < 2 ? settotalCatalgouesOnView(2) : kits_finishing.length < 3 ? settotalCatalgouesOnView(3) : settotalCatalgouesOnView(4)
      setInitialized(true);
    };

    updateSwiperSettings();
  }, []);
  
  if (!initialized) return null;


  return (
    <>

    <div className='lg:px-16 px-10'>
      <Swiper
        style={{
          "--swiper-pagination-color": "#000000",
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-size": "20px",
        } as CSSProperties}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex)
        }}
        loop={multipleslides}
        spaceBetween={0}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 h-full bg-transparent"
      >
          {multipleslides && combinedFinishing.map((item: CombinedFilesProp, index) => (
            <SwiperSlide key={`${item.name} - ${index.toString()}`}>
                <div className="h-full flex justify-center items-center">
                  <Card className="border-none h-full w-full flex items-center justify-center">
                    <CardContent className="p-6 flex items-center justify-center w-full h-full">
                      <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
                        <div className="z-10 h-[300px] w-full flex items-center justify-center overflow-hidden">
                          <LazyImageCustom
                            src={
                              item.urlPreview.startsWith('/uploads/')
                                ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.urlPreview}`
                                : item.urlPreview === ''
                                  ? '/images/sbacoustics/no-finishing-image.webp'
                                  : item.urlPreview
                            }
                            alt={item.name}
                            width={500}
                            height={500}
                            classname={`h-full max-w-full w-auto object-contain transition-transform duration-300`}
                            lazy={true}
                          />
                        </div>


                      </div>
                    </CardContent>
                  </Card>
                </div>
            </SwiperSlide>
          ))}
      </Swiper>
      </div>
      

      {multipleslides &&
      <div className='lg:px-16 px-10'>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={totalCatalgouesOnView}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        
        {multipleslides && combinedFinishing.map((item: CombinedFilesProp, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`} className={`${activeIndex === index? "opacity-100": "opacity-50"} h-fit flex items-center justify-center hover:cursor-pointer hover:opacity-100`} 
          onClick={() => {
            if (swiperRef.current) {
              swiperRef.current.slideToLoop(index);
            }
          }}>
            <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
              <div className='z-10 h-[60px]'>
                <LazyImageCustom
                  src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                  alt={item.name} 
                  width={1000}
                  height={1000}
                  classname="object-cover h-full w-fit"
                  lazy={false}
                />
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

export default SwiperCarouselKitsFinishing
