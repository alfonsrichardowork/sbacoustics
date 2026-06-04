"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { LazyImageCustom } from '@/components/lazyImageCustom';
import { FilesProp } from '@/app/(frontend)/types';

type PropType = {
  name: string
  frequencyres: string
}


const FrequencyResponseSection: React.FC<PropType> = (props) => {
  const [hoverImage, setHoverImage] = useState<boolean>(false)
  const { name, frequencyres } = props

  return (
    <>
    <Card className="w-full border-none">
        <CardContent className="flex justify-center bg-background"
            onMouseEnter={() => setHoverImage(true)}
            onMouseLeave={() => setHoverImage(false)}
        >
          <div className="relative overflow-hidden flex items-center justify-center h-full w-full">
            {/* <div
              className={`text-foreground absolute top-0 right-0 transform transition-all duration-300 ease-in-out ${hoverImage ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} z-20`}
            >
              <Eye size={25} />
            </div> */}
            
            <div className="relative overflow-hidden z-10"> {/* Added overflow-hidden here */}
              <LazyImageCustom
                src={frequencyres.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${frequencyres}` : frequencyres}
                alt={`${name} - Frequency Response`}
                width={1000}
                height={1000}
                classname={`object-contain px-10 transition-transform duration-300 ${hoverImage ? 'scale-110' : ''}`}
                lazy={false}
              />
            </div>
          </div>
        </CardContent>
    </Card>
    </>
  );
}

export default FrequencyResponseSection
