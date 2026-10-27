'use client';

import { useEffect, useState, type ReactNode } from 'react';

type AnimatedHeroWrapperProps = {
  children: ReactNode;
};

const AnimatedHeroWrapper = ({ children }: AnimatedHeroWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`sticky top-0 left-0 w-full h-screen flex items-center justify-center ${
        isVisible ? 'animate-slide-up' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

export default AnimatedHeroWrapper;