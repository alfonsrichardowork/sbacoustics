
import "@/app/css/styles.scss";
import DOMPurify from 'isomorphic-dompurify'; 
import React from "react";
import prismadb from "@/lib/prismadb";
import { AllCategory, ChildSpecificationProp, SpecificationProp } from "@/app/(frontend)/types";
import SwiperCarouselOneProductOld from "@/app/legacy/components/swipercarouselcoverandcataloguesold";
import { LightboxOneProductOld } from "@/app/legacy/components/drawingOneProductOld";
import SwiperCarouselKitsFinishingOld from "@/app/legacy/components/swipercarouselkitsfinishingOld";
import SwiperCarouselOneProductMobileOld from "@/app/legacy/components/swipercarouseloneproductOld";
import SpecificationTableOld from "@/app/legacy/components/spec-tableold";
import SwiperCarouselSimilarProductOld from "@/app/legacy/components/swipercarouselsimilarproductold";

const all_desc_style: React.CSSProperties = {
  textAlign: "left",
  fontSize: "clamp(0.75rem, 1vw, 1rem)",
  color: "black",
  padding: 0,
  paddingTop: "0.25rem",
  paddingBottom: "0.25rem",
};

const all_sub_title_style: React.CSSProperties = {
  textAlign: "left",
  fontWeight: 700,
  fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
  color: "black",
};
type Props = {
  params: Promise<{ productSlug?: string }>
}

export const revalidate = 60


