import getProduct from "@/app/(frontend)/actions/get-one-product";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import SwiperCarouselOneProduct from "@/components/single-product-page/swipercarouseloneproduct";
import SwiperCarouselCoverandCatalogues from "@/components/single-product-page/swipercarouselcoverandcatalogues";
//@ts-ignore
import "@/app/css/styles.scss";
import DOMPurify from 'isomorphic-dompurify'; 

import SwiperCarouselSimilarProduct from "@/components/single-product-page/swipercarouselsimilarproduct";
import SpecificationTable from "@/components/single-product-page/spec-table";
import { LightboxOneProduct } from "@/components/drawingOneProduct";

const all_desc_style = "text-left xl:text-base sm:text-sm text-xs text-foreground p-0 py-1"
const all_sub_title_style = "text-left font-bold xl:text-2xl lg:text-xl md:text-lg sm:text-md text-foreground"

type Props = {
  params: Promise<{ productSlug?: string }>
}

// export const revalidate = 86400

// export async function generateStaticParams(){
//   const brandId = process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
//   const API = `${process.env.NEXT_PUBLIC_ROOT_URL}/${process.env.NEXT_PUBLIC_FETCH_ALL_PRODUCTS}`
//   const API_EDITED_BRANDID = API.replace('{brandId}', brandId ?? '680c5eee-7ed7-41bc-b14b-4185f8a1c379'); //SBAcoustics ID as default
//   const res = await fetch(API_EDITED_BRANDID,
//     { next: { revalidate: 86400 } } // ISR for individual product data
//   );
//   const products = await res.json();
//   return products.map((product: { slug: string }) => ({
//     productSlug: product.slug
//   }));
// }

