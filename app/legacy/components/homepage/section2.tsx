"use client"
import { useEffect, useState } from "react";

interface Section1Props {
  text: string;
}

export default function Section2({ text }: Section1Props) {

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

                paddingTop: isMobile ? "16px" : "24px",
                paddingRight: isMobile ? "16px" : "64px",
                paddingBottom: isMobile ? "16px" : "32px",
                paddingLeft: isMobile ? "16px" : "64px",

                display: "flex",
                alignItems: "flex-end",

                background:
                  "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
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

                    color: "#ffffff",
                    textAlign: "left",
                  }}
                >
                  About Us
                </h2>

                {!isMobile && (
                  <div
                    style={{
                      margin: 0,
                      padding: 0,
                      marginBottom: "16px",

                      fontSize: "14px",
                      lineHeight: "1.5",

                      color: "#ffffff",
                      textAlign: "left",
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
                    href="/legacy/about-us"
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