export default async function SingleProductSBAcoustics(props: Props) {
    const { productSlug = '' } = await props.params;
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';
    // const data = await getProduct("", productSlug);

    const product = await prismadb.product.findFirst({
        where: {
        slug: productSlug,
        brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
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
                            singularname: true,
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
                },
                orderBy: {
                    name: 'asc'
                }
            },
            kitsFinishing: {
                select: {
                    url: true,
                    order: true,
                    finishing: {
                        select: {
                            name: true,
                            url: true,
                        }
                    }
                },
                orderBy: {
                    order: 'asc'
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
                },
                orderBy: {
                    similarProduct: {
                        name: 'asc'
                    }
                }
            },
            productsKits: {
                select: {
                    productUsedInKits: {
                        select: {
                            name: true,
                            slug: true,
                        }
                    }
                },
                orderBy: {
                    productUsedInKits: {
                        name: 'asc'
                    }
                }
            },
            multipleDatasheetProduct: {
                select: {
                    url: true,
                    name: true,
                },
                orderBy: {
                    name: 'asc'
                }
            },
            multipleFRDZMAFiles: {
                select: {
                    url: true,
                    name: true,
                },
                orderBy: {
                    name: 'asc'
                }
            },
            multiple3DModels: {
                select: {
                    url: true,
                    name: true,
                },
                orderBy: {
                    name: 'asc'
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
            name: product.allCat[i]?.category.singularname ?? '',
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

    product.productsKits.sort((a, b) => {
        // Extract the leading number from the name
        const numA = parseInt(a.productUsedInKits.name.match(/^\d+/)?.[0] || "100", 10);
        const numB = parseInt(b.productUsedInKits.name.match(/^\d+/)?.[0] || "100", 10);
    
        if (numA !== numB) {
        return numA - numB; // Sort numerically first
        }
    
        return a.productUsedInKits.name.localeCompare(b.productUsedInKits.name); // Sort alphabetically if numbers are the same
    });

    return (
        <div style={{ padding: "1rem 2rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ display: "flex", justifyContent: "center", width: "50%", height: "100%", flex: "1 1 50%" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%", paddingRight: "2.5rem" }}>
                        <div style={{ width: "100%", height: "100%", paddingBottom: "1rem" }}>
                            <SwiperCarouselOneProductOld name={product.name} cover={product.cover_img_url} image_catalogues={product.images_catalogues}/>
                        </div>
                        {product.drawing_img_url !== '' &&
                            <LightboxOneProductOld name={product.name} url={product.drawing_img_url} type={"drawing"}/>
                        }
                        {product.graph_img_url !== '' &&
                            <LightboxOneProductOld name={product.name} url={product.graph_img_url} type={"graph"}/>
                        }          

                        {/* {product.kitsFinishing && product.kitsFinishing.length > 0 &&
                            <SwiperCarouselKitsFinishingOld name={product.name} kits_finishing={product.kitsFinishing}/>
                        }              */}
                    </div>
                    <div style={{ width: "100%", height: "100%", paddingBottom: "1rem" }}>
                        {/* <SwiperCarouselOneProductMobileOld name={product.name} cover={product.cover_img_url} image_catalogues={product.images_catalogues} drawing={product.drawing_img_url} graph={product.graph_img_url}/>         */}
                    </div>

                    
                </div>

                <div style={{ display: "flex", justifyContent: "center", width: "50%", height: "100%", flex: "1 1 50%" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <h1 style={{ textAlign: "left",
                            fontWeight: 700,
                            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                            color: "black",
                        }}
                        >
                            {(
                                prod_cat.some((c) => c.name.toLowerCase().includes("satori")) ||
                                prod_sub_cat.some((s) => s.name.toLowerCase().includes("satori")) ||
                                prod_sub_sub_cat.some((ss) => ss.name.toLowerCase().includes("satori"))
                            ) && "SATORI "}
                            {product.name}
                        </h1>
                        <div style={{
                            textAlign: "left",
                            fontSize: "clamp(0.75rem, 1vw, 1rem)",
                            color: "black",
                            padding: 0,
                            paddingTop: "0.25rem",
                            paddingBottom: "0.25rem",
                        }}>
                            {(prod_sub_cat.length !== 0 || prod_sub_sub_cat.length !== 0) &&
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <h2>Categories:</h2> 
                                    {prod_sub_cat.length !== 0 &&
                                        prod_sub_cat.map((subcategory, index) => (
                                            <a
                                            href={`/${prod_cat[0]?.slug.toLowerCase().replace(/\s+/g, '-')}/${subcategory.slug.toLowerCase().replace(/\s+/g, '-')}`} key={index}
                                            >
                                            <u>{subcategory.name}</u>
                                            </a>
                                        ))
                                    }
                                    {prod_sub_sub_cat.length !== 0 &&
                                        prod_sub_sub_cat.map((subsubcategory, index) => (
                                            <a
                                            href={`/${prod_cat[0]?.slug.toLowerCase().replace(/\s+/g, '-')}/${prod_sub_cat[0]?.slug.toLowerCase().replace(/\s+/g, '-')}/${subsubcategory.slug.toLowerCase().replace(/\s+/g, '-')}`} key={index}
                                            >
                                            <u><h3>{subsubcategory.name}</h3></u>
                                            </a>
                                        ))
                                    }
                                </div>
                            }
                        </div>

                        {product.description && product.description != '<p></p>' && product.description != '' && product.description != '<></>' &&
                            <>
                                <div style={{ textAlign: "left",
                            fontWeight: 700,
                            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                            color: "black",
                            paddingTop: '32px'
                        }}>
                                    <h2>Features:</h2>
                                </div>
                                <h3  
                                style={{
                                    textAlign: "left",
                                    fontSize: "clamp(0.75rem, 1vw, 1rem)",
                                    color: "black",
                                    padding: 0,
                                    paddingTop: "0.25rem",
                                    paddingBottom: "0.25rem",
                                }} id="tiptap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description, {
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

                        {product.productsKits && product.productsKits.length > 0 &&
                            <>
                                <div style={{ ...all_desc_style, fontWeight: 700, paddingTop: "1rem" }}>
                                    <h2>{product.slug === 'dw50' ? 'Compatible Drivers:' : 'Drivers:'}</h2>
                                </div>
                                {product.productsKits.map((value, index) => (
                                    <div key={index} style={{ ...all_desc_style, fontWeight: 600, display: "flex", alignItems: "center", paddingTop: 0, paddingBottom: 0 }}>
                                        <div style={{ paddingRight: "0.5rem" }}>
                                            - 
                                        </div>
                                        <a
                                            href={`/products/${value.productUsedInKits.slug}`}
                                            style={{
                                                color: '#e6001b',
                                                textDecorationLine: "underline",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {value.productUsedInKits.name}
                                        </a>
                                    </div>
                                ))}
                            </>
                        }


                            
                        {product.multipleDatasheetProduct && product.multipleDatasheetProduct.length > 0 &&
                            <>
                                {product.multipleDatasheetProduct.length===1 && product.multipleDatasheetProduct[0]?.url!=''?
                                    <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: "2rem" }}>
                                        <a href={product.multipleDatasheetProduct[0]?.url ?? '/'} target="_blank" style={{
                                            textAlign: "left",
                                            fontSize: "clamp(0.75rem, 1vw, 1rem)",
                                            color: "black",
                                            padding: 0,
                                            paddingTop: "0.25rem",
                                            paddingBottom: "0.25rem",
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",

                                        }}>
                                                <div style={{
                                                    position: "relative",
                                                    display: 'inline-flex',
                                                    width: '32px',
                                                    height: '32px',
                                                    alignItems: 'center'
                                                }}>
                                                    <img
                                                        src={'/images/sbacoustics/PDF-download-ver2.png'}
                                                        alt={'PDF Download'}
                                                        width={100}
                                                        height={100}
                                                        style={{
                                                            maxHeight: '32px',
                                                            width: "auto",
                                                            flexShrink: 0,
                                                        }}
                                                        loading="eager"
                                                    />
                                                </div>
                                            <h3 style={{ paddingLeft: "8px"}}>
                                                {product.multipleDatasheetProduct[0]?.name}
                                            </h3>
                                        </a>
                                    </div>
                                : product.multipleDatasheetProduct[0]?.url!='' &&
                                    <div style={{ justifyContent: "flex-start", paddingTop: "2rem" }}>
                                        {product.multipleDatasheetProduct && product.multipleDatasheetProduct.map((value, index) => (
                                            value.url!=''&&
                                                <div key={index} style={{ paddingTop: index !== 0 ? "1rem" : 0 }}>
                                                    <a href={value.url} target="_blank" style={{
                                                        textAlign: "left",
                                                        fontSize: "clamp(0.75rem, 1vw, 1rem)",
                                                        color: "black",
                                                        padding: 0,
                                                        paddingTop: "0.25rem",
                                                        paddingBottom: "0.25rem",
                                                        fontWeight: 700,
                                                        display: "flex",
                                                        alignItems: "center",

                                                    }}> 
                                                        <div style={{
                                                            position: "relative",
                                                            display: 'inline-flex',
                                                            width: '32px',
                                                            height: '32px',
                                                            alignItems: 'center'
                                                        }}>
                                                            <img
                                                                src={'/images/sbacoustics/PDF-download-ver2.png'}
                                                                alt={'PDF Download'}
                                                                width={100}
                                                                height={100}
                                                                style={{
                                                                    maxHeight: '32px',
                                                                    width: "auto",
                                                                    flexShrink: 0,
                                                                }}
                                                                loading="eager"
                                                            />
                                                        </div>
                                                    <h3 style={{ paddingLeft: '8px'}}>
                                                        {product.multipleDatasheetProduct[index]?.name}
                                                    </h3>
                                                    </a>
                                                </div>
                                        ))}
                                    </div>                
                                }
                            </>
                        }


                        {product.multipleFRDZMAFiles && product.multipleFRDZMAFiles.length > 0 &&
                            <>
                                {
                                product.multipleFRDZMAFiles.length===1 && product.multipleFRDZMAFiles[0]?.url!=''?
                                    <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: "1rem" }}>
                                        <a download href={product.multipleFRDZMAFiles[0]?.url ?? '/'} target="_blank" 
                                        style={{
                                            textAlign: "left",
                                            fontSize: "clamp(0.75rem, 1vw, 1rem)",
                                            color: "black",
                                            padding: 0,
                                            paddingTop: "0.25rem",
                                            paddingBottom: "0.25rem",
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",

                                        }}>
                                        
                                            <div style={{
                                                position: "relative",
                                                display: 'inline-flex',
                                                width: '32px',
                                                height: '32px',
                                                alignItems: 'center'
                                            }}>
                                                <img
                                                    src={'/images/sbacoustics/FRD-ZMA-download-ver2.png'} 
                                                    alt="FRD ZMA Files Download"
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        maxHeight: '32px',
                                                        width: "auto",
                                                        flexShrink: 0,
                                                    }}
                                                    loading="eager"
                                                />
                                            </div>
                                                
                                            <h3 style={{ paddingLeft: '8px'}}>
                                                {product.multipleFRDZMAFiles[0]?.name}
                                            </h3>
                                        </a>
                                    </div>
                                : product.multipleFRDZMAFiles[0]?.url!='' &&
                                    <div style={{ justifyContent: "flex-start", paddingTop: "1rem" }}>
                                        {product.multipleFRDZMAFiles && product.multipleFRDZMAFiles.map((value, index) => (
                                            value.url!=''&&
                                                <div key={index} style={{ paddingTop: index !== 0 ? "1rem" : 0 }}>
                                                    <a download href={value.url} target="_blank" style={{
                                                        textAlign: "left",
                                                        fontSize: "clamp(0.75rem, 1vw, 1rem)",
                                                        color: "black",
                                                        padding: 0,
                                                        paddingTop: "0.25rem",
                                                        paddingBottom: "0.25rem",
                                                        fontWeight: 700,
                                                        display: "flex",
                                                        alignItems: "center",

                                                    }}> 
                                                        <div style={{
                                                            position: "relative",
                                                            display: 'inline-flex',
                                                            width: '32px',
                                                            height: '32px',
                                                            alignItems: 'center'
                                                        }}>
                                                            <img
                                                                src={'/images/sbacoustics/FRD-ZMA-download-ver2.png'} 
                                                                alt="FRD ZMA Files Download"
                                                                width={100}
                                                                height={100}
                                                                style={{
                                                                    maxHeight: '32px',
                                                                    width: "auto",
                                                                    flexShrink: 0,
                                                                }}
                                                                loading="eager"
                                                            />
                                                        </div>
                                                        
                                                    <h3 style={{ paddingLeft: '8px'}}>
                                                        {product.multipleFRDZMAFiles[index]?.name}
                                                    </h3>
                                                    </a>
                                                </div>
                                        ))}
                                    </div>    
                                }            
                            </>
                        }



                        {product.multiple3DModels && product.multiple3DModels.length > 0 &&
                            <>
                                {product.multiple3DModels.length===1 && product.multiple3DModels[0]?.url!=''?
                                    <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: "1rem" }}>
                                        <a download href={product.multiple3DModels[0]?.url ?? '/'} target="_blank"
                                            style={{
                                                textAlign: "left",
                                                fontSize: "clamp(0.75rem, 1vw, 1rem)",
                                                color: "black",
                                                padding: 0,
                                                paddingTop: "0.25rem",
                                                paddingBottom: "0.25rem",
                                                fontWeight: 700,
                                                display: "flex",
                                                alignItems: "center",

                                            }}>
                                            <div style={{
                                                position: "relative",
                                                display: 'inline-flex',
                                                width: '32px',
                                                height: '32px',
                                                alignItems: 'center'
                                            }}>
                                                <img
                                                    src={'/images/sbacoustics/3D-download-ver2.png'} 
                                                    alt="3D Files Download"
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        maxHeight: '32px',
                                                        width: "auto",
                                                        flexShrink: 0,
                                                    }}
                                                    loading="eager"
                                                />
                                            </div>
                                            
                                            <h3 style={{ paddingLeft: '8px'}}>
                                                {product.multiple3DModels[0]?.name}
                                            </h3>
                                        </a>
                                    </div>
                                : product.multiple3DModels[0]?.url!='' &&
                                    <div style={{ justifyContent: "flex-start", paddingTop: "1rem" }}>
                                        {product.multiple3DModels && product.multiple3DModels.map((value, index) => (
                                            value.url!=''&&
                                                <div key={index} style={{ paddingTop: index !== 0 ? "1rem" : 0 }}>
                                                    <a download href={value.url} target="_blank" style={{
                                                        textAlign: "left",
                                                        fontSize: "clamp(0.75rem, 1vw, 1rem)",
                                                        color: "black",
                                                        padding: 0,
                                                        paddingTop: "0.25rem",
                                                        paddingBottom: "0.25rem",
                                                        fontWeight: 700,
                                                        display: "flex",
                                                        alignItems: "center",

                                                    }}> 
                                                        
                                                    <div style={{
                                                        position: "relative",
                                                        display: 'inline-flex',
                                                        width: '32px',
                                                        height: '32px',
                                                        alignItems: 'center'
                                                    }}>
                                                        <img
                                                            src={'/images/sbacoustics/3D-download-ver2.png'} 
                                                            alt="3D Files Download"
                                                            width={100}
                                                            height={100}
                                                            style={{
                                                                maxHeight: '32px',
                                                                width: "auto",
                                                                flexShrink: 0,
                                                            }}
                                                            loading="eager"
                                                        />
                                                    </div>
                                                        
                                                    <h3 style={{ paddingLeft: '8px'}}>
                                                        {product.multiple3DModels[index]?.name}
                                                    </h3>
                                                    </a>
                                                </div>
                                        ))}
                                    </div>                
                                }
                            </>
                        }


                        {specsCombined && specsCombined.length > 0 &&
                            <div style={{ justifyContent: "flex-start", paddingTop: "1rem" }}>
                                {/* <SpecificationTableOld spec={specsCombined} styling={all_desc_style} stylingTitle={all_sub_title_style}/> */}
                            </div>
                        }
                        
                    </div>
                </div>
            </div>

            <div style={{ width: "100%", height: "100%", paddingBottom: "1rem" }}>
                {/* {product.kitsFinishing && product.kitsFinishing.length > 1 &&
                    <SwiperCarouselKitsFinishingOld name={product.name} kits_finishing={product.kitsFinishing}/>
                }     */}
            </div>

            {product.similarProducts && product.similarProducts.length > 0 &&
                <div 
                style={{ 
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                    color: "black",
                    paddingTop: '112px',
                    justifyContent: "center",
                    alignItems: "center",
                    textAlignLast:"center",
                    width: '100%'
                }}>
                    <h2 style={{
                        paddingBottom: "16px"
                    }}>
                        Similar Products
                    </h2>
                    {/* <SwiperCarouselSimilarProductOld similar={product.similarProducts} brand={'sbacoustics'}/> */}
                </div>
            }
    
        </div>

    );
}