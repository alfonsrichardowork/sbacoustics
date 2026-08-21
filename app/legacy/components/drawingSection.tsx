"use client"

import React from 'react';

type PropType = {
  name: string
  drawing: string
}


const DrawingSectionOld: React.FC<PropType> = (props) => {
  const { name, drawing } = props

  return (
    <>
    <div style={{
      paddingInline: '40px'
    }}>
    {/* <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: 'hsl(var(--background))',
        padding: '24px',
        paddingTop: '0px'
      }}
    >
    <div style={{
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: '100%',
      width: '100%'
    }}>  
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: '100%',
          width: '100%'
        }}> */}
          <img 
            src={drawing.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${drawing}` : drawing}
            alt={`${name} - Drawing Image`}
            width={500}
            height={500}
            style={{
              objectFit: 'contain',
              height: "100%",
              width: '100%',
              zIndex: 10,
            }}
            loading='eager'
          />
        {/* </div>
      </div>
    </div>

    </div> */}

    </div>
    </>
  );
}

export default DrawingSectionOld
