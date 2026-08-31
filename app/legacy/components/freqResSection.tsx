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

    
    <>
    <div style={{
      borderRadius: '8px',
      width: '100%',
      borderStyle: 'none'
    }}>
    <div
      style={{
        paddingInline: '24px',
        paddingBottom: '24px',
        paddingTop: '0px',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }}
            onMouseEnter={() => sethoverImage(true)}
            onMouseLeave={() => sethoverImage(false)}
        >
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%'
        }}>
            {/* <div
              className={`text-foreground absolute top-0 right-0 transform transition-all duration-300 ease-in-out ${hoverImage ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} z-20`}
            >
              <Eye size={25} />
            </div> */}
            
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              zIndex: 10
            }}> 
          
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: "center",
                height: '100%',
                width: '100%'
              }}>
                <img
                  src={frequencyres.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${frequencyres}` : frequencyres}
                  alt={`${name} - Frequency Response`}
                  width={1000}
                  height={1000}
                  style={{
                    objectFit: 'contain',
                    paddingInline: '40px',
                    scale: hoverImage ? '105%' : '100%'
                  }}
                  loading={'eager'}
                />
              </div>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}

export default FrequencyResponseSectionOld
