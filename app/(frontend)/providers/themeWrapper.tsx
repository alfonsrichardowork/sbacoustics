"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const theme = pathname.includes("sbaudience")
      ? "sbaudience"
      : pathname.includes("sbautomotive")
      ? "sbautomotive"
      : "sbacoustics";

    document.documentElement.className = theme;
  }, [pathname]);

  return <>{children}</>;
}
