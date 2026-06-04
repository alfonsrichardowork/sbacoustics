import { ChildSpecificationProp } from "@/app/(frontend)/types";
import { coaxialssbacoustics, compressiondriversbaudience, hornsbaudience, othercategoriessbacoustics, othercategoriessbaudience, othercategoriessbautomotive, tweeterssbacoustics } from "@/app/(frontend)/utils/filterPageProps";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ brandId: string, productSubCategory: string }> }) {
  const params = await props.params;
  try {
    if (!params.productSubCategory) {
      return new NextResponse("Product Sub Category is required", { status: 400 });
    }
    
    let neededSpec: string[] = []

    const productIdbyCat =  await prismadb.allproductcategory.findMany({
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

    const productIds = productIdbyCat.map((value) => value.productId)

    if (params.productSubCategory === 'tweeters' && params.brandId === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
      neededSpec = tweeterssbacoustics
    }
    else if (params.productSubCategory === 'coaxials' && params.brandId === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
      neededSpec = coaxialssbacoustics
    }
    else if (params.brandId === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
      neededSpec = othercategoriessbacoustics
    }
    else if (params.productSubCategory === "compression-drivers" && params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID){
      neededSpec = compressiondriversbaudience
    }
    else if (params.productSubCategory === "horn" && params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID){
      neededSpec = hornsbaudience
    }
    else if (params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID){
      neededSpec = othercategoriessbaudience
    }
    else if (params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID){
      neededSpec = othercategoriessbautomotive
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
          in: productIds
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
    console.log('[PRODUCT_BY_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};