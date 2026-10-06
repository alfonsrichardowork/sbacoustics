import prismadb from '@/lib/prismadb';
import { Button } from '@/components/ui/button';
import { FeaturedProducts } from '../types';
import BrandChoice from './components-homescreen/BrandChoice';
import SwiperCarouselSBAutomotive from '@/components/swipercarouselsbautomotive';
import { cacheLife } from 'next/cache';
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import GoogleCaptchaWrapper from '@/components/GoogleCaptchaWrapper';
import Contact from '@/components/contact';
import { extractIframeSrc } from '@/lib/iframesrc';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import Link from 'next/link';
import { tempproducts } from '@/lib/sbautomotive-data';



async function getSBAutomotiveLandingPageData(){
  'use cache'
  cacheLife('minutes')
  const [productsResult, brandImagesResult, brandResult] = await Promise.allSettled([
      await prismadb.product.findMany({
      where: {
        brandId: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID,
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
        id: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID
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
    }),
    await prismadb.brand.findFirst({
      where: {
        id: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID
      }
    })
  ])
  return [productsResult, brandImagesResult, brandResult] as const;
}

export default async function LandingPageSBAutomotive() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SB Automotive | Beyond Sound",
    "url": `${baseUrl}`,
    "logo": `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`,
    // "sameAs": [
    //   "https://www.instagram.com/sbacoustics/",
    //   "https://www.facebook.com/sbacoustics/",
    // ]
  };

  const [productsResult, brandImagesResult, brandResult] = await getSBAutomotiveLandingPageData();


  const brand = brandResult.status === 'fulfilled' ? brandResult.value : null
  const products = productsResult.status === 'fulfilled' ? productsResult.value : null
  const brandImages = brandImagesResult.status === 'fulfilled' ? brandImagesResult.value : null
  

  if(!brand) {
    return null
  }
  const extractedSrc = extractIframeSrc(brand.maps) ?? '';
  brand.maps = extractedSrc;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative">
        <h1 className='sr-only'>Welcome to SB Automotive Official Website!</h1>

        
          <div className="relative min-h-screen">
            <div className="relative w-full h-[calc(100vh)]">
            <img
              src={'/images/sbautomotive/homepage_sbautomotive.png'}
              alt='Beyond Sound - SB Automotive'
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="sticky top-0 w-full h-dvh flex items-center justify-center">
          <div className="top-0 left-0 w-full z-10">
            {/* <SwiperCarousel slides={allFeaturedProducts} brand='sbautomotive'/> */}
            <div className="relative w-full min-h-dvh h-dvh">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/images/sbautomotive/placeholder.webp"
                className='w-full h-full object-cover'
              >
                <source src="/images/sbautomotive/test.webm" type="video/webm" />
                <source src="/images/sbautomotive/test.mp4" type="video/mp4" />
              </video>
              <div className={`absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end bg-gradient-to-t from-black to-transparent`}>
                <div className="grid gap-0 grid-cols-1 w-fit">
                  <h3 className="text-left font-bold xl:text-5xl text-3xl text-white pb-4 lg:text-white">
                    Beyond Sound
                  </h3>
                  {/* <div className="text-left text-sm text-white pb-4 hidden md:block lg:text-white">
                    Desc
                  </div> */}
                  <div className="items-start pb-5">
                    <Button size="sm" disabled>
                      Overview  
                    </Button> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[50vh]">
          <BrandChoice />
        </div>


        <div className="relative min-h-screen scroll-mt-20">
          <div className="relative w-full h-[calc(100vh)]">
          <SwiperCarouselSBAutomotive slides={['/images/sbautomotive/1.webp', '/images/sbautomotive/2.webp', '/images/sbautomotive/3.webp']} />
            <div className="absolute z-11 inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end w-full">
              <div className="grid gap-0 grid-cols-1 w-fit">
                <img src="/images/sbautomotive/vexion-logo.webp" alt="Vexion Logo" className='w-1/4 h-auto pb-4' />
                      <div className="text-left text-sm text-white pb-4 hidden md:block w-1/3">
                        VeXion is engineered for those who demand more from in-car sound that volume or spectacle. Developed through Danish Acoustic Engineering Principles, every element works as a unified system to deliver stability, control, and purity under real conditions.
                      </div>
                  </div>
                </div>
        </div>
        </div>


