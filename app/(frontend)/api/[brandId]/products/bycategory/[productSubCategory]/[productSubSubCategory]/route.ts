import { ChildSpecificationProp, SpecificationProp } from "@/app/(frontend)/types";
import { coaxialssbacoustics, othercategoriessbacoustics, tweeterssbacoustics } from "@/app/(frontend)/utils/filterPageProps";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, productSubCategory: string, productSubSubCategory: string }> }
) {
  const params = await props.params;
  try {
    if (!params.productSubCategory) {
      return new NextResponse("Product Sub Category is required", { status: 400 });
    }

    if (!params.productSubSubCategory) {
      return new NextResponse("Product Sub Sub Category is required", { status: 400 });
    }
    
    let neededSpec: string[] = []

    const productIdbySubCat =  await prismadb.allproductcategory.findMany({
      where:{
        category: {
          slug: params.productSubCategory,
          type: 'Sub Category'
        }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubCat = productIdbySubCat.map((value) => value.productId)

    const productIdbySubSubCat =  await prismadb.allproductcategory.findMany({
      where:{
        category: {
          slug: params.productSubSubCategory,
          type: 'Sub Sub Category'
        }
      },
      select:{
          productId: true
      }
    })

    const productIdsSubSubCat = productIdbySubSubCat.map((value) => value.productId)

    const finalProductIds = productIdsSubCat.filter(id => productIdsSubSubCat.includes(id));

    
    if (params.productSubCategory === 'tweeters'){
      neededSpec = tweeterssbacoustics
    }
    else if (params.productSubCategory === 'coaxials'){
      neededSpec = coaxialssbacoustics
    }
    else {
      neededSpec = othercategoriessbacoustics
    }

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

    const products = await prismadb.product.findMany({
      where: {
        id:{
          in: finalProductIds
        },
        brandId: params.brandId,
        isArchived: false
      },
      include: {
        size: {
          select: {
            name: true,
            value: true
          }
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
                unit: true,
                slug: true
              }
            }
          }
        }
      }
    });


    let allSpecsCombined: Record<string, ChildSpecificationProp[]> = {}

    neededSpec.forEach((specParent) => {
      const matchingSpecs: ChildSpecificationProp[] = []

      products.forEach((prod) => {
        prod.connectorSpecifications.forEach((spec) => {
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

      allSpecsCombined[specParent] = matchingSpecs
    })

    return NextResponse.json({
      products,
      allSpecsCombined
    });
  } catch (error) {
    console.log('[PRODUCT_BY_SUB_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};