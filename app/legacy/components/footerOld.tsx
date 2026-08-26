"use client"

import { usePathname } from 'next/navigation';
import { getHref } from '@/app/(frontend)/utils/getHref';
import { brand, socialmedia } from '@prisma/client';
import getOneBrand from '@/app/(frontend)/actions/get-one-brand';
import { useEffect, useState } from 'react';
import getAllSocialMedia from '@/app/(frontend)/actions/get-all-social-media';
import { SocialIcon } from 'react-social-icons';

export default function FooterOld() {
  const pathname = usePathname()
  const [allSocialMedia, setAllSocialMedia] = useState<socialmedia[]>([])
  const [finalData, setFinalData] = useState<brand>()
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
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
  useEffect(() => {
    const fetchData = async () => {
      const brand: brand = await getOneBrand(pathname);
      setFinalData(brand)
      const allSM: socialmedia[] = await getAllSocialMedia(pathname);
      setAllSocialMedia(allSM)
      setLoading(false) 
    };
  
    fetchData().catch((error) => {
      console.error("Error fetching data: ", error);
    });
    
  }, [pathname]); 
  
  // if (showSettings) {
  //   return <CookieSettings onClose={() => setShowSettings(false)} />
  // }
  return (
    <footer
      style={{
        backgroundColor: "#000",
        color: "#fff",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "48px 64px",
          boxSizing: "border-box",
        }}
      >
        {/* TOP SECTION */}
        <div
          style={{
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "24px",
          }}
        >
          {/* LOGOS */}
          <div
            style={{
              order: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-end",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "200px",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
              }}
            >
              <a
                href={
                  pathname.includes("sbaudience")
                    ? "/legacy/sbaudience"
                    : pathname.includes("sbautomotive")
                    ? "/legacy/sbautomotive"
                    : "/legacy"
                }
              >
                <img
                  src={
                    pathname.includes("sbaudience")
                      ? "/images/sbaudience/logo_sbaudience.png"
                      : pathname.includes("sbautomotive")
                      ? "/images/sbautomotive/logo_sbautomotive_white.png"
                      : "/images/sbacoustics/logo_sbacoustics_white_clean.png"
                  }
                  alt={
                    pathname.includes("sbaudience")
                      ? "SB Audience Logo"
                      : pathname.includes("sbautomotive")
                      ? "SB Automotive Logo"
                      : "SB Acoustics Logo"
                  }
                  width={500}
                  height={500}
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </a>
            </div>

            {/* SB AUDIENCE PAGE */}
            {pathname.includes("sbaudience") ? (
              <div
                style={{
                  width: "100%",
                  maxWidth: "100px",
                  paddingTop: "8px",
                }}
              >
                <a href="/legacy">
                  <img
                    src="/images/sbacoustics/logo_sbacoustics_white_clean.png"
                    alt="SB Acoustics Logo"
                    width={500}
                    height={500}
                    loading="eager"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </a>
              </div>
            ) : pathname.includes("sbautomotive") ? (
              <>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "100px",
                    paddingTop: "8px",
                  }}
                >
                  <a href="/legacy">
                    <img
                      src="/images/sbacoustics/logo_sbacoustics_white_clean.png"
                      alt="SB Acoustics Logo"
                      width={500}
                      height={500}
                      loading="eager"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </a>
                </div>

                <div
                  style={{
                    width: "100%",
                    maxWidth: "100px",
                    paddingTop: "8px",
                  }}
                >
                  <a href="/legacy/sbaudience">
                    <img
                      src="/images/sbaudience/logo_sbaudience.png"
                      alt="SB Audience Logo"
                      width={500}
                      height={500}
                      loading="eager"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </a>
                </div>
              </>
            ) : (
              /* SB ACOUSTICS PAGE */
              <div
                style={{
                  width: "100%",
                  maxWidth: "100px",
                  paddingTop: "8px",
                }}
              >
                <a href="/legacy/sbaudience">
                  <img
                    src="/images/sbaudience/logo_sbaudience.png"
                    alt="SB Audience Logo"
                    width={500}
                    height={500}
                    loading="eager"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </a>
              </div>
            )}
          </div>

          {/* SBE LOGO */}
          <div
            style={{
              marginTop: isMobile ? "40px" : "0px",
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              paddingTop: "0",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "100px",
              }}
            >
              <a
                href="https://sinarbajaelectric.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/sbacoustics/logo SBE-white.png"
                  alt="Sinar Baja Electric Logo"
                  width={500}
                  height={500}
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* CONTACT + NEWSLETTER */}
        <div
          style={{
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "48px",
          }}
        >
          {/* CONTACT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
            }}
          >
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <li style={{ marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Sinar Baja Electric
                </h3>
              </li>

              <li
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: isMobile ? "center" : "flex-start",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {loading ? "..." : finalData && finalData.address}
                </span>
              </li>

              <li
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {loading ? "..." : finalData && finalData.telephone}
                </span>
              </li>

              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {loading ? "..." : finalData && finalData.email}
                </span>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-end",
              paddingTop: "0",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                marginTop: isMobile ? "60px" : '0px',
                fontWeight: 600,
                color: "#e6001b",
              }}
            >
              Newsletter
            </h3>

            <p
              style={{
                fontSize: "14px",
                padding: "16px 0",
                margin: 0,
                textAlign: isMobile ? "center" : "right",
                color: "#fff",
              }}
            >
              Subscribe to the newsletter for the latest updates
            </p>

            <a
              href="/legacy/newsletter"
              style={{
                display: "inline-block",
                backgroundColor: "#e6001b",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                padding: "10px 16px",
                textDecoration: "none",
              }}
            >
              Subscribe
            </a>
          </div>
        </div>

        {/* DIVIDER */}
        <hr
          style={{
            margin: "32px 0",
            border: 0,
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        />

        {/* BOTTOM SECTION */}
        <div
          style={{
            display: isMobile ? "block" : "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          {/* ABOUT */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "12px",
              color: "#9ca3af",
              width: isMobile ? "100%" : "33.333%",
              justifyContent: isMobile ? "center" : "flex-start",
              marginBottom: isMobile ? "12px" : "0px"
            }}
          >
            <a
              href={`/legacy${getHref(pathname, "about")}`}
              style={{
                color: "#9ca3af",
                textDecoration: "none",
              }}
            >
              About Us
            </a>
            <a
              href={`/legacy${getHref(pathname, "catalogues")}`}
              style={{
                color: "#9ca3af",
                textDecoration: "none",
              }}
            >
              Catalogues
            </a>
          </div>

          {/* SOCIAL MEDIA */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              width: isMobile ? "100%" : "33.333%",
              justifyContent: "center",
            }}
          >
            {loading ? (
              "..."
            ) : (
              allSocialMedia &&
              allSocialMedia.length > 0 &&
              allSocialMedia.map((logo, index) => (
                <SocialIcon
                  network={logo.type}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  url={logo.value}
                  key={index}
                  fgColor="#c4c4c4"
                  bgColor="#2e2e2e"
                />
              ))
            )}
          </div>

          {/* COPYRIGHT + LINKS */}
          <div
            style={{
              width: "33.333%",
              display: isMobile ? "none" : "block",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#fff",
                textAlign: "right",
              }}
            >
              © {new Date().getFullYear()}{" "}
              {loading ? "..." : finalData && finalData.name}. All rights
              reserved.
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "16px",
                fontSize: "12px",
                color: "#9ca3af",
                paddingTop: "4px",
                flexWrap: 'wrap'
              }}
            >
              <a
                href="/legacy/privacy"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                }}
              >
                Privacy policy
              </a>

              <button
                onClick={() => setShowSettings(true)}
                style={{
                  color: "#9ca3af",
                  background: "transparent",
                  border: 0,
                  padding: 0,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Cookie settings
              </button>

              <a
                href="/legacy/legal"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                }}
              >
                Terms of use
              </a>
            </div>
          </div>
        </div>

        {/* MOBILE COPYRIGHT */}
        <div
          style={{
            display: isMobile ? "block" : "none",
            fontSize: "12px",
            color: "#fff",
            textAlign: "center",
            width: "100%",
            marginTop: "16px",
          }}
        >
          © {new Date().getFullYear()}{" "}
          {!loading && finalData && finalData.name}. All rights reserved.
        </div>

        {/* MOBILE LINKS */}
        <div
          style={{
            display: isMobile ? "flex" : "none",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px 8px",
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "8px",
          }}
        >
          <a
            href="/legacy/privacy"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Privacy policy
          </a>

          <button
            onClick={() => setShowSettings(true)}
            style={{
              color: "#9ca3af",
              background: "transparent",
              border: 0,
              padding: 0,
              fontSize: "12px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Cookie settings
          </button>

          <a
            href="/legacy/legal"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Terms of use
          </a>
        </div>
      </div>
    </footer>
  )
}