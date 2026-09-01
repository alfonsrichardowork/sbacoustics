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



type PropType = {
  name: string
  cover: string
  image_catalogues: { url: string; name: string }[]
  drawing: string
  graph: string
}

const SwiperCarouselOneProductMobileOld: React.FC<PropType> = (props) => {
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
        spaceBetween={0}
        modules={[Navigation, Thumbs, FreeMode]}
        style={{
          "--swiper-pagination-color": "#000000",
          "--swiper-navigation-color": "#000000",
          "--swiper-navigation-sides-offset": "0px",
          "--swiper-navigation-size": "20px",
          height: '400px',
          width: '100%',
          backgroundColor: 'transparent',

        } as CSSProperties}
      >
        {cover && (
          
          <SwiperSlide
            style={{
              width: '100%',
              height: '400px',
              display: 'block',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingBottom: '24px',
                  boxSizing: 'border-box'
                }}
              >
                <img 
                  src={cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${cover}` : cover} 
                  alt={name} 
                  width={500}
                  height={500}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    zIndex: 10
                  }}
                  loading="eager"
                />
              </div>
            </div>
          </SwiperSlide>
        )}
        {image_catalogues && image_catalogues.length > 0 && sortedImages.map((item, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`}
            style={{
              width: '100%',
              height: '400px',
              display: 'block',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingBottom: '24px',
                  boxSizing: 'border-box'
                }}
              >
                <img 
                  src={item.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.url}` : item.url} 
                  alt={item.name} 
                  width={500}
                  height={500}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  loading="eager"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
        {drawing !== '' &&
          <SwiperSlide
            style={{
              width: '100%',
              height: '400px',
              display: 'block',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingBottom: '24px',
                  boxSizing: 'border-box'
                }}
              >
                
                <img 
                  src={drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing} 
                  alt={`${name} - Drawing`} 
                  width={500}
                  height={500}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  loading="eager"
                />
              </div>
            </div>
          </SwiperSlide>
        }
        {graph !== '' &&
          <SwiperSlide
            style={{
              width: '100%',
              height: '400px',
              display: 'block',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingBottom: '24px',
                  boxSizing: 'border-box'
                }}
              >
                
                <img 
                          src={graph.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${graph}` : graph} 
                          alt={`${name} - Frequency Response`} 
                  width={500}
                  height={500}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  loading="eager"
                />
              </div>
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
        style={{
          height: '100px'
        }}
      >
        <SwiperSlide style={{
          opacity: activeIndex === 0 ? '100%' : '50%',
          height: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

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
            zIndex : 10,
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
              width={100}
              height={100}
              style={{
                objectFit: 'contain',
                height: '100%',
                width: 'fit-content',
              }}
              loading='lazy'
            />
          </div>
          </div>
          </div>
        </SwiperSlide>
        {image_catalogues && image_catalogues.length > 0 && sortedImages.map((item, index) => (
          <SwiperSlide key={`${item.name} - ${index.toString()}`}
          style={{
            opacity: activeIndex - 1 === index ? '100%': '50%',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',        
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
                zIndex : 10,
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
                    alt={`${item.name} - ${index.toString()}`} 
                    width={100}
                    height={100}
                    style={{
                      objectFit: 'contain',
                      height: '100%',
                      width: 'fit-content',
                    }}
                    loading='lazy'
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {drawing !== '' &&
          <SwiperSlide
          style={{
            opacity: activeIndex - image_catalogues.length - 1 === 0 ? '100%': '50%',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',        
          }}
          onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(image_catalogues.length + 1);
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
                zIndex : 10,
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
                    src={drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing} 
                    alt={`${name} - Drawing`} 
                    width={100}
                    height={100}
                    style={{
                      objectFit: 'contain',
                      height: '100%',
                      width: 'fit-content',
                    }}
                    loading='lazy'
                  />
                </div>
            </div>
            </div>
          </SwiperSlide>
        }
        {graph !== '' &&
          <SwiperSlide
          style={{
            opacity: activeIndex - image_catalogues.length - 2 === 0 ? '100%': '50%',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',        
          }}
          onClick={() => {
            if (swiperRef.current) {
              // If loop is true, use slideToLoop to account for looped indices
              swiperRef.current.slideToLoop(image_catalogues.length + 2);
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
                zIndex : 10,
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
                    src={graph.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${graph}` : graph} 
                    alt={`${name} - Frequency Response`} 
                    width={100}
                    height={100}
                    style={{
                      objectFit: 'contain',
                      height: '100%',
                      width: 'fit-content',
                    }}
                    loading='lazy'
                  />
                </div>
            </div>
            </div>
          </SwiperSlide>
        }
      </Swiper>
    </>
  );
}

export default SwiperCarouselOneProductMobileOld