
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
import "./singleproduct.css"

type Props = {
  params: Promise<{ productSlug?: string }>
}

export const revalidate = 60


export default async function SingleProductSBAcoustics(props: Props) {
    const { productSlug = '' } = await props.params;

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
        <div className="single-product-page-outer-parent">
            <div className="single-product-page-outer-parent-2">
            <div className="single-product-page-parent">   
                <div className="single-product-page-child-1">
                        <div className="single-product-page-child-2">
                            <SwiperCarouselOneProductOld name={product.name} cover={product.cover_img_url} image_catalogues={product.images_catalogues}/>
                        </div>
                        {product.drawing_img_url !== '' &&
                            <div className="single-product-page-child-2">
                                <LightboxOneProductOld name={product.name} url={product.drawing_img_url} type={"drawing"}/>
                            </div>
                        }
                        {product.graph_img_url !== '' &&
                            <div className="single-product-page-child-2">
                                <LightboxOneProductOld name={product.name} url={product.graph_img_url} type={"graph"}/>
                            </div>
                        }
                    </div>
                    <div className="single-product-page-child-1-mobile">   
                        {/* <div style={{ width: "100%", height: "100%", paddingBottom: "1rem" }}> */}
                            <SwiperCarouselOneProductMobileOld name={product.name} cover={product.cover_img_url} image_catalogues={product.images_catalogues} drawing={product.drawing_img_url} graph={product.graph_img_url}/>       
                        {/* </div> */}
                    </div>
                </div>


                <div className="single-product-page-all-data">   
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <h1 className="single-product-page-all-data-h1">
                            {(
                                prod_cat.some((c) => c.name.toLowerCase().includes("satori")) ||
                                prod_sub_cat.some((s) => s.name.toLowerCase().includes("satori")) ||
                                prod_sub_sub_cat.some((ss) => ss.name.toLowerCase().includes("satori"))
                            ) && "SATORI "}
                            {product.name}
                        </h1>
                        <div className="single-product-page-all-data-desc-1">
                            {(prod_sub_cat.length !== 0 || prod_sub_sub_cat.length !== 0) &&
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
                                <div className="single-product-page-all-data-h1">
                                    <h2>Features:</h2>
                                </div>
                                <h3 className="single-product-page-all-data-desc-1" id="tiptap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description, {
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
                                <div className="single-product-page-all-data-desc-1" style={{ fontWeight: 700, paddingTop: "16px" }}>
                                    <h2>{product.slug === 'dw50' ? 'Compatible Drivers:' : 'Drivers:'}</h2>
                                </div>
                                {product.productsKits.map((value, index) => (
                                    <div key={index} className="single-product-page-all-data-desc-1" style={{ fontWeight: 600, display: "flex", alignItems: "center", paddingBlock: '0px' }}>
                                        <div style={{ paddingRight: "8px" }}>
                                            - 
                                        </div>
                                        <a
                                            href={`/products/${value.productUsedInKits.slug}`}
                                            style={{
                                                color: '#e6001b',
                                                textDecorationLine: "underline",
                                                fontSize: "14px",
                                                lineHeight: '1.43'
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
                                    <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: "32px" }}>
                                        <a href={product.multipleDatasheetProduct[0]?.url ?? '/'} target="_blank" className="single-product-page-all-data-desc-1" style={{
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center'
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
                                    <div style={{ justifyContent: "flex-start", paddingTop: "32px" }}>
                                        {product.multipleDatasheetProduct && product.multipleDatasheetProduct.map((value, index) => (
                                            value.url!=''&&
                                                <div key={index} style={{ paddingTop: index !== 0 ? "16px" : 0 }}>
                                                    <a href={value.url} target="_blank" className="single-product-page-all-data-desc-1" style={{
                                                        fontWeight: 700,
                                                        display: 'flex',
                                                        alignItems: 'center'
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
                                    <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: "16px" }}>
                                        <a download href={product.multipleFRDZMAFiles[0]?.url ?? '/'} target="_blank" className="single-product-page-all-data-desc-1" 
                                        style={{
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center'
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
                                    <div style={{ justifyContent: "flex-start", paddingTop: "16px" }}>
                                        {product.multipleFRDZMAFiles && product.multipleFRDZMAFiles.map((value, index) => (
                                            value.url!=''&&
                                                <div key={index} style={{ paddingTop: index !== 0 ? "16px" : 0 }}>
                                                    <a download href={value.url} target="_blank" className="single-product-page-all-data-desc-1" style={{
                                                        fontWeight: 700,
                                                        display: 'flex',
                                                        alignItems: 'center'
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
                                    <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: "16px" }}>
                                        <a download href={product.multiple3DModels[0]?.url ?? '/'} target="_blank" className="single-product-page-all-data-desc-1"
                                            style={{
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center'
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
                                    <div style={{ justifyContent: "flex-start", paddingTop: "16px" }}>
                                        {product.multiple3DModels && product.multiple3DModels.map((value, index) => (
                                            value.url!=''&&
                                                <div key={index} style={{ paddingTop: index !== 0 ? "16px" : 0 }}>
                                                    <a download href={value.url} target="_blank" className="single-product-page-all-data-desc-1" style={{
                                                        fontWeight: 700,
                                                        display: 'flex',
                                                        alignItems: 'center'
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
                            <div style={{ justifyContent: "flex-start", paddingTop: "16px" }}>
                                <SpecificationTableOld spec={specsCombined} styling={'single-product-page-all-data-desc-1'} stylingTitle={'single-product-page-all-data-h1'}/>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>

            <div style={{ width: "100%", height: "100%", paddingBottom: "16px" }}>
                {product.kitsFinishing && product.kitsFinishing.length > 1 &&
                    <SwiperCarouselKitsFinishingOld name={product.name} kits_finishing={product.kitsFinishing}/>
                }    
            </div>

            {product.similarProducts && product.similarProducts.length > 0 &&
                <div 
                className="single-product-page-all-data-h1"
                style={{ 
                    paddingTop: '112px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <h2 style={{
                        paddingBottom: "16px"
                    }}>
                        Similar Products
                    </h2>
                    <SwiperCarouselSimilarProductOld similar={product.similarProducts} brand={'sbacoustics'}/>
                </div>
            }
    
        </div>

    );
}