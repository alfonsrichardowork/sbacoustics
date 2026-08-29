import SwiperCarouselOld from "../components/swipercarouselold";
import prismadb from "@/lib/prismadb";
import BrandChoiceOld from "../components/homepage/BrandChoiceOld";
import { FeaturedProducts } from "@/app/(frontend)/types";
import '../components/style/all-style.css'
import { SocialIcon } from "react-social-icons";


export default async function oldPage() {
const [productsResult, brandImagesResult] = await Promise.allSettled([
      await prismadb.product.findMany({
      where: {
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
        isFeatured: true,
        isArchived: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        featured_img_url: true,
        featuredDesc: true
      }
    }),
    await prismadb.brand.findFirst({
      where: {
        id: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
      },
      select: {
        homepage_open_source_kits_url: true,
        homepage_about_us_url: true,
        homepage_catalogues_url: true,
        homepage_open_source_kits_text: true,
        homepage_about_us_text: true,
        homepage_catalogues_text: true,
        socialmedia: true
      }
    })
  ])

  const products = productsResult.status === 'fulfilled' ? productsResult.value : null
  const brandImages = brandImagesResult.status === 'fulfilled' ? brandImagesResult.value : null
  

  let allFeaturedProducts: Array<FeaturedProducts> = []
  if(products){
    products.map((val) => {
      if(val.featured_img_url !== '') {
        let product: FeaturedProducts = {
          id: val.id,
          name: val.name,
          slug: val.slug,
          featuredImgUrl: val.featured_img_url,
          featuredDesc: val.featuredDesc
        }
        allFeaturedProducts.push(product)
      }
    })
  }


  if(!brandImages) {
    return null
  }

  return (
    <>
  <div
    style={{
      position: "relative",
      width: "100%",
    }}
  >

    <div
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
        }}
      >
        <SwiperCarouselOld slides={allFeaturedProducts} brand='sbacoustics'/>
      </div>
    </div>

    <div
      style={{
        height: "50vh",
      }}
    >
      <BrandChoiceOld />
    </div>

    {brandImages.homepage_open_source_kits_url !== "" && (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        <img
          src={
            brandImages.homepage_open_source_kits_url.startsWith(
              "/uploads/"
            )
              ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_open_source_kits_url}`
              : brandImages.homepage_open_source_kits_url
          }
          alt="SB Acoustics Open Source Kits"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      
        <div className="open-source-kits-parent"
        >
          <div
            style={{
              display: "block",
              width: "fit-content",
            }}
          >
            <h2 className="open-source-kits-title">
              Open Source Kits
            </h2>

              <div className="open-source-kits-text"
              >
                {brandImages.homepage_open_source_kits_text}
              </div>

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
      </div>
    )}

      {brandImages.homepage_about_us_url !== "" && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
          }}
        >
          <img
            src={
              brandImages.homepage_about_us_url.startsWith("/uploads/")
                ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_about_us_url}`
                : brandImages.homepage_about_us_url
            }
            alt="Sinar Baja Electric Facility"
            width={1000}
            height={1000}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <div className="about-us-parent">
            <div
              style={{
                display: "block",
                width: "fit-content",
              }}
            >
              <h2 className="about-us-title">
                About Us
              </h2>
              <div className="about-us-text">
                {brandImages.homepage_about_us_text}
              </div>

              <div
                style={{
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                <a
                  href="/legacy/about"
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
        </div>
      )}

    {brandImages.homepage_catalogues_url !== "" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100vh",
            }}
          >
            <img
              src={
                brandImages.homepage_catalogues_url.startsWith("/uploads/")
                  ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_catalogues_url}`
                  : brandImages.homepage_catalogues_url
              }
              alt="SB Acoustics Catalogues"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />        
            <div className="catalogues-parent">
              <div
                style={{
                  display: "block",
                  width: "fit-content",
                }}
              >
                <h2 className="catalogues-title">
                  Catalogues
                </h2>

                  <div className="catalogues-text"
                  >
                    {brandImages.homepage_catalogues_text}
                  </div>

                <div
                  style={{
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  <a
                    href="/legacy/catalogues"
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
                    View Catalogues
                  </a>
                </div>
              </div>
            </div>
          </div>
        // </div>

        
      // </div>
    )}

    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {brandImages.socialmedia.length > 0 && (
        <div className="social-parent">
          <h2 className="social-title">
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
            {brandImages.socialmedia.map((logo, index) => (
              <SocialIcon
                network={logo.type}
                className="social-icon"
                url={logo.value}
                key={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</>
  )
}
