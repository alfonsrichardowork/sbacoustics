'use client';

import { useState, useEffect } from 'react';
import { LoadingScreen } from './loadingScreen';

export default function LoadingWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Brief delay for smooth visual transition
    const timer = setTimeout(() => setIsLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      {children}
    </>
  );
}