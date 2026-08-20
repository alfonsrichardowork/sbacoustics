"use client"

import { useEffect, useState } from "react";

interface BrandChoiceProps {
  text: string;
  url: string
}

export default function BrandChoiceOldClient({ text, url }: BrandChoiceProps) {
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
    display: "grid",
    gridTemplateColumns: isMobile ? "" : "3fr 2fr",
  }}
>
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      height: "50vh",
    }}
  >

    <div
      style={{
        position: "relative",
        width: "100%",
        height: "50vh",
        display: "flex",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={
          url.startsWith(
            "/uploads/"
          )
            ? `${process.env.NEXT_PUBLIC_ROOT_URL}${url}`
            : url
        }
        alt="SB Audience"
        width="1000"
        height="1000"
        fetchPriority="high"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "33.333%",
          height: "100%",
          background:
            "linear-gradient(to left, #18181b, transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          boxSizing: "border-box",
          padding: isMobile ? "0 16px 16px" : "0 64px 32px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              paddingBottom: "16px",
            }}
          >
            <img
              src="/images/sbacoustics/logo_sbaudience.png"
              alt="SB Audience Logo"
              width="500"
              height="500"
              fetchPriority="high"
              style={{
                display: "block",
                width: "50%",
                maxWidth: "250px",
                height: "auto",
              }}
            />
          </div>

          <div
            style={{
              paddingBottom: "16px",
            }}
          >
            <a
              href="/sbaudience"
              style={{
                display: "inline-block",
                boxSizing: "border-box",
                padding: "8px 16px",
                color: "#ffffff",
                backgroundColor: "#e6001b",
                textDecoration: "none",
                fontSize: "14px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
              }}
            >
              Go to pro drivers
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    style={{
      position: "relative",
      display: isMobile ? "none" : "block",
      overflow: "hidden",
      height: "50vh",
      backgroundColor: "#18181b",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "0 64px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "66.667%",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "14px",
            textAlign: "left",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
