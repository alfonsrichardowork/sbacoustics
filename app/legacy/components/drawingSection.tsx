"use client"

import React, { useState } from 'react';

type PropType = {
  name: string
  drawing: string
}


const DrawingSectionOld: React.FC<PropType> = (props) => {
  const { name, drawing } = props
  const [hoverImage, sethoverImage] = useState<boolean>(false)

  return (
    // <div style={{
    //   paddingInline: '40px'
    // }}>
    //   <img 
    //     src={drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing}
    //     alt={`${name} - Drawing Image`}
    //     width={500}
    //     height={500}
    //     style={{
    //       objectFit: 'contain',
    //       height: "100%",
    //       width: '100%',
    //       zIndex: 10,
    //     }}
    //     loading='eager'
    //   />
    // </div>


    
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
            src={drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing}
            alt={`${name} - Drawing Image`}
            width={500}
            height={500}
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
  );
}

export default DrawingSectionOld
