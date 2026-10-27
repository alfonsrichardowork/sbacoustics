"use client";

import { useState } from "react";
import Image from "next/image";

type LazyImageClickableProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  testid?: string;
};

export default function LazyImageClickableOld({
  src,
  alt,
  width,
  height,
  testid,
}: LazyImageClickableProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            width: "100%",
            height: "100%",
            backgroundColor: "#e5e7eb",
          }}
        />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        data-testid={testid}
        loading="eager"
        onLoad={() => setIsLoading(false)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}