"use client";

import { socialmedia } from "@prisma/client";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";

interface Section4Props {
  socialmedia: socialmedia[];
}

export default function Section4({ socialmedia }: Section4Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;

      setScreenWidth(width);
      setIsMobile(width < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const sectionHeight =
    isMobile
      ? "240px"
      : screenWidth >= 1280
        ? "384px"
        : screenWidth >= 1024
          ? "320px"
          : "288px";

  return (
    <div
      style={{
        width: "100%",
        height: sectionHeight,

        boxSizing: "border-box",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",

        paddingTop: isMobile ? "16px" : "32px",
        paddingRight: isMobile ? "16px" : "64px",
        paddingBottom: isMobile ? "16px" : "32px",
        paddingLeft: isMobile ? "16px" : "64px",

        backgroundColor: "#ffffff",
      }}
    >
      <h2
        style={{
          margin: 0,
          paddingTop: "16px",
          paddingBottom: "16px",

          fontSize: isMobile ? "30px" : "48px",
          lineHeight: "1.1",
          fontWeight: 700,

          color: "#000000",
          textAlign: "left",
        }}
      >
        Social:
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",

          gap: "8px",
          width: "100%",

          paddingBottom: "16px",
        }}
      >
        {socialmedia.map((logo, index) => (
          <SocialIcon
            network={logo.type}
            style={{
              width: isMobile ? 40 : 60,
              height: isMobile ? 40 : 60,
            }}
            url={logo.value}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}