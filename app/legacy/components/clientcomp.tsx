"use client"

import { useEffect, useState } from "react";

type PropType = {
  text: string
};

const ClientComp: React.FC<PropType> = (props) => {
  const { text } = props;
  const [displayLoading, setDisplayLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

return (
  <>
    <div
      style={{
        height: '30vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#22c55e',
        textAlign: 'center',
      }}
    >
      {text && <div>text: {text}</div>}
    </div>
     <div
      style={{
        height: '30vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#22c55e',
        textAlign: 'center',
      }}
    >
      {displayLoading ? <div>Loading...</div> : <div>Content loaded</div>}
    </div>
  </> 
  );
};

export default ClientComp;
