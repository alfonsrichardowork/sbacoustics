import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import SwiperCarouselAboutUs from "@/components/single-product-page/swipercarouselaboutus";
import DOMPurify from 'isomorphic-dompurify';
import prismadb from "@/lib/prismadb";
import "@/app/css/styles.scss";
import { cacheLife } from "next/cache";
import { Suspense } from "react";


async function getAboutUsData(){
  // 'use cache'
  // cacheLife('minutes')
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
  return allData;
}

export default async function AboutUsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `About Us | SB Acoustics`,
    "url": `${baseUrl}/about`,
    "logo": `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
  };

  const allData = await getAboutUsData();

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

      <section className="md:py-20 py-10 bg-white">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-8 items-center">
              <div className="md:order-1 order-2">
                <div className="md:flex hidden items-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-black">SB Acoustics</h2>
                </div>
                <div className="space-y-6 text-slate-600">
                  <Suspense fallback={<></>}>
                    <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.brand_desc, {
                      ALLOWED_TAGS: [
                          'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                      ],
                      ALLOWED_ATTR: [
                          'href', 'target', 'rel', 'class', 'id', 'style'
                      ],
                  }) }}></h3>
                  </Suspense>
                </div>
              </div>
              <div className="relative md:order-2 order-1">
                <div className="md:hidden flex items-start mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-black">SB Acoustics</div>
                </div>                
                <SwiperCarouselAboutUs
                  images={allData.aboutUsImages
                    .filter((val) => val.type === 'BRAND').sort((a,b) => Number(a.priority) - Number(b.priority))
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
                    .filter((val) => val.type === 'SBE').sort((a,b) => Number(a.priority) - Number(b.priority))
                    .map((val, index) => ({
                      src: val.url,
                      alt: `Sinar Baja Electric About Us ${index + 1}`,
                    }))
                  }
                />
              </div>
              <div className="order-1 md:order-2">
                <div className="md:flex hidden items-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-black">Sinar Baja Electric</h2>
                </div>
                <div className="space-y-6 text-slate-600">
                <Suspense fallback={<></>}>
                  <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.sbe_desc, {
                    ALLOWED_TAGS: [
                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'target', 'rel', 'class', 'id', 'style'
                    ],
                }) }}></h3>
                </Suspense>
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

      <section className="md:py-20 py-10 bg-white">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Our Mission & Values</h2>
              <div className="text-lg text-slate-600 max-w-3xl mx-auto">
                <Suspense fallback={<></>}>
                  <p className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.mission_values_desc, {
                      ALLOWED_TAGS: [
                          'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                      ],
                      ALLOWED_ATTR: [
                          'href', 'target', 'rel', 'class', 'id', 'style'
                      ],
                  }) }}></p>
                </Suspense>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {allData.aboutUsImages
                .filter((val) => val.type === 'VALUES').sort((a,b) => Number(a.priority) - Number(b.priority))
                .map((val, index) => 
                  <Card className="border-none shadow-none bg-zinc-100 rounded-none" key={index}>
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
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
