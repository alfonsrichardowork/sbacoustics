import prismadb from '@/lib/prismadb';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SwiperCarousel from '@/components/swipercarousel';
import { SocialIcon } from 'react-social-icons'
import { FeaturedProducts } from '../types';
import BrandChoice from './components-homescreen/BrandChoice';
import SwiperCarouselSBAutomotive from '@/components/swipercarouselsbautomotive';

export const revalidate = 3600;

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

  const [productsResult, brandImagesResult] = await Promise.allSettled([
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
        <h1 className='sr-only'>Welcome to SB Automotive Official Website!</h1>
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


        <div className="relative min-h-screen">
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



          {brandImages.homepage_open_source_kits_url !== '' &&
            <div className="relative min-h-screen">
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
                  TPCD TeXtreme&reg; Cone
                </h2>

                <Button size="lg" disabled>
                  Technology
                </Button>
              </div>
            </div>
          </div>
        </div>
      }


   
          {brandImages.homepage_catalogues_url !== '' &&
            <div className="relative min-h-screen">
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
                        <Button size="lg" disabled>
                          Discover
                        </Button> 
                      </div>
                  </div>
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
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />  
              <div className="absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end bg-linear-to-t from-black to-transparent w-full">
              <div className="grid gap-0 grid-cols-1 w-fit">
                      <h2 className="text-left font-bold xl:text-5xl text-3xl pb-4 text-white">About Us</h2>
                      <div className="text-left text-sm text-white pb-4 hidden md:block">
                        {brandImages.homepage_about_us_text}
                      </div>
                      <div className="items-start pb-4">
                        {/* <Button size={"sm"} asChild>
                          <Link href={'/about'}>
                            Learn More
                          </Link>
                        </Button> */}
                        <Button size="lg" disabled>
                          Learn More 
                        </Button> 
                      </div>
                  </div>
                </div>
              </div>
            </div>
          }
        {/* </div> */}

      </div>
    </>
  );
}





















// import prismadb from '@/lib/prismadb';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import SwiperCarousel from '@/components/swipercarousel';
// import { SocialIcon } from 'react-social-icons'
// import { FeaturedProducts } from '../types';
// import BrandChoice from './components-homescreen/BrandChoice';

// export const revalidate = 3600;

// export default async function LandingPageSBAutomotive() {
//   const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
  
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     "name": "SB Automotive | Beyond Sound",
//     "url": `${baseUrl}`,
//     "logo": `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`,
//     // "sameAs": [
//     //   "https://www.instagram.com/sbacoustics/",
//     //   "https://www.facebook.com/sbacoustics/",
//     // ]
//   };

//   const [productsResult, brandImagesResult] = await Promise.allSettled([
//       await prismadb.product.findMany({
//       where: {
//         brandId: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID,
//         isFeatured: true,
//         isArchived: false,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//         featured_img_url: true,
//         featuredDesc: true
//       }
//     }),
//     await prismadb.brand.findFirst({
//       where: {
//         id: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID
//       },
//       select: {
//         homepage_open_source_kits_url: true,
//         homepage_about_us_url: true,
//         homepage_catalogues_url: true,
//         homepage_open_source_kits_text: true,
//         homepage_about_us_text: true,
//         homepage_catalogues_text: true,
//         socialmedia: true
//       }
//     })
//   ])

//   const products = productsResult.status === 'fulfilled' ? productsResult.value : null
//   const brandImages = brandImagesResult.status === 'fulfilled' ? brandImagesResult.value : null
  

//   let allFeaturedProducts: Array<FeaturedProducts> = []
//   if(products){
//     products.map((val) => {
//       if(val.featured_img_url !== '') {
//         let product: FeaturedProducts = {
//           id: val.id,
//           name: val.name,
//           slug: val.slug,
//           featuredImgUrl: val.featured_img_url,
//           featuredDesc: val.featuredDesc
//         }
//         allFeaturedProducts.push(product)
//       }
//     })
//   }


//   if(!brandImages) {
//     return null
//   }
  
//   return (
//     <>      
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
//       <div className="relative">
//         <h1 className='sr-only'>Welcome to SB Automotive Official Website!</h1>
//         <div className="sticky top-0 w-full h-dvh flex items-center justify-center">
//           <div className="top-0 left-0 w-full z-10">
//             {/* <SwiperCarousel slides={allFeaturedProducts} brand='sbautomotive'/> */}
//             <div className="relative w-full min-h-dvh h-dvh">
//               <video
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//                 preload="auto"
//                 poster="/images/sbautomotive/placeholder.jpg"
//                 className='w-full h-full object-cover'
//               >
//                 <source src="/images/sbautomotive/test.webm" type="video/webm" />
//                 <source src="/images/sbautomotive/test.mp4" type="video/mp4" />
//               </video>
//               <div className={`absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end bg-gradient-to-t from-black to-transparent`}>
//                 <div className="grid gap-0 grid-cols-1 w-fit">
//                   <h3 className="text-left font-bold xl:text-5xl text-3xl text-white pb-4 lg:text-white">
//                     Name
//                   </h3>
//                   <div className="text-left text-sm text-white pb-4 hidden md:block lg:text-white">
//                     Desc
//                   </div>
//                   <div className="items-start pb-5">
//                     <Button size="sm" disabled>
//                       Product Page  
//                     </Button> 
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//        <div className="relative h-[50vh]">
//           <BrandChoice />
//         </div>
//         {brandImages.homepage_open_source_kits_url !== '' &&
//           <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
//             <div className="absolute top-0 left-0 w-full h-full object-cover bg-white">
//               <div className="relative w-full h-screen">
//                 <img
//                     src={brandImages.homepage_open_source_kits_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_open_source_kits_url}` : brandImages.homepage_open_source_kits_url} alt={"SB Automotive Open Source Kits"} className='w-full h-full object-cover' />
//               </div>
//             </div>
//           </div>
//         }
      

