"use client"

import { useEffect, useState } from "react";

interface Section1Props {
  text: string;
}

export default function Section1({ text }: Section1Props) {

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
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            boxSizing: "border-box",

            paddingTop: "16px",
            paddingRight: isMobile ? "32px" : "64px",
            paddingBottom: isMobile ? "16px" : "32px",
            paddingLeft: isMobile ? "32px" : "64px",

            display: "flex",
            alignItems: "flex-end",

            color: "#000000",

            background:
              "linear-gradient(to left, rgba(255,255,255,0.7), rgba(255,255,255,0.6), rgba(255,255,255,0))",

            zIndex: 50,
          }}
        >
          <div
            style={{
              display: "block",
              width: "fit-content",
            }}
          >
            <h2
              style={{
                margin: 0,
                padding: 0,
                marginBottom: "16px",

                fontSize: isMobile ? "30px" : "48px",
                lineHeight: "1.1",
                fontWeight: 700,

                textAlign: "left",
                color: "#000000",
              }}
            >
              Open Source Kits
            </h2>

            {!isMobile && (
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  marginBottom: "16px",

                  fontSize: "14px",
                  lineHeight: "1.5",

                  textAlign: "left",
                  color: "#000000",
                }}
              >
                {text}
              </div>
            )}

            <div
              style={{
                display: "block",
                marginBottom: "16px",
              }}
            >
              <a
                href="/legacy/kits/open-source-kits"
                style={{
                  display: "inline-block",
                  padding: "8px 16px",

                  backgroundColor: "#e6001b",
                  color: "#ffffff",

                  borderRadius: "4px",

                  fontSize: "14px",
                  lineHeight: "20px",

                  textDecoration: "none",
                }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
    )
}