'use client'

import { createContext, useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

export const DeviceContext = createContext({
  isLegacyIOS: false,
});

export function DeviceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLegacyIOS, setIsLegacyIOS] = useState(true);

    useEffect(() => {
        const parser = new UAParser();
        const result = parser.getResult();

        const osName = result.os.name;
        const osVersion = result.os.version;

        setIsLegacyIOS(
            !osName || !osVersion
        );
    }, []);

  return (
    <DeviceContext.Provider value={{ isLegacyIOS }}>
      {children}
    </DeviceContext.Provider>
  );
}