//         <div className="relative min-h-screen">
//           {brandImages.homepage_open_source_kits_url !== '' &&
//             <div className="xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 pt-4 flex items-end z-50 text-black bg-linear-to-l from-white/70 via-white/60 to-white/0 w-full">
//               <div className="grid gap-0 grid-cols-1 w-fit">
//                 <h2 className="text-left font-bold xl:text-5xl text-3xl pb-4">
//                   Open Source Kits
//                 </h2>
//                 <div className="text-left text-sm pb-4 hidden md:block">
//                   {brandImages.homepage_open_source_kits_text}
//                 </div>
//                 <div className="items-start pb-4">
//                   {/* <Button asChild size="sm">
//                     <Link href="/kits/open-source-kits">Learn More</Link>
//                   </Button> */}
//                   <Button size="sm" disabled>
//                     Learn More 
//                   </Button> 
//                 </div>
//               </div>
//             </div>
//           }

//           {brandImages.homepage_about_us_url !== '' &&
//             <div className="relative min-h-screen">
//               <div className="relative w-full h-[calc(100vh)]">
//               <img
//                 src={brandImages.homepage_about_us_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_about_us_url}` : brandImages.homepage_about_us_url}
//                 alt='Sinar Baja Electric Facility'
//                 width={1000}
//                 height={1000}
//                 className="object-cover w-full h-full"
//               />  
//               <div className="absolute inset-x-0 bottom-0 xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 h-fit flex items-end bg-linear-to-t from-black to-transparent w-full">
//               <div className="grid gap-0 grid-cols-1 w-fit">
//                       <h2 className="text-left font-bold xl:text-5xl text-3xl pb-4 text-white">About Us</h2>
//                       <div className="text-left text-sm text-white pb-4 hidden md:block">
//                         {brandImages.homepage_about_us_text}
//                       </div>
//                       <div className="items-start pb-4">
//                         {/* <Button size={"sm"} asChild>
//                           <Link href={'/about'}>
//                             Learn More
//                           </Link>
//                         </Button> */}
//                         <Button size="sm" disabled>
//                           Learn More 
//                         </Button> 
//                       </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           }
//         </div>

//           {brandImages.homepage_catalogues_url !== '' && 
//             <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center">
//               <div className="absolute top-0 left-0 w-full h-full object-cover bg-white">
//                 <div className="relative w-full h-screen">
//                   <img src={brandImages.homepage_catalogues_url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImages.homepage_catalogues_url}` : brandImages.homepage_catalogues_url} alt={"SB Automotive Catalogues"} className='w-full h-full object-cover' />
//                 </div>
//               </div>
//             </div>
//           }
//           <div className="relative">
//             <div className="xl:px-16 xl:pb-8 lg:px-12 lg:pb-6 px-8 pb-4 pt-4 flex items-end z-50 text-black bg-linear-to-tl from-white/70 via-white/60 to-white/0 w-full">
//               {brandImages.homepage_catalogues_url !== '' && 
//                 <div className="grid gap-0 grid-cols-1 w-fit">
//                   <h2 className="text-left font-bold xl:text-5xl text-3xl pb-4">
//                     Catalogues
//                   </h2>
//                   <div className="text-left text-sm pb-4 hidden md:block">
//                     {brandImages.homepage_catalogues_text}
//                   </div>
//                   <div className="items-start pb-4">
//                     {/* <Button size={"sm"} asChild>
//                       <Link href={'/catalogues'}>
//                         View Catalogues
//                       </Link>
//                     </Button> */}
//                     <Button size="sm" disabled>
//                       View Catalogues
//                     </Button> 
//                   </div>
//                 </div>
//               }
//             </div>
//             {brandImages.socialmedia.length > 0 &&
//               <div className='xl:h-96 lg:h-80 md:h-72 sm:h-72 h-60 w-full flex flex-col justify-center items-start xl:px-16 xl:py-8 lg:px-12 lg:py-6 px-8 py-4 bg-white'>
//                 <h2 className="text-left font-bold xl:text-5xl text-3xl text-black py-4">
//                   Social:
//                 </h2>
//                 <div className='md:flex hidden md:justify-start pb-4 gap-2 w-full'>
//                   {brandImages.socialmedia.map((logo, index) => (
//                       <SocialIcon network={logo.type} style={{ width: 80, height: 80 }} url={logo.value} key={index}/>
//                     ))
//                   }
//                 </div>
//                 <div className='md:hidden flex justify-start pb-4 gap-2 w-full'>
//                   {brandImages.socialmedia.map((logo, index) => (
//                       <SocialIcon network={logo.type} style={{ width: 48, height: 48 }} url={logo.value} key={index}/>
//                     ))
//                   }
//                 </div>
//               </div>
//             }
//         </div>
//       </div>
//     </>
//   );
// }
