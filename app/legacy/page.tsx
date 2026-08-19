import SwiperCarouselOld from "./components/swipercarouselold";
import prismadb from "@/lib/prismadb";
import { FeaturedProducts } from "../(frontend)/types";
import Section1 from "./components/homepage/section1";
import Section2 from "./components/homepage/section2";
import Section3 from "./components/homepage/section3";
import Section4 from "./components/homepage/section4";
import BrandChoiceOld from "./components/homepage/BrandChoiceOld";


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
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
          }}
        >
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
          </div>
        </div>

        <Section1 text={brandImages.homepage_open_source_kits_text}/>
      </div>
    )}

    <div
      style={{
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {brandImages.homepage_about_us_url !== "" && (
        <div
          style={{
            position: "relative",
            minHeight: "100vh",
          }}
        >
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

            <Section2 text={brandImages.homepage_about_us_text} />
          </div>
        </div>
      )}
    </div>

    {brandImages.homepage_catalogues_url !== "" && (
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
          }}
        >
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
          </div>
        </div>

        
        <Section3 text={brandImages.homepage_catalogues_text} />
      </div>
    )}

    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {brandImages.socialmedia.length > 0 && (
        <Section4 socialmedia={brandImages.socialmedia}/>
      )}
    </div>
  </div>
</>
  )
}
