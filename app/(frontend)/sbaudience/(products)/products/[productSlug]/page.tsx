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
import prismadb from "@/lib/prismadb";
import { AllCategory, ChildSpecificationProp, SpecificationProp } from "@/app/(frontend)/types";

const all_desc_style = "text-left xl:text-base sm:text-sm text-xs text-foreground p-0 py-1"
const all_sub_title_style = "text-left font-bold xl:text-2xl lg:text-xl md:text-lg sm:text-md text-foreground"

type Props = {
  params: Promise<{ productSlug?: string }>
}

// export const revalidate = 86400


// export async function generateStaticParams(){
//   const products = await prismadb.product.findMany({
//     where: {
//       brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
//       isArchived: false
//     },
//     select: {
//       slug: true,
//     },
//     // take: 5
//   });
//   return products.map((product: { slug: string }) => ({
//     productSlug: product.slug
//   }));
// }

export default async function SingleProductSBAudience(props: Props) {
    const { productSlug = '' } = await props.params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
    
    const product = await prismadb.product.findFirst({
        where: {
        slug: productSlug,
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
        isArchived: false
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            cover_img_url: true,
            drawing_img_url: true,
            graph_img_url: true,
            isKits: true,
            allCat: {
                select: {
                    id: true,
                    category: {
                        select: {
                            name: true,
                            slug: true,
                            type: true
                        }
                    }
                }
            },
            images_catalogues: {
                select: {
                    name: true,
                    url: true
                }
            },
            similarProducts: {
                select: {
                similarProduct: {
                    select: {
                        name: true,
                        slug: true,
                        cover_img_url: true,
                    }
                }
                }
            },
            multipleDatasheetProduct: {
                select: {
                    url: true,
                    name: true,
                }
            },
            multipleFRDZMAFiles: {
                select: {
                    url: true,
                    name: true,
                }
            },
            multiple3DModels: {
                select: {
                    url: true,
                    name: true,
                }
            },
            size: {
                select: {
                    name: true,
                    value: true,
                }
            },
            connectorSpecifications: {
                select: {
                    value: true,
                    notes: true,
                    dynamicspecification: {
                        select: {
                            name: true,
                            slug: true,
                            unit: true,
                            priority: true,
                        }
                    },
                    dynamicspecificationParent: {
                        select: {
                            name: true,
                            slug: true,
                            priority: true,
                        }
                    },
                    dynamicspecificationSubParent: {
                        select: {
                            name: true,
                            slug: true,
                            priority: true,
                        }
                    }
                }
            }
        }
    });

    if(!product){
        return null
    }

    const specsCombined = (product?.connectorSpecifications ?? []).reduce<SpecificationProp[]>(
            (acc, connector) => {
            const parentname = connector.dynamicspecificationParent?.name ?? "";
            const subparentname = connector.dynamicspecificationSubParent?.name ?? "";
        
            const child: ChildSpecificationProp = {
                childname: connector.dynamicspecification?.name ?? "",
                value: connector.value ?? "",
                notes: connector.notes ?? "",
                slug: connector.dynamicspecification?.slug ?? "",
                unit: connector.dynamicspecification?.unit ?? "",
            };
        
            const existingGroup = acc.find(
                (group) =>
                group.parentname === parentname &&
                group.subparentname === subparentname
            );
        
            if (existingGroup) {
                existingGroup.child.push(child);
            } else {
                acc.push({ parentname, subparentname, child: [child] });
            }
        
            return acc;
            },
            []
        );
    
        const parentPriorityMap = new Map(
            product?.connectorSpecifications.map((c) => [
            c.dynamicspecificationParent?.name ?? "",
            c.dynamicspecificationParent?.priority ?? 0,
            ])
        );
        
        const subParentPriorityMap = new Map(
            product?.connectorSpecifications.map((c) => [
            c.dynamicspecificationSubParent?.name ?? "",
            c.dynamicspecificationSubParent?.priority ?? 0,
            ])
        );
        
        const childPriorityMap = new Map(
            product?.connectorSpecifications.map((c) => [
            c.dynamicspecification?.name ?? "",
            c.dynamicspecification?.priority ?? 0,
            ])
        );
    
        specsCombined.sort((a, b) => {
            const aParentPriority = Number(parentPriorityMap.get(a.parentname)) ?? 0;
            const bParentPriority = Number(parentPriorityMap.get(b.parentname)) ?? 0;
            if (aParentPriority !== bParentPriority)
            return aParentPriority - bParentPriority;
        
            const aSubPriority = Number(subParentPriorityMap.get(a.subparentname)) ?? 0;
            const bSubPriority = Number(subParentPriorityMap.get(b.subparentname)) ?? 0;
            if (aSubPriority !== bSubPriority)
            return aSubPriority - bSubPriority;
        
            return 0;
        });
        
        specsCombined.forEach((group) => {
            group.child.sort((a, b) => {
            const aPriority = Number(childPriorityMap.get(a.childname)) ?? 0;
            const bPriority = Number(childPriorityMap.get(b.childname)) ?? 0;
            return aPriority - bPriority;
        });
    });
    
    let prod_cat: Array<AllCategory> = []
    let prod_sub_cat: Array<AllCategory> = []
    let prod_sub_sub_cat: Array<AllCategory> = []
    if(product.allCat){
        for (let i = 0; i < product.allCat.length; i++) {
        let temp: AllCategory = {
            id: product.allCat[i]?.id ?? '',
            name: product.allCat[i]?.category.name ?? '',
            slug: product.allCat[i]?.category.slug ?? ''
        }
        if(product.allCat[i]?.category.type === "Category"){
            prod_cat.push(temp)
        }
        else if(product.allCat[i]?.category.type === "Sub Category"){
            prod_sub_cat.push(temp)
        }
        else{
            prod_sub_sub_cat.push(temp)
        }
        }
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": `Found out more about ${product.name} from SB Audience!`,
        "image": product.cover_img_url ? `${baseUrl}${product.cover_img_url}` : '',
        "sku": product.slug || '',
        "brand": {
          "@type": "Brand",
          "name": "SB Audience"
        },
        "url": product.slug ? `${baseUrl}/sbaudience/products/${product.slug}` : `${baseUrl}/sbaudience`,
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
            <div className="block md:flex">
                {/* Left Column for Images */}
                <div className="md:flex md:w-1/2 justify-center md:h-1/2 block w-full h-full">
                    <div className="flex-col w-full md:flex hidden pr-10">
                        <div className="w-full h-full pb-4">
                            <SwiperCarouselCoverandCatalogues 
                            name={product.name}
                            cover={product.cover_img_url}
                            image_catalogues={product.images_catalogues}
                            />
                        </div>
                        {product.drawing_img_url !== '' &&
                            <LightboxOneProduct name={product.name} url={product.drawing_img_url} type={"drawing"}/>
                        }
                        {product.graph_img_url !== '' &&
                            <LightboxOneProduct name={product.name} url={product.graph_img_url} type={"graph"}/>
                        }                       
                    </div>
                    <div className="w-full h-full md:hidden pb-4">
                        <SwiperCarouselOneProduct 
                        name={product.name}
                        cover={product.cover_img_url}
                        image_catalogues={product.images_catalogues}
                        drawing={product.drawing_img_url}
                        graph={product.graph_img_url}
                        />
                    </div>
                </div>

                {/* Right Column for Typography */}
                <div className="md:flex md:w-1/2 justify-center md:h-1/2 block w-full h-full">
                    <div className="flex flex-col w-full">
                        <h1 className={all_sub_title_style}>
                            {product.name}
                        </h1>
                        <div className={all_desc_style}>
                            {(prod_sub_cat.length !== 0 || prod_sub_sub_cat.length !== 0) &&
                                <div className="flex flex-wrap gap-2">
                                    <h2>Categories:</h2> 
                                    {prod_sub_cat.length !== 0 &&
                                        prod_sub_cat.map((subcategory, index) => (
                                        <React.Fragment key={index}>
                                            <Link
                                            href={`/sbaudience/${prod_cat[0]?.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="hover:text-primary"
                                            >
                                            <u>{subcategory.name}</u>
                                            </Link>
                                        </React.Fragment>
                                        ))
                                    }
                                    {prod_sub_sub_cat.length !== 0 &&
                                        prod_sub_sub_cat.map((subsubcategory, index) => (
                                        <React.Fragment key={index}>
                                            <Link
                                            href={`/sbaudience/${prod_cat[0]?.name.toLowerCase().replace(/\s+/g, '-')}/${prod_sub_cat[0]?.name.toLowerCase().replace(/\s+/g, '-')}/${subsubcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
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


                        
                        
                        {product.description && product.description != '<p></p>' && product.description != '' && product.description != '<></>' &&
                        <>
                            <div className={`${all_sub_title_style} pt-8`}>
                                    <h2>Features:</h2>
                                </div>
                                <h3 className={`${all_desc_style} tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description, {
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


                                    
                                {product.multipleDatasheetProduct && product.multipleDatasheetProduct.length > 0 &&
                                    <>
                                        <h2 className="sr-only">Datasheet:</h2>
                                        {product.multipleDatasheetProduct.length===1 && product.multipleDatasheetProduct[0]?.url!=''?
                                            <div className="flex justify-start pt-8">
                                                <Link href={product.multipleDatasheetProduct[0]?.url ?? '/sbaudience'} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}>
                                                    <div className="pr-2">
                                                        {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                        <Image src={'/images/sbacoustics/PDF-download.webp'} alt="PDF Download" className="h-8 w-fit" width={100} height={100}/>
                                                    </div>
                                                    <h3 className="pl-2">
                                                        {product.multipleDatasheetProduct[0]?.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        : product.multipleDatasheetProduct[0]?.url!='' &&
                                            <div className="justify-start pt-8">
                                                {product.multipleDatasheetProduct && product.multipleDatasheetProduct.map((value, index) => (
                                                    value.url!=''&&
                                                        <div key={index} className={`${index !== 0 && 'pt-4'}`}>
                                                                <Link href={value.url} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}> 
                                                                <div className="pr-2">
                                                                {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                                <Image src={'/images/sbacoustics/PDF-download.webp'} alt="PDF Download" className="h-8 w-fit" width={100} height={100}/>
                                                            </div>
                                                            <h3 className="pl-2">
                                                                {product.multipleDatasheetProduct[index]?.name}
                                                            </h3>
                                                            </Link>
                                                        </div>
                                                ))}
                                            </div>                
                                        }
                                    </>
                                }


                                {product.multipleFRDZMAFiles && product.multipleFRDZMAFiles.length > 0 &&
                                    <>
                                        <h2 className="sr-only">FRD & ZMA Files:</h2>
                                        {
                                        product.multipleFRDZMAFiles.length===1 && product.multipleFRDZMAFiles[0]?.url!=''?
                                            <div className="flex justify-start pt-4">
                                                <Link href={product.multipleFRDZMAFiles[0]?.url ?? '/sbaudience'} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}>
                                                    <div className="pr-2">
                                                        {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                        <Image src={'/images/sbacoustics/FRD-ZMA-download.webp'} alt="FRD ZMA Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                    </div>
                                                    <h3 className="pl-2">
                                                        {product.multipleFRDZMAFiles[0]?.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        : product.multipleFRDZMAFiles[0]?.url!='' &&
                                            <div className="justify-start pt-4">
                                                {product.multipleFRDZMAFiles && product.multipleFRDZMAFiles.map((value, index) => (
                                                    value.url!=''&&
                                                        <div key={index} className={`${index !== 0 && 'pt-4'}`}>
                                                                <Link href={value.url} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}> 
                                                                <div className="pr-2">
                                                                {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                                <Image src={'/images/sbacoustics/FRD-ZMA-download.webp'} alt="FRD ZMA Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                            </div>
                                                            <h3 className="pl-2">
                                                                {product.multipleFRDZMAFiles[index]?.name}
                                                            </h3>
                                                            </Link>
                                                        </div>
                                                ))}
                                            </div>    
                                        }            
                                    </>
                                }



                                {product.multiple3DModels && product.multiple3DModels.length > 0 &&
                                    <>
                                        <h2 className="sr-only">3D Models:</h2>
                                        {product.multiple3DModels.length===1 && product.multiple3DModels[0]?.url!=''?
                                            <div className="flex justify-start pt-4">
                                                <Link href={product.multiple3DModels[0]?.url ?? '/sbaudience'} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}>
                                                    <div className="pr-2">
                                                        {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                        <Image src={'/images/sbacoustics/3D-download.webp'} alt="3D Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                    </div>
                                                    <h3 className="pl-2">
                                                        {product.multiple3DModels[0]?.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        : product.multiple3DModels[0]?.url!='' &&
                                            <div className="justify-start pt-4">
                                                {product.multiple3DModels && product.multiple3DModels.map((value, index) => (
                                                    value.url!=''&&
                                                        <div key={index} className={`${index !== 0 && 'pt-4'}`}>
                                                                <Link href={value.url} target="_blank" className={`${all_desc_style} font-bold flex items-center hover:text-primary`}> 
                                                                <div className="pr-2">
                                                                {/* <Download strokeWidth={3} size={15} className="text-white"/> */}
                                                                <Image src={'/images/sbacoustics/3D-download.webp'} alt="3D Files Download" className="h-8 w-fit" width={100} height={100}/>
                                                            </div>
                                                            <h3 className="pl-2">
                                                                {product.multiple3DModels[index]?.name}
                                                            </h3>
                                                            </Link>
                                                        </div>
                                                ))}
                                            </div>                
                                        }
                                    </>
                                }


                                {specsCombined && specsCombined.length > 0 &&
                                    <div className="justify-start pt-4">
                                        <SpecificationTable  spec={specsCombined} styling={all_desc_style} stylingTitle={all_sub_title_style}/>
                                    </div>
                                }
                        
                    </div>
                </div>
            </div>
            {product.similarProducts && product.similarProducts.length > 0 &&
                <div className={`${all_sub_title_style} pt-28 justify-center items-center text-center w-full`}>
                    <h2 className="pb-4">
                        Similar Products
                    </h2>
                    <div className='border-2 rounded-lg p-4'>
                        <SwiperCarouselSimilarProduct similar={product.similarProducts} brand={'sbaudience'}/>
                    </div>
                </div>
            }

            
        </div>
    );
}