import Link from "next/link";

import "@/app/css/styles.scss";

import SpecificationTable from "@/components/single-product-page/spec-table";
import SwiperCarouselKitsFinishing from "@/components/single-product-page/swipercarouselkitsfinishing";
import { Dot } from "lucide-react";
import { LightboxOneProduct } from "@/components/drawingOneProduct";
import React, { Suspense } from "react";
import prismadb from "@/lib/prismadb";
import { AllCategory, ChildSpecificationProp, SpecificationProp } from "@/app/(frontend)/types";
import SwiperCarouselOneProductSkeleton from "@/components/single-product-page/swipercarouselcoverandcataloguesskeleton";
import { LazyImageCustomNavbar } from "@/components/lazyImageCustomNavbar";
import SwiperCarouselSimilarProductLoading from "@/components/single-product-page/swipercarouselsimilarproductloading";
import SwiperCarouselOneProductLoading from "@/components/single-product-page/swipercarouseloneproductloading";
import { cacheLife } from "next/cache";
import { ProductSkeleton } from "@/components/productskeleton";
import { Dompurifyclient } from "@/components/dompurify-content";
import { tempproducts } from "@/lib/sbautomotive-data";

const all_desc_style = "text-left xl:text-base sm:text-sm text-xs text-black p-0 py-1"
const all_sub_title_style = "text-left font-bold xl:text-2xl lg:text-xl md:text-lg sm:text-md text-black"

type Props = {
  params: Promise<{ productSlug?: string }>
}

// export async function generateStaticParams(){
//   const products = await prismadb.product.findMany({
//     where: {
//       brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
//       isArchived: false,
//     },
//     select: {
//       slug: true,
//     },
//     take: 5
//   });
//   return products.map((product: { slug: string }) => ({
//     productSlug: product.slug
//   }));
// }


// async function getOneDriverData(productSlug: string){
//     'use cache'
//     cacheLife('minutes')
//     const product = await prismadb.product.findFirst({
//         where: {
//         slug: productSlug,
//         brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
//         isArchived: false
//         },
//         select: {
//             id: true,
//             name: true,
//             slug: true,
//             description: true,
//             cover_img_url: true,
//             drawing_img_url: true,
//             graph_img_url: true,
//             isKits: true,
//             willHaveFRD: true,
//             allCat: {
//                 select: {
//                     id: true,
//                     category: {
//                         select: {
//                             singularname: true,
//                             slug: true,
//                             type: true
//                         }
//                     }
//                 }
//             },
//             images_catalogues: {
//                 select: {
//                     name: true,
//                     url: true
//                 },
//                 orderBy: {
//                     name: 'asc'
//                 }
//             },
//             kitsFinishing: {
//                 where: {
//                     url: {
//                         not: ''
//                     }
//                 },
//                 select: {
//                     url: true,
//                     order: true,
//                     finishing: {
//                         select: {
//                             name: true,
//                             url: true,
//                         }
//                     }
//                 },
//                 orderBy: {
//                     order: 'asc'
//                 }
//             },
//             similarProducts: {
//                 select: {
//                     similarProduct: {
//                         select: {
//                             name: true,
//                             slug: true,
//                             cover_img_url: true,
//                         }
//                     }
//                 },
//                 orderBy: {
//                     similarProduct: {
//                         name: 'asc'
//                     }
//                 }
//             },
//             productsKits: {
//                 select: {
//                     productUsedInKits: {
//                         select: {
//                             name: true,
//                             slug: true,
//                         }
//                     }
//                 },
//                 orderBy: {
//                     productUsedInKits: {
//                         name: 'asc'
//                     }
//                 }
//             },
//             multipleDatasheetProduct: {
//                 select: {
//                     url: true,
//                     name: true,
//                 },
//                 orderBy: {
//                     name: 'asc'
//                 }
//             },
//             multipleFRDZMAFiles: {
//                 select: {
//                     url: true,
//                     name: true,
//                 },
//                 orderBy: {
//                     name: 'asc'
//                 }
//             },
//             multiple3DModels: {
//                 select: {
//                     url: true,
//                     name: true,
//                 },
//                 orderBy: {
//                     name: 'asc'
//                 }
//             },
//             size: {
//                 select: {
//                     name: true,
//                     value: true,
//                 }
//             },
//             connectorSpecifications: {
//                 select: {
//                     value: true,
//                     notes: true,
//                     dynamicspecification: {
//                         select: {
//                             name: true,
//                             slug: true,
//                             unit: true,
//                             priority: true,
//                         }
//                     },
//                     dynamicspecificationParent: {
//                         select: {
//                             name: true,
//                             slug: true,
//                             priority: true,
//                         }
//                     },
//                     dynamicspecificationSubParent: {
//                         select: {
//                             name: true,
//                             slug: true,
//                             priority: true,
//                         }
//                     }
//                 }
//             }
//         }
//     });
//     return product;
// }

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  )
}

async function ProductContent({ params }: Props) {
  const { productSlug = "" } = await params
  return <SingleProductSBAutomotive productSlug={productSlug} />
}

async function SingleProductSBAutomotive({ productSlug }: { productSlug: string }) {
    const val = tempproducts.find((val) => val.slug == productSlug)
    if(!val) {
        return null
    }
    
    return (
        <>
            <div className="relative min-h-screen">
                <img
                    src={`/images/sbautomotive/${val.slug}/hero.png`}
                    alt={`${val.slug} hero`}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                />

                <div
                    className={`absolute inset-0 flex items-center px-8 py-4 lg:px-12 xl:px-16 justify-start`}
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
                    </div>
                </div>
            </div>

            <div
                className={`block bg-zinc-100 items-center px-8 py-16 lg:px-24 xl:px-32 justify-center w-full h-full`}
            >
                <div className="mb-8 flex items-center justify-center">
                    <img
                        src={`/images/sbautomotive/${val.slug}/logo_black.png`}
                        alt={`${val.slug} logo`}
                        width={500}
                        height={500}
                    />
                </div>
                    {val.fulldesc.map((singledesc, idx) => 
                        <div key={idx} className="pt-4 text-center flex">
                            {singledesc}
                        </div>
                    )}
            </div>

            <div className="grid md:grid-cols-5 w-full h-full">
                {val.specdesc.map((singledesc, idx) => 
                    <div key={idx} className={`text-center items-center justify-center py-16 px-12 flex font-semibold ${idx % 2 === 0 ? 'bg-zinc-200' : 'bg-zinc-300'}`}>
                        {singledesc}
                    </div>
                )}
            </div>

            <img
                src={`/images/sbautomotive/${val.slug}/spec.png`}
                alt={`${val.slug} specs`}
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
            />
            
            <div className="bg-zinc-100 w-full h-full block py-16">
                <div className="flex justify-center text-center items-center text-3xl font-light tracking-widest w-full p-4">SPECIFICATION</div>
                <div
                    className="md:grid md:grid-cols-2 block bg-zinc-100 items-start 2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4 justify-center w-full gap-16 h-full"
                    >
                    <div>
                        <img
                        src={`/images/sbautomotive/${val.slug}/drawing.png`}
                        alt={`${val.slug} drawing`}
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full pr-42"
                        />
                    </div>

                    <div className="justify-start">
                        <img
                        src={`/images/sbautomotive/${val.slug}/fullspec.png`}
                        alt={`${val.slug} specs`}
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full"
                        />

                        <img
                        src={`/images/sbautomotive/${val.slug}/frequency.png`}
                        alt={`${val.slug} frequency response`}
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full pt-16"
                        />
                    </div>
                    </div>
            </div>
        </>
    );
}