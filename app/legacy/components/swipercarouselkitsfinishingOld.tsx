"use client"

import React, { useEffect, useState } from 'react';

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
import 'yet-another-react-lightbox/styles.css'
//@ts-ignore
import 'yet-another-react-lightbox/plugins/thumbnails.css'
//@ts-ignore
import "yet-another-react-lightbox/plugins/captions.css";
import { LazyImageCustom } from '@/components/lazyImageCustom';
import { FilesProp, FilesWithOrder } from '@/app/(frontend)/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface CombinedFilesProp {
    name: string
    url: string
    urlPreview: string
    order: number
}

type PropType = {
  name: string
  kits_finishing: {url: string, order: number, finishing: {name: string, url: string}}[]
}

const SwiperCarouselKitsFinishingOld: React.FC<PropType> = (props) => {
  const [combinedFinishing, setCombinedFinishing] = useState<CombinedFilesProp[]>([])
  const [activeKitsPreview, setActiveKitsPreview] = useState<string>('')
  const [activeKitsPreviewName, setActiveKitsPreviewName] = useState<string>('')
  const [finishLoad, setFinishLoad] = useState(false)
  const { name, kits_finishing } = props
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
    const initializeData = () => {
      if(kits_finishing && kits_finishing.length > 0){ 
        let temp: CombinedFilesProp[] = []
        kits_finishing.forEach(val => {
          temp.push({
            name: val.finishing.name,
            url: val.finishing.url,
            urlPreview: val.url,
            order: val.order ?? 99
          })
          
          temp.sort((a, b) => a.order - b.order)
        })
        setCombinedFinishing(temp)
        setActiveKitsPreview(temp[0]?.urlPreview ?? '')
        setActiveKitsPreviewName(temp[0]?.name ?? '')
      }
    };

    initializeData();
  }, []);

  function changeImagePreview(url: string, name: string){
    setActiveKitsPreview(url)
    setActiveKitsPreviewName(name)
  }

  return (
    // <div style={{
    //   display: "block",
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   objectPosition: 'center',
    //   height: '100%',
    //   width: '100%',
    //   paddingTop: '32px'
    // }}>
    //   {!finishLoad && 
    //     <>
    //     ...
    //     </>
    //   }
    //   {activeKitsPreview && activeKitsPreview != '' &&
    //   <div style={{
    //     zIndex: 10,
    //     height: 'fit-content',
    //     // width: isMobile ? '100%' : '50%'
    //     width: '100%'
    //   }}>
    //     <div style={{
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       overflow: 'hidden'
    //     }}>
    //       <img
    //         src={
    //           activeKitsPreview.startsWith('/uploads/')
    //             ? `${process.env.NEXT_PUBLIC_ROOT_URL}${activeKitsPreview}`
    //               : activeKitsPreview
    //         }
    //         alt={`${name} - ${activeKitsPreviewName} Finishing`}
    //         width={1000}
    //         height={1000}
    //         style={{
    //           height: '100%',
    //           maxWidth: '100%',
    //           width: 'auto',
    //           objectFit: 'contain',
    //         }}
    //         loading='lazy'
    //         data-testid='kits-finishing-image-single-product-page'
    //         onLoad={() => setFinishLoad(true)}
    //       />
        
    //     <div style={{
    //       width: '100%',
    //       justifyContent: 'center',
    //       textAlign: 'center',
    //       paddingBottom: '24px',
    //       fontWeight: 700
    //     }}>
    //       Finish: {activeKitsPreviewName}
    //     </div>
    //     <div style={{
    //       display: 'flex',
    //       gap: '8px',
    //       width: '100%',
    //       justifyContent: 'center',
    //       alignItems: 'center'
    //     }}>
    //     {combinedFinishing && combinedFinishing.length > 0 && combinedFinishing.map((val, index) => 
    //         <div
    //           style={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             gap: '8px',
    //             paddingBottom: '6px'
    //           }}
    //           onClick={() => changeImagePreview(val.urlPreview, val.name)}
    //           key={index}
    //         >
    //           <div style={{
    //             height: '30px',
    //             display: 'flex',
    //             alignItems: 'center',
    //             borderWidth: activeKitsPreviewName === val.name ? '2px' : '0px',
    //             borderColor: activeKitsPreviewName === val.name ? '#ef4444' : 'transparent'
    //           }}>
    //             <div style={{
    //               position: 'relative',
    //               display: 'flex',
    //               alignItems: 'center',
    //               justifyContent: 'center',
    //               height: '100%',
    //               width: '100%'
    //             }}>
    //               <img 
    //                 src={val.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${val.url}` : val.url} 
    //                 alt={val.name} 
    //                 width={100}
    //                 height={100}
    //                 style={{
    //                   objectFit: "contain",
    //                   height: "100%",
    //                   width: "fit-content"
    //                 }}
    //                 loading='lazy'
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       // </div>
    //     )}
    //     </div>
    //     </div>
    //   </div>
    //   }
    // </div>

    <div
  style={{
    width: '100%',
    textAlign: 'center',
    paddingTop: '32px',
  }}
>
  {!finishLoad && (
    <>
      ...
    </>
  )}

  {activeKitsPreview && activeKitsPreview !== '' && (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <img
        src={
          activeKitsPreview.startsWith('/uploads/')
            ? `${process.env.NEXT_PUBLIC_ROOT_URL}${activeKitsPreview}`
            : activeKitsPreview
        }
        alt={`${name} - ${activeKitsPreviewName} Finishing`}
        width={1000}
        height={1000}
        style={{
          display: 'block',
          width: 'auto',
          maxWidth: '100%',
          height: 'auto',
          maxHeight: '600px',
          margin: '0 auto',
          objectFit: 'contain',
        }}
        loading="eager"
        data-testid="kits-finishing-image-single-product-page"
        onLoad={() => setFinishLoad(true)}
      />

      <div
        style={{
          width: '100%',
          textAlign: 'center',
          paddingBottom: '24px',
          fontWeight: 700,
        }}
      >
        Finish: {activeKitsPreviewName}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {combinedFinishing &&
          combinedFinishing.length > 0 &&
          combinedFinishing.map((val, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '6px',
                cursor: 'pointer',
              }}
              onClick={() =>
                changeImagePreview(val.urlPreview, val.name)
              }
            >
              <div
                style={{
                  height: '30px',
                  minWidth: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border:
                    activeKitsPreviewName === val.name
                      ? '2px solid #ef4444'
                      : '2px solid transparent',
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src={
                    val.url.startsWith('/uploads/')
                      ? `${process.env.NEXT_PUBLIC_ROOT_URL}${val.url}`
                      : val.url
                  }
                  alt={val.name}
                  width={100}
                  height={100}
                  style={{
                    display: 'block',
                    width: 'auto',
                    height: '26px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                  loading="eager"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  )}
</div>
  );
}

export default SwiperCarouselKitsFinishingOld