{brandImages.homepage_catalogues_url !== '' &&
            <div id="technology" className="relative min-h-screen scroll-mt-20">
              <div className="relative w-full h-[calc(100vh)]">
              <img
                src={brandImages.homepage_catalogues_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_catalogues_url}` : brandImages.homepage_catalogues_url}
                alt='Sinar Baja Electric Facility'
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />  
              <div className="absolute inset-x-0 top-0 xl:px-16 xl:pt-16 lg:px-12 lg:pt-12 px-8 pt-8 h-fit block items-end w-full">
                <img src={'/images/sbautomotive/ADVANCED.webp'} alt='advanced' className='pb-2 w-auto h-12 object-contain'/>
                <img src={'/images/sbautomotive/ENGINEERING.webp'} alt='ENGINEERING' className='w-auto h-14 object-contain'/>
              </div>
              <div className="absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end w-full">
              <div className="grid gap-0 grid-cols-1 w-fit">
                      <div className="text-left text-sm text-black pb-4 hidden md:block w-1/4">
                        SB Automotive created VeXion to bring true high-fidelity into the cabin-fast transients, low distortion, and tonal accuracy. This result a driver line that feels efforless, precise, and unmistakably buillt for those who refuse compromise.
                      </div>
                      <div className="items-start pb-4">
                        {/* <Button size={"sm"} asChild>
                          <Link href={'/about'}>
                            Learn More
                          </Link>
                        </Button> */}
                        {/* <Button size="lg" disabled>
                          Discover
                        </Button>  */}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          }


          {brandImages.homepage_open_source_kits_url !== '' &&
            <div id="product" className="relative min-h-screen">
              <div className="relative w-full h-[calc(100vh)]">
              <img
                src={brandImages.homepage_open_source_kits_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_open_source_kits_url}` : brandImages.homepage_open_source_kits_url}
                alt='TPCD TXtreme Cone'
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />  
              <div className="absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end w-full">
              <div className="flex items-center justify-between w-full">
                <h2 className="font-bold xl:text-5xl text-3xl pb-4 text-black">
                  {/* TPCD TeXtreme&reg; Cone */}
                  VeXion Series
                </h2>

                {/* <Button size="lg" disabled>
                  Technology
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      }


     {tempproducts.map((val, index) => (
      <div key={val.slug} className="relative min-h-screen">
        <div className="relative w-full h-screen">
          <img
            src={`/images/sbautomotive/${val.slug}/homepage.png`}
            alt={`${val.slug} hero`}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />

          <div
            className={`absolute inset-0 flex items-center px-8 py-4 lg:px-12 xl:px-16 ${
              index % 2 !== 0 ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col items-start">
              <img
                src={`/images/sbautomotive/${val.slug}/logo_white.png`}
                alt={`${val.slug} logo`}
                width={500}
                height={500}
              />

              <div className="text-sm text-white py-4">
                {val.desc}
              </div>

              <Button size="lg" asChild disabled>
                <Link href={`/sbautomotive/products/${val.slug}`}>
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    ))}


        {/* <div className="relative min-h-screen">
            <div className="relative w-full h-[calc(100vh)]">
              <img
                src={brandImages.homepage_open_source_kits_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_open_source_kits_url}` : brandImages.homepage_open_source_kits_url}
                alt='TPCD TXtreme Cone'
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />  
              <div className="absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end w-full">
              <div className="flex items-center justify-between w-full">
                <h2 className="font-bold xl:text-5xl text-3xl pb-4 text-black">
                  VeXion Series
                </h2>

                <Button size="lg" disabled>
                  Technology
                </Button>
              </div>
            </div>
          </div>
        </div> */}

  

        <div id='contact' className='bg-black'>
          <div className="relative pb-[420px]"> {/* Added padding bottom */}
            <div className="absolute inset-0 z-0">
              {brand && brand.cover != "" ?
                <>
                  <img 
                      src={brand.cover.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brand.cover}` : brand.cover } 
                      alt="Sinar Baja Electric Facility" 
                      width={750} 
                      height={750} 
                      className="w-screen h-[600px] object-cover object-center"
                      loading="eager"
                  />
                  <div className="absolute inset-0 h-[600px] bg-gradient-to-b from-transparent via-transparent to-black" />
                </>
                :
                <Empty className='w-screen min-h-[600px] z-10 bg-foreground/20'>
                  <EmptyMedia variant="icon">
                    <ImageOff />
                  </EmptyMedia>
                  <EmptyContent>
                    <EmptyTitle>No Cover Image Available</EmptyTitle>
                    <EmptyDescription></EmptyDescription>
                  </EmptyContent>
                </Empty>
              }
            </div>
            <div className="relative z-10 top-96">
              <GoogleCaptchaWrapper>
                <Contact oneBrand={brand}/>
              </GoogleCaptchaWrapper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
