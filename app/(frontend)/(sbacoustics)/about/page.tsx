import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import SwiperCarouselAboutUs from "@/components/single-product-page/swipercarouselaboutus";
import DOMPurify from 'isomorphic-dompurify'; 
import prismadb from "@/lib/prismadb";
import "@/app/css/styles.scss";

export default async function AboutUsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `About Us | SB Acoustics`,
    "url": `${baseUrl}/about`,
    "logo": `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
  };

  const allData = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
    },
    select: {
      aboutUsImages: true,
      sbe_desc: true,
      brand_desc: true,
      mission_values_desc: true
    }
  })

  if(!allData) {
    return null
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white">
        <h1 className="sr-only">About Us | SB Acoustics</h1>
      {/* Hero Section */}

      {/* SB Acoustics Section */}
      <section className="md:py-20 py-10 bg-white">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-8 items-center">
              <div className="md:order-1 order-2">
                <div className="md:flex hidden items-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-black">SB Acoustics</h2>
                </div>
                <div className="space-y-6 text-slate-600">
                  <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.brand_desc, {
                    ALLOWED_TAGS: [
                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'target', 'rel', 'class', 'id', 'style'
                    ],
                }) }}></h3>
                  {/* <h3>
                    SB Acoustics was born from the union of two established names in audio: the Danish design engineers of Danesian Audio, whose patented tweeter and subwoofer innovations have shaped some of the industry's most distinctive transducer designs, and Sinar Baja Electric, a vertically integrated manufacturer with over {new Date().getFullYear() - 1981} years of experience crafting exceptional transducers.
                  </h3>
                  <h3>
                    In-house capabilities span tooling, coil winding, diaphragm production, die-cast baskets, stamping, and specialty finishing, among other processes — giving us tight control over quality and consistency from raw material to finished component. Together, we've built a product line that balances outstanding acoustic performance with affordability.
                  </h3> */}
                </div>
              </div>
              <div className="relative md:order-2 order-1">
                <div className="md:hidden flex items-start mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-black">SB Acoustics</div>
                </div>
                {/* <SwiperCarouselAboutUs images={[ 
                  {
                    src: "/images/sbacoustics/aboutus/SB_Acoustics_1.jpg",
                    alt: "SB Acoustics About Us 1"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_2.jpg",
                    alt:"SB Acoustics About Us 2"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_3.jpg",
                    alt:"SB Acoustics About Us 3"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_4.jpg",
                    alt:"SB Acoustics About Us 4"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_5.jpg",
                    alt:"SB Acoustics About Us 5"
                  }
                ]} /> */}
                
                <SwiperCarouselAboutUs
                  images={allData.aboutUsImages
                    .filter((val) => val.type === 'BRAND')
                    .map((val, index) => ({
                      src: val.url,
                      alt: `SB Acoustics About Us ${index + 1}`,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sinar Baja Electric Section */}
      <section className="md:py-20 py-10 bg-zinc-100">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-8 items-center">
              <div>
                <div className="md:hidden flex items-start mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-black">Sinar Baja Electric</div>
                </div>
                
                <SwiperCarouselAboutUs
                  images={allData.aboutUsImages
                    .filter((val) => val.type === 'SBE')
                    .map((val, index) => ({
                      src: val.url,
                      alt: `Sinar Baja Electric About Us ${index + 1}`,
                    }))
                  }
                />
                {/* <SwiperCarouselAboutUs images={[
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_1.jpg",
                    alt:"Sinar Baja Electric About Us 1"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_2.jpg",
                    alt:"Sinar Baja Electric About Us 2"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_3.jpg",
                    alt:"Sinar Baja Electric About Us 3"
                  },
                  {
                    src: "/images/sbacoustics/aboutus/Sinar_baja_electric_4.jpg",
                    alt: "Sinar Baja Electric About Us 4"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_5.jpg",
                    alt:"Sinar Baja Electric About Us 5"
                  }
                ]} /> */}
              </div>
              <div className="order-1 md:order-2">
                <div className="md:flex hidden items-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-black">Sinar Baja Electric</h2>
                </div>
                <div className="space-y-6 text-slate-600">
                  <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.sbe_desc, {
                    ALLOWED_TAGS: [
                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'target', 'rel', 'class', 'id', 'style'
                    ],
                }) }}></h3>
                  {/* <h3>
                    Founded in 1981, we've grown into a leading name in loudspeaker manufacturing, with a reputation for high-quality products that meet the demands of discerning customers worldwide. Four decades of craftsmanship remain the backbone of everything we build.
                  </h3>
                  <h3>
                    As a privately held group, we stay true to our core values of innovation, quality, and customer satisfaction. We are a preferred OEM/ODM supplier for prestigious brands across the lifestyle hi-fi, high-end, automotive, and professional audio sectors.
                  </h3>
                  <h3>
                    We continue to invest in cutting-edge R&D, quality control, and mass production — pushing the boundaries of what's possible in transducer design and manufacturing.
                  </h3> */}
                </div>
                <div className="mt-8">
                  <Button variant={"default"} asChild>
                    <Link href="https://sinarbajaelectric.com/">
                      Learn More About Sinar Baja Electric
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="md:py-20 py-10 bg-white">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Our Mission & Values</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                {/* We dedicate passion and purpose to create and deliver high-valued products, where end user and OEM customer expectation are exceeded */}                  
                <p className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.mission_values_desc, {
                    ALLOWED_TAGS: [
                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'target', 'rel', 'class', 'id', 'style'
                    ],
                }) }}></p>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {allData.aboutUsImages
                .filter((val) => val.type === 'VALUES')
                .map((val, index) => 
                  <Card className="border-none shadow-none bg-zinc-100 rounded-none">
                    <img
                      src={val.url}
                      alt={`SB Acoustics About Us Mission ${index}`}
                      width={500}
                      height={400}
                      className="w-full h-fit object-cover"
                    />
                    <CardContent className="p-8 text-center bg-zinc-100">
                      <h3 className="text-xl font-bold mb-4 text-black">{val.name}</h3>
                      <p className="text-slate-600 leading-relaxed">
                        {val.desc}
                      </p>
                    </CardContent>
                  </Card>
                )
              }
              {/* <Card className="border-none shadow-none bg-zinc-100 rounded-none">
                <img
                  src="/images/sbacoustics/aboutus/Acoustics_excellence.jpg"
                  alt="SB Acoustics About Us Mission 1"
                  width={500}
                  height={400}
                  className="w-full h-fit object-cover"
                />
                <CardContent className="p-8 text-center bg-zinc-100">
                  <h3 className="text-xl font-bold mb-4 text-black">Acoustic Excellence</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Combining innovative Danish design expertise with precision Indonesian manufacturing, to create transducers deliver uncompromised acoustic performance
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-zinc-100 rounded-none">
                <img
                  src="/images/sbacoustics/aboutus/Innovation.jpg"
                  alt="SB Acoustics About Us Mission 2"
                  width={500}
                  height={400}
                  className="w-full h-fit object-cover"
                />
                <CardContent className="p-8 text-center bg-zinc-100">
                  <h3 className="text-xl font-bold mb-4 text-black">Innovation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Over {new Date().getFullYear() - 1981} years of experience in manufacturing, paired with cutting-edge R&D, enables us to continuously advance technology in transducers and manufacturing
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-zinc-100 rounded-none">
                <img
                  src="/images/sbacoustics/aboutus/global_reach.jpg"
                  alt="SB Acoustics About Us Mission 3"
                  width={500}
                  height={400}
                  className="w-full h-fit object-cover"
                />
                <CardContent className="p-8 text-center bg-zinc-100">
                  <h3 className="text-xl font-bold mb-4 text-black">Global Reach</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Serving prestigious brands worldwide across Europe, Australia, Asia, and the United States through our comprehensive distribution network
                  </p>
                  <br/>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
