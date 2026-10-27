"use client"

import React, { useState } from 'react';

type PropType = {
  name: string
  frequencyres: string
}


const FrequencyResponseSectionOld: React.FC<PropType> = (props) => {
  const { name, frequencyres } = props
  const [hoverImage, sethoverImage] = useState<boolean>(false)

  return (
    // <>
    // <div style={{
    //   paddingInline: '40px'
    // }}>
    //       <img 
    //         src={frequencyres.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${frequencyres}` : frequencyres}
    //         alt={`${name} - Frequency Response`}
    //         width={1000}
    //         height={1000}
    //         style={{
    //           objectFit: 'contain',
    //           height: "100%",
    //           width: '100%',
    //           zIndex: 10,
    //         }}
    //         loading='eager'
    //       />
    // </div>
    // </>

    <div 
    style={{
      width: '100%',
      height: '400px',
      display: 'block',
      flexShrink: 0
    }}>
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
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '24px',
          boxSizing: 'border-box'
        }}>
          <img
            src={frequencyres.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${frequencyres}` : frequencyres}
            alt={`${name} - Frequency Response`}
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
            loading={'eager'}
          />
        </div>
      </div>
    </div>
  );
}

export default FrequencyResponseSectionOld
