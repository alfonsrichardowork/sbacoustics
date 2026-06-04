import { AllCategory, ChildSpecificationProp, FilesProp, FilesWithOrder, SimpleProdTypes, SingleProducts, Size, SpecificationProp } from "@/app/(frontend)/types";
import prismadb from "@/lib/prismadb";

const getProduct = async (path: string, productSlug: string): Promise<SingleProducts> => {
  const brandId = path.includes('sbaudience') ? process.env.NEXT_PUBLIC_SB_AUDIENCE_ID : path.includes('sbautomotive') ? process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID : process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID

     
  const product = await prismadb.product.findFirst({
    where: {
      slug: productSlug,
      brandId: brandId,
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
                url: true,
                id: true
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
            }
        },
        similarProducts: {
            select: {
            similarProduct: {
                select: {
                    name: true,
                    slug: true,
                    cover_img_url: true,
                    id: true
                }
            }
            }
        },
        productsKits: {
            select: {
            productUsedInKits: {
                select: {
                    name: true,
                    slug: true,
                    cover_img_url: true,
                    id: true
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

  // ✅ Build lookup maps for faster access
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

  // ✅ Sort parent/subparent groups by priority
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

  // ✅ Sort children inside each group by their own priority
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
  let all_image_catalogues : Array<FilesProp> = []
  let all_kits_finishing : Array<FilesProp> = []
  let all_kits_finishing_preview : Array<FilesWithOrder> = []
  let all_datasheet : Array<FilesProp> = []
  let all_frdzma : Array<FilesProp> = []
  let all_models3d : Array<FilesProp> = []
  let all_similar_prods : Array<SimpleProdTypes> = []
  let all_products_in_kits : Array<SimpleProdTypes> = []
  if (product){
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

    product.images_catalogues && product.images_catalogues.length > 0 && product.images_catalogues.map((img: any) => {
      all_image_catalogues.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    product.kitsFinishing && product.kitsFinishing.length > 0 && product.kitsFinishing.map((img) => {
      all_kits_finishing_preview.push({
        name: img.finishing.name,
        url: img.url,
        productId: product.id,
        order: img.order
      })
      all_kits_finishing.push({
        name: img.finishing.name,
        url: img.finishing.url,
        productId: product.id
      })
    })
    
    product.multipleDatasheetProduct && product.multipleDatasheetProduct.length > 0 && product.multipleDatasheetProduct.map((img : any) => {
      all_datasheet.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    product.multipleFRDZMAFiles && product.multipleFRDZMAFiles.length > 0 && product.multipleFRDZMAFiles.map((img: any) => {
      all_frdzma.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    product.multiple3DModels && product.multiple3DModels.length > 0 && product.multiple3DModels.map((img: any) => {
      all_models3d.push({
        name: img.name,
        url: img.url,
        productId: img.id
      })
    })
    
    product.similarProducts && product.similarProducts.length > 0 && product.similarProducts.map((prod) => {
      all_similar_prods.push({
        ProductId: prod.similarProduct.id,
        image_url: prod.similarProduct.cover_img_url,
        name: prod.similarProduct.name,
        href: prod.similarProduct.slug,
      })
    })
    
    product.productsKits && product.productsKits.length > 0 && product.productsKits.map((prod) => {
      all_products_in_kits.push({
        ProductId: prod.productUsedInKits.id,
        image_url: prod.productUsedInKits.cover_img_url,
        name: prod.productUsedInKits.name,
        href: prod.productUsedInKits.slug,
      })
    })

    let size = {} as Size;
    if(product.size!=null){
      let size2: Size = {
        label: product.size.value,
        value: Number(product.size.name)
      }
      size = size2  
    }
    
    let productsFinale: SingleProducts = {
      coverImg: product.cover_img_url,
      size: size,
      images_Catalogues: all_image_catalogues,
      drawing: product.drawing_img_url,
      graph: product.graph_img_url,
      categories: prod_cat,
      sub_categories: prod_sub_cat,
      sub_sub_categories: prod_sub_sub_cat,
      kitsFinishing: all_kits_finishing,
      kitsFinishingPreview: all_kits_finishing_preview,
      datasheet: all_datasheet,
      frdzma: all_frdzma,
      models3d: all_models3d,
      similarProds: all_similar_prods,
      productsinKits: all_products_in_kits,
      specification: specsCombined,
      id: product.id,
      name: product.name,
      desc: product.description,
      slug: product.slug,
      isKits: product.isKits
    }
    
    
    return productsFinale;
  }
  let productsFinale: SingleProducts = {
    coverImg: '',
    size: {
      value:0,
      label:'',
    },
    images_Catalogues: all_image_catalogues,
    drawing: '',
    graph: '',
    categories: prod_cat,
    sub_categories: prod_sub_cat,
    sub_sub_categories: prod_sub_sub_cat,
    kitsFinishing: all_kits_finishing,
    kitsFinishingPreview: all_kits_finishing_preview,
    datasheet: all_datasheet,
    frdzma: all_frdzma,
    models3d: all_models3d,
    similarProds: all_similar_prods,
    productsinKits: all_products_in_kits,
    specification: [],
    id: "",
    name: "",
    desc: "",
    slug: "",
    isKits: false,
  }
  return productsFinale;
};

export default getProduct;

