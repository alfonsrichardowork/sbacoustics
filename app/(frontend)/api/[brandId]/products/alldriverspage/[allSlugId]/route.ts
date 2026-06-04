import { ChildSpecificationProp } from "@/app/(frontend)/types";
import { allproductssbacoustics, allproductssbaudience, allproductssbautomotive, tweeterssbacoustics } from "@/app/(frontend)/utils/filterPageProps";
import { allDriverCatForGenerateStaticParams, allKitsCatForGenerateStaticParams } from "@/app/(frontend)/utils/navbar-content";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ brandId: string, allSlugId: string }> }) {
  const params = await props.params;
  try {
    if (!params.allSlugId) {
      return new NextResponse("Product Sub Category is required", { status: 400 });
    }

    const slugArray = params.allSlugId.split(',');
    slugArray.pop()

    let neededSpec: string[] = []
    const allTypes = [...allDriverCatForGenerateStaticParams, ...allKitsCatForGenerateStaticParams]
    if (params.brandId === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
      neededSpec = allproductssbacoustics
    }
    else if (params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID){
      neededSpec = allproductssbautomotive
    }
    else if (params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID){
      neededSpec = allproductssbaudience
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

    // if(params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID) {     
    const products = await prismadb.product.findMany({
      where: {
        slug:{
          in: slugArray
        },
        brandId: params.brandId,
        isArchived: false
      },
      include: {
        allCat: {
          where: {
            category: {
              type: 'Sub Category'
            }
          },
          include: {
            category: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
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
      
      if(specParent === 'type'){
        products.forEach((prod) => {
          prod.allCat.map((subprod) => {
            const found = allTypes.find((val) => val === subprod.category.slug)
            found && matchingSpecs.push({
              childname: "Type",
              value: subprod.category.name,
              notes: '',
              slug: 'type',
              unit: ''
            })
          })
        })
      }
      else{
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
      }

      allSpecsCombined[specParent] = matchingSpecs
    })
    
    return NextResponse.json({
      products,
      allSpecsCombined
    });
      

  } catch (error) {
    console.log('[PRODUCT_FOR_ALL_DRIVERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};