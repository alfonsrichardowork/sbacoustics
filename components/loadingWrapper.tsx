'use client';

import { useEffect, useState } from 'react';
import { LoadingScreen } from './loadingScreen';

export default function LoadingWrapper({
  children,
  unsupported
}: {
  children: React.ReactNode;
  unsupported: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!unsupported && <LoadingScreen isLoading={isLoading} />}
      {children}
    </>
  );
}