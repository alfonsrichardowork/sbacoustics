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

interface CombinedFilesProp {
    name: string
    url: string
    productId: string
    urlPreview: string
    order: number
}

type PropType = {
  kits_finishing: FilesProp[]
  kits_finishing_preview: FilesWithOrder[]
}

const SwiperCarouselKitsFinishing: React.FC<PropType> = (props) => {
  const [combinedFinishing, setCombinedFinishing] = useState<CombinedFilesProp[]>([])
  const [activeKitsPreview, setActiveKitsPreview] = useState<string>('')
  const [activeKitsPreviewName, setActiveKitsPreviewName] = useState<string>('')
  const { kits_finishing, kits_finishing_preview } = props

  useEffect(() => {
    const initializeData = () => {
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
            urlPreview: preview?.url ?? '',
            order: preview?.order ?? 99
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
    <div className='block justify-center items-center object-center h-full pt-8'>
      {activeKitsPreview && activeKitsPreview != '' &&
      <div className="z-10 h-full w-fit">
        <div className="flex items-center justify-center overflow-hidden">
          <img
            src={
              activeKitsPreview.startsWith('/uploads/')
                ? `${process.env.NEXT_PUBLIC_ROOT_URL}${activeKitsPreview}`
                  : activeKitsPreview
            }
            alt={`${activeKitsPreviewName} Finishing`}
            width={1000}
            height={1000}
            className={`h-full max-w-full w-auto object-cover transition-transform duration-300`}
            // loading='lazy'
            loading='lazy'
          />
        </div>
        
        <div className='w-full justify-center text-center pb-6 font-bold'>Finish: {activeKitsPreviewName}</div>
        <div className='flex gap-2 w-full justify-center items-center'>
        {combinedFinishing && combinedFinishing.length > 0 && combinedFinishing.map((val, index) => 
          <div className={`flex items-center gap-2 lg:pb-2 pb-1 hover:cursor-pointer transition-all duration-200`} onClick={() => changeImagePreview(val.urlPreview, val.name)} key={index}>
            <div className={`h-[30px] flex items-center ${activeKitsPreviewName === val.name && 'border-red-500 border-2'}`}>
              <LazyImageCustom
                src={val.url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${val.url}` : val.url} 
                alt={val.name} 
                width={100}
                height={100}
                classname="object-contain h-full w-fit"
                lazy={false}
              />
            </div>
          </div>
        )}
        </div>
      </div>
      }
    </div>
  );
}

export default SwiperCarouselKitsFinishing
