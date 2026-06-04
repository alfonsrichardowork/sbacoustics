'use server';

import { AllFilterProductsOnlyType, ChildSpecificationProp } from "@/app/(frontend)/types";
import prismadb from "@/lib/prismadb";
import { coaxialssbacoustics, compressiondriversbaudience, hornsbaudience, othercategoriessbacoustics, othercategoriessbaudience, othercategoriessbautomotive, tweeterssbacoustics } from "@/app/(frontend)/utils/filterPageProps";
import { cookies } from "next/headers";

export async function getAllProductsForFilterPage (brand: string | undefined, slug: string, subslug: string | null, subsubslug: string | null): Promise<[AllFilterProductsOnlyType[], Record<string, ChildSpecificationProp[]>]> {

  let allSizes : string[] = []
  const hasAnySlug = Boolean(subslug || subsubslug);
  let finalProductsIds: string[] = []

  if(subslug && subslug === 'all' && !subsubslug) {
    const productIdbyCat =  await prismadb.allproductcategory.findMany({
      where:{
        category: {
          slug: slug,
          type: {
              in: ['Category']
          }
        }
      },
      select:{
          productId: true
      }
    })

    finalProductsIds = productIdbyCat.map((value) => value.productId)
  }
  else if (subslug && subslug !== 'all' && !subsubslug) {
    const productIdbyCat =  await prismadb.allproductcategory.findMany({
      where:{
        category: {
          slug: slug,
          type: {
              in: ['Category']
          }
        }
      },
      select:{
          productId: true
      }
    })

    const productIdsCat = productIdbyCat.map((value) => value.productId)

    const productIdbySubCat =  await prismadb.allproductcategory.findMany({
      where:{
        category: {
          slug: subslug,
          type: {
            in: ['Sub Category']
          }
        }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubCat = productIdbySubCat.map((value) => value.productId)

    finalProductsIds = productIdsCat.filter(id => productIdsSubCat.includes(id));
  }
  else if(subslug && subsubslug) {
        const productIdbyCat =  await prismadb.allproductcategory.findMany({
        where:{
          category: {
          slug: slug,
          type: {
              in: ['Category']
          }
          }
      },
      select:{
          productId: true
      }
    })

    const productIdsCat = productIdbyCat.map((value) => value.productId)

    const productIdbySubCat =  await prismadb.allproductcategory.findMany({
      where:{
        category: {
          slug: subslug,
          type: {
            in: ['Sub Category']
          }
        }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubCat = productIdbySubCat.map((value) => value.productId)

    const finalProductIds = productIdsCat.filter(id => productIdsSubCat.includes(id));

    const productIdbySubSubCat =  await prismadb.allproductcategory.findMany({
      where:{
        category: {
          slug: subsubslug,
          type: {
            in: ['Sub Sub Category']
          }
        }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubSubSubCat = productIdbySubSubCat.map((value) => value.productId)

    finalProductsIds = finalProductIds.filter(id => productIdsSubSubSubCat.includes(id));
  }


  let neededSpec: string[] = []
  if (subslug === 'tweeters' && brand === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
    neededSpec = tweeterssbacoustics
  }
  else if (subslug === 'coaxials' && brand === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
    neededSpec = coaxialssbacoustics
  }
  else if (brand === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
    neededSpec = othercategoriessbacoustics
  }
  else if (subslug === "compression-drivers" && brand === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID){
    neededSpec = compressiondriversbaudience
  }
  else if (subslug === "horn" && brand === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID){
    neededSpec = hornsbaudience
  }
  else if (brand === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID){
    neededSpec = othercategoriessbaudience
  }
  else if (brand === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID){
    neededSpec = othercategoriessbautomotive
  }
  else {
    neededSpec = othercategoriessbacoustics
  }



  const allTypes = await prismadb.allcategory.findMany({
    where: {
      type: 'Sub Category'
    },
    select:{
      slug: true
    }
  })

  const allSpecsNeeded = await prismadb.dynamicspecification.findMany({
    where: {
      slug: {
        in : neededSpec.map((val) => val)
      }
    },
    select: {
      id: true
    }
  })



  const cookieStore = await cookies();
  const allDriversProducts = cookieStore.get(brand === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? 'allDriversProductsSBAudience' : 'allDriversProducts')?.value;
  const listProd = allDriversProducts?.split(',').filter(Boolean) || [];
  // cookieStore.delete('allDriversProducts');
  let products: any[] = [];
  
  if(slug === 'search') {
    products = await prismadb.product.findMany({
      where: {
        brandId: brand,
        slug: {
          in: listProd.map((val) => val)
        },
        isArchived: false,
      },
      include: {
        allCat: {
          where: {
            ...(hasAnySlug && {
              category: {
                type: {
                  in: ["Sub Category", "Sub Sub Category"],
                },
              }
            }),
          },
          include: {
            category: {
              select: {
                name: true,
                slug: true,
                type: true
              }
            }
          }
        },
        size: {
          select: {
            name: true,
            value: true,
          },
        },
        connectorSpecifications: {
          where: {
            dynamicspecificationId: {
              in: allSpecsNeeded.map((val) => val.id)
            }
          },
          include: {
            dynamicspecification: {
              select: {
                name: true,
                slug: true,
                unit: true,
              }
            }
          }
        }
      },
    });
  }
  else{
    products = await prismadb.product.findMany({
      where: {
        brandId: brand,
        ...(hasAnySlug && {
          id: {
            in: finalProductsIds,
          },
        }),
        isArchived: false,
        allCat: {
          some: {
            category: {
              type: "Category",
              slug,
            },
          },
        },
      },
      include: {
        allCat: {
          where: {
            ...(hasAnySlug && {
              category: {
                type: {
                  in: ["Sub Category", "Sub Sub Category"],
                },
              }
            }),
          },
          include: {
            category: {
              select: {
                name: true,
                slug: true,
                type: true
              }
            }
          }
        },
        size: {
          select: {
            name: true,
            value: true,
          },
        },
        connectorSpecifications: {
          where: {
            dynamicspecificationId: {
              in: allSpecsNeeded.map((val) => val.id)
            }
          },
          include: {
            dynamicspecification: {
              select: {
                name: true,
                slug: true,
                unit: true,
              }
            }
          }
        }
      },
    });
  }



  
  let allSpecsCombined: Record<string, ChildSpecificationProp[]> = {}
  neededSpec.forEach((specParent) => {
    const matchingSpecs: ChildSpecificationProp[] = []
    
    if(specParent === 'type'){
      products.forEach((prod) => {
        prod.allCat.map((subprod: any) => {
          if(subprod.category.type === 'Sub Sub Category'){
            const found = allTypes.find((val) => val.slug === subprod.category.slug)
            found && matchingSpecs.push({
              childname: "Type",
              value: subprod.category.name,
              notes: '',
              slug: 'type',
              unit: ''
            })
          }
        })
      })
    }
    else{
      products.forEach((prod) => {
        prod.connectorSpecifications.forEach((spec: any) => {
          if (spec.dynamicspecification.slug === specParent) {
            matchingSpecs.push({
              childname: spec.dynamicspecification.name,
              value: spec.value,
              notes: spec.notes,
              slug: spec.dynamicspecification.slug,
              unit: spec.dynamicspecification.unit
            })
          }
        })
      })
    }

    allSpecsCombined[specParent] = matchingSpecs
  })






  let allSpecs: Record<string, ChildSpecificationProp[]> = allSpecsCombined
  let tempSize: ChildSpecificationProp[] = []
  let finalTemp: AllFilterProductsOnlyType[] = []
  products.map((val: any) => {
    tempSize.push({
      childname: "Size",
      value: val.size.name,
      slug: 'size',
      notes: '',
      unit: `"`
    })
    allSizes.push(val.size.name)

    let alltempSpec: ChildSpecificationProp[] = []
    val.connectorSpecifications.map((spec: any) => {
      let tempSpec: ChildSpecificationProp = {
        childname: spec.dynamicspecification.name,
        value: spec.value,
        slug: spec.dynamicspecification.slug,
        notes: spec.notes,
        unit: spec.dynamicspecification.unit
      }
      alltempSpec.push(tempSpec)
    })

    for (const key in allSpecs) {
      if (key === 'type'){
        val.allCat.map((cat: any) => {
          let tempSpec: ChildSpecificationProp = {
            childname: "Type",
            value: cat.name,
            slug: "type",
            notes: '',
            unit: ''
          }
          alltempSpec.push(tempSpec)
        })
      }
    }
    

    let temp: AllFilterProductsOnlyType = {
      products: {
        id: val.id,
        name: val.name,
        slug: val.slug,
        cover_img: val.cover_img_url
      },
      size: {
        name: val.size.value,
        value: val.size.name
      },
      specs: alltempSpec
    }
    finalTemp.push(temp)
  })

  allSpecs['size'] = tempSize
  for (const key in allSpecs) {
    if (allSpecs[key]?.length === 0) {
      delete allSpecs[key]
    }
  }
  
  return [finalTemp, allSpecs];
};