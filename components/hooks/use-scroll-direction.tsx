import { useEffect, useState } from 'react';

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up
      if (currentScrollY < prevScrollY) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down (only if scrolled more than 50px)
      else if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  return isVisible;
}