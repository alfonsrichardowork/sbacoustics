"use client";

import { useEffect, useState } from "react";

export default function ClientWrapper2({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

  return (
        <div 
            style={{ 
                display: "flex", 
                justifyContent: "center", 
                width: isMobile ? "100%" : "50%", 
                height: "100%", 
                flex: "1 1 50%" 
            }}
        >   
            {children}
        </div>
    )
}
