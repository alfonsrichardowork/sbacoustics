import * as React from 'react';
const Catalogues: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full object-cover bg-background">
      <div className="relative w-full h-screen">
        <h2 className='sr-only'>Explore SB Automotive Catalogues</h2>
        <img src={`/images/sbacoustics/Catalogues_Cover.webp`} alt={"SB Automotive Catalogues"} className='w-full h-full object-cover' />
      </div>
    </div>
  );
}

export default Catalogues;