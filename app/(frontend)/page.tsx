import prismadb from '@/lib/prismadb';
import { FeaturedProducts } from './types';
import BrandChoice from './(sbacoustics)/components-homescreen/BrandChoice';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SwiperCarousel from '@/components/swipercarousel';
import { SocialIcon } from 'react-social-icons'

export default async function LandingPageSBAcoustics() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SB Acoustics | Building Your Sound",
    "url": `${baseUrl}`,
    "logo": `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
    "sameAs": [
      "https://www.instagram.com/sbacoustics/",
      "https://www.facebook.com/sbacoustics/",
    ]
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative">
        <h1 className='sr-only'>Welcome to SB Acoustics Official Website!</h1>
        <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
          <div className="top-0 left-0 w-full z-10">
            <SwiperCarousel slides={allFeaturedProducts} brand='sbacoustics'/>
          </div>
        </div>

       <div className="relative min-h-screen">
          <BrandChoice />
        </div>
        {brandImages.homepage_open_source_kits_url !== '' &&
          <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full object-cover bg-white">
              <div className="relative w-full h-screen">
                <img
                    src={brandImages.homepage_open_source_kits_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_open_source_kits_url}` : brandImages.homepage_open_source_kits_url} alt={"SB Acoustics Open Source Kits"} className='w-full h-full object-cover' />
              </div>
            </div>
          </div>
        }
      

        <div className="relative min-h-screen">
          {brandImages.homepage_open_source_kits_url !== '' &&
            <div className="xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 pt-4 flex items-end z-50 text-black bg-linear-to-l from-white/70 via-white/60 to-white/0 w-full">
              <div className="grid gap-0 grid-cols-1 w-fit">
                <h2 className="text-left font-bold xl:text-5xl text-3xl pb-4">
                  Open Source Kits
                </h2>
                <div className="text-left text-sm pb-4 hidden md:block">
                  {brandImages.homepage_open_source_kits_text}
                </div>
                <div className="items-start pb-4">
                  <Button asChild size="sm">
                    <Link href="/kits/open-source-kits">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          }

          {brandImages.homepage_about_us_url !== '' &&
            <div className="relative min-h-screen">
              <div className="relative w-full h-[calc(100vh)]">
              <img
                src={brandImages.homepage_about_us_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_about_us_url}` : brandImages.homepage_about_us_url}
                alt='Sinar Baja Electric Facility'
                width={1920}
                height={1080}
                className="object-cover w-full h-full grayscale-75"
              />  
              <div className="absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end bg-linear-to-t from-black to-transparent w-full">
              <div className="grid gap-0 grid-cols-1 w-fit">
                      <h2 className="text-left font-bold xl:text-5xl text-3xl pb-4 text-white">About Us</h2>
                      <div className="text-left text-sm text-white pb-4 hidden md:block">
                        {brandImages.homepage_about_us_text}
                      </div>
                      <div className="items-start pb-4">
                        <Button size={"sm"} asChild>
                          <Link href={'/aboutus'}>
                            Learn More
                          </Link>
                        </Button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

          {brandImages.homepage_catalogues_url !== '' && 
            <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full object-cover bg-white">
                <div className="relative w-full h-screen">
                  <img src={brandImages.homepage_catalogues_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_catalogues_url}` : brandImages.homepage_catalogues_url} alt={"SB Acoustics Catalogues"} className='w-full h-full object-cover' />
                </div>
              </div>
            </div>
          }
          <div className="relative">
            <div className="xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 pt-4 flex items-end z-50 text-black bg-linear-to-tl from-white/70 via-white/60 to-white/0 w-full">
              {brandImages.homepage_catalogues_url !== '' && 
                <div className="grid gap-0 grid-cols-1 w-fit">
                  <h2 className="text-left font-bold xl:text-5xl text-3xl pb-4">
                    Catalogues
                  </h2>
                  <div className="text-left text-sm pb-4 hidden md:block">
                    {brandImages.homepage_catalogues_text}
                  </div>
                  <div className="items-start pb-4">
                    <Button size={"sm"} asChild>
                      <Link href={'/catalogues'}>
                        View Catalogues
                      </Link>
                    </Button>
                  </div>
                </div>
              }
            </div>
            {brandImages.socialmedia.length > 0 &&
              <div className='xl:h-96 lg:h-80 md:h-72 sm:h-72 h-60 w-full flex flex-col justify-center items-start xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 bg-white'>
                <h2 className="text-left font-bold xl:text-5xl text-3xl text-black py-4">
                  Social:
                </h2>
                <div className='md:flex hidden md:justify-start pb-4 gap-2 w-full'>
                  {brandImages.socialmedia.map((logo, index) => (
                      <SocialIcon network={logo.type} style={{ width: 80, height: 80 }} url={logo.value} key={index}/>
                    ))
                  }
                </div>
                <div className='md:hidden flex justify-start pb-4 gap-2 w-full'>
                  {brandImages.socialmedia.map((logo, index) => (
                      <SocialIcon network={logo.type} style={{ width: 48, height: 48 }} url={logo.value} key={index}/>
                    ))
                  }
                </div>
              </div>
            }
        </div>
      </div>
    </>
  );
}
