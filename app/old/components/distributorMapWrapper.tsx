"use client";

import dynamic from "next/dynamic";
import { distributors } from "@prisma/client";

interface DistributorProps {
  asianDistributors: distributors[];
  europeDistributors: distributors[];
  americaDistributors: distributors[];
  oceaniaDistributors: distributors[];
  africaDistributors: distributors[];
  antarticaDistributors: distributors[];
}

const DistributorMap = dynamic(
  () => import("../components/MapComponent").then((mod) => ({ default: mod.DistributorMap })),
  {
    ssr: false,
    loading: () => (
      <>
          <div
            style={{
              marginTop: "24px",
              width: "100vw",
              height: "400px",
              backgroundColor: "#d4d4d8",
            }}
          />

          <div
            style={{
              paddingTop: "64px",
              paddingBottom: "64px",
              paddingLeft: "32px",
              paddingRight: "32px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Our Distributors
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "50%",
                    boxSizing: "border-box",
                    padding: "8px",
                    display: "flex",
                    justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "500px",
                      backgroundColor: "#d4d4d8",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
      </>
    ),
  }
);

export function DistributorMapWrapper(props: DistributorProps) {
  return <DistributorMap {...props} />;
}