export default async function SingleProductSBAudience(props: Props) {
    const { productSlug = '' } = await props.params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
    const data = await getProduct("sbaudience", productSlug);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data?.name,
        "description": `Found out more about ${data?.name} from SB Audience!`,
        "image": data?.coverImg ? `${baseUrl}${data.coverImg}` : '',
        "sku": data?.slug || '',
        "brand": {
          "@type": "Brand",
          "name": "SB Audience"
        },
        "url": data?.slug ? `${baseUrl}/sbaudience/products/${data.slug}` : `${baseUrl}/sbaudience`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/sbaudience`
        }
    };

    return (
        <div className="2xl:px-60 xl:px-40 xl:py-8 lg:py-6 lg:px-12 px-8 py-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {data && 
                <>
            <div className="block md:flex">
                {/* Left Column for Images */}
                <div className="md:flex md:w-1/2 justify-center md:h-1/2 block w-full h-full">
                    <div className="flex-col w-full md:flex hidden pr-10">
                        <div className="w-full h-full pb-4">
                            <SwiperCarouselCoverandCatalogues 
                            name={data.name}
                            cover={data.coverImg}
                            image_catalogues={data.images_Catalogues}
                            />
                        </div>
                        {data.drawing !== '' &&
                            <LightboxOneProduct name={data.name} url={data.drawing} type={"drawing"}/>
                        }
                        {data.graph !== '' &&
                            <LightboxOneProduct name={data.name} url={data.graph} type={"graph"}/>
                        }                       
                    </div>
                    <div className="w-full h-full md:hidden pb-4">
                        <SwiperCarouselOneProduct 
                        name={data.name}
                        cover={data.coverImg}
                        image_catalogues={data.images_Catalogues}
                        drawing={data.drawing}
                        graph={data.graph}
                        />
                    </div>
                </div>

                {/* Right Column for Typography */}
                <div className="md:flex md:w-1/2 justify-center md:h-1/2 block w-full h-full">
                    <div className="flex flex-col w-full">
                        <h1 className={all_sub_title_style}>
                            {data.name}
                        </h1>
                        <div className={all_desc_style}>
                            {(data.sub_categories.length !== 0 || data.sub_sub_categories.length !== 0) &&
                                <div className="flex flex-wrap gap-2">
                                    <h2>Categories:</h2> 
                                    {data.sub_categories.length !== 0 &&
                                        data.sub_categories.map((subcategory, index) => (
                                        <React.Fragment key={index}>
                                            <Link
                                            href={`/sbaudience/${data.categories[0]?.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="hover:text-primary"
                                            >
                                            <u>{subcategory.name}</u>
                                            </Link>
                                        </React.Fragment>
                                        ))
                                    }
                                    {data.sub_sub_categories.length !== 0 &&
                                        data.sub_sub_categories.map((subsubcategory, index) => (
                                        <React.Fragment key={index}>
                                            <Link
                                            href={`/sbaudience/${data.categories[0]?.name.toLowerCase().replace(/\s+/g, '-')}/${data.sub_categories[0]?.name.toLowerCase().replace(/\s+/g, '-')}/${subsubcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="hover:text-primary"
                                            >
                                            <u><h3>{subsubcategory.name}</h3></u>
                                            </Link>
                                        </React.Fragment>
                                        ))
                                    }
                                </div>
                            }
                        </div>


                        
                        
                        {data.desc && data.desc != '<p></p>' && data.desc != '' && data.desc != '<></>' &&
                        <>
                            <div className={`${all_sub_title_style} pt-8`}>
                                    <h2>Features:</h2>
                                </div>
                                <h3 className={`${all_desc_style} tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.desc, {
                                    ALLOWED_TAGS: [
                                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                                    ],
                                    ALLOWED_ATTR: [
                                        'href', 'target', 'rel', 'class', 'id', 'style'
                                    ],
                                }) }}>
                                </h3>
                                </>
                            }


                                    
                                {data.datasheet && data.datasheet.length > 0 &&
                                    <>
                                        <h2 className="sr-only">Datasheet:</h2>
                                        {data.datasheet.length===1 && data.datasheet[0]?.url!=''?
                                            <div className="flex justify-start pt-8">
                                                <Link href={data.datasheet[0]?.url ?? '/sbaudience'} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}>
                                                    <div className="pr-2">
                                                        {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                        <Image src={'/images/sbacoustics/PDF-download.webp'} alt="PDF Download" className="h-8 w-fit" width={100} height={100}/>
                                                    </div>
                                                    <h3 className="pl-2">
                                                        {data.datasheet[0]?.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        : data.datasheet[0]?.url!='' &&
                                            <div className="justify-start pt-8">
                                                {data.datasheet && data.datasheet.map((value, index) => (
                                                    value.url!=''&&
                                                        <div key={index} className={`${index !== 0 && 'pt-4'}`}>
                                                                <Link href={value.url} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}> 
                                                                <div className="pr-2">
                                                                {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                                <Image src={'/images/sbacoustics/PDF-download.webp'} alt="PDF Download" className="h-8 w-fit" width={100} height={100}/>
                                                            </div>
                                                            <h3 className="pl-2">
                                                                {data.datasheet[index]?.name}
                                                            </h3>
                                                            </Link>
                                                        </div>
                                                ))}
                                            </div>                
                                        }
                                    </>
                                }


                                {data.frdzma && data.frdzma.length > 0 &&
                                    <>
                                        <h2 className="sr-only">FRD & ZMA Files:</h2>
                                        {
                                        data.frdzma.length===1 && data.frdzma[0]?.url!=''?
                                            <div className="flex justify-start pt-4">
                                                <Link href={data.frdzma[0]?.url ?? '/sbaudience'} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}>
                                                    <div className="pr-2">
                                                        {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                        <Image src={'/images/sbacoustics/FRD-ZMA-download.webp'} alt="FRD ZMA Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                    </div>
                                                    <h3 className="pl-2">
                                                        {data.frdzma[0]?.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        : data.frdzma[0]?.url!='' &&
                                            <div className="justify-start pt-4">
                                                {data.frdzma && data.frdzma.map((value, index) => (
                                                    value.url!=''&&
                                                        <div key={index} className={`${index !== 0 && 'pt-4'}`}>
                                                                <Link href={value.url} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}> 
                                                                <div className="pr-2">
                                                                {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                                <Image src={'/images/sbacoustics/FRD-ZMA-download.webp'} alt="FRD ZMA Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                            </div>
                                                            <h3 className="pl-2">
                                                                {data.frdzma[index]?.name}
                                                            </h3>
                                                            </Link>
                                                        </div>
                                                ))}
                                            </div>    
                                        }            
                                    </>
                                }



                                {data.models3d && data.models3d.length > 0 &&
                                    <>
                                        <h2 className="sr-only">3D Models:</h2>
                                        {data.models3d.length===1 && data.models3d[0]?.url!=''?
                                            <div className="flex justify-start pt-4">
                                                <Link href={data.models3d[0]?.url ?? '/sbaudience'} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}>
                                                    <div className="pr-2">
                                                        {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                        <Image src={'/images/sbacoustics/3D-download.webp'} alt="3D Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                    </div>
                                                    <h3 className="pl-2">
                                                        {data.models3d[0]?.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        : data.models3d[0]?.url!='' &&
                                            <div className="justify-start pt-4">
                                                {data.models3d && data.models3d.map((value, index) => (
                                                    value.url!=''&&
                                                        <div key={index} className={`${index !== 0 && 'pt-4'}`}>
                                                                <Link href={value.url} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}> 
                                                                <div className="pr-2">
                                                                {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                                <Image src={'/images/sbacoustics/3D-download.webp'} alt="3D Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                            </div>
                                                            <h3 className="pl-2">
                                                                {data.models3d[index]?.name}
                                                            </h3>
                                                            </Link>
                                                        </div>
                                                ))}
                                            </div>                
                                        }
                                    </>
                                }


                                {data.specification && data.specification.length > 0 &&
                                    <div className="justify-start pt-4">
                                        <SpecificationTable  spec={data.specification} styling={all_desc_style} stylingTitle={all_sub_title_style}/>
                                    </div>
                                }
                        
                    </div>
                </div>
            </div>
            {data.similarProds && data.similarProds.length > 0 &&
                <div className={`${all_sub_title_style} pt-28 justify-center items-center text-center w-full`}>
                    <h2 className="pb-4">
                        Similar Products
                    </h2>
                    <div className='border-2 rounded-lg p-4'>
                        <SwiperCarouselSimilarProduct similar={data.similarProds}/>
                    </div>
                </div>
            }
            </>
            }

            
        </div>
    );
}