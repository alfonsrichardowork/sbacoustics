"use client";

import { useEffect, useState } from "react";
import { Loader } from "./ui/loader";

interface PageLoaderProps {
  initialLoad?: boolean
  duration?: number;
  children?: React.ReactNode;
}

const PageLoader: React.FC<PageLoaderProps> = ({ initialLoad = false, duration = 500, children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [slideUp, setSlideUp] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        if(!initialLoad){
          setTimeout(() => {
          requestAnimationFrame(() => {
              setSlideUp(true);
              document.body.style.overflow = '';
              setTimeout(() => {
                setIsLoading(false);
              }, 700); // Duration of slide-up animation
          });
          }, duration);
        }
    }, [initialLoad, duration]);

  return (
    <>
      {isLoading && (
        <div
          className={`fixed top-0 left-0 w-full h-full z-[1000] flex items-center justify-center bg-black transition-transform duration-700 ${
            slideUp ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <Loader />
        </div>
      )}
      {!isLoading && children}
    </>
  );
};

export default PageLoader;
