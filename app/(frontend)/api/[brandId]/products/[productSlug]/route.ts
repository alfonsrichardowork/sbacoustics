import { ChildSpecificationProp, SpecificationProp } from "@/app/(frontend)/types";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ brandId: string, productSlug: string }> }) {
  const params = await props.params;
  try {
    if (!params.productSlug) {
      return new NextResponse("Product slug is required", { status: 400 });
    }
   
      const product = await prismadb.product.findFirst({
        where: {
          slug: params.productSlug,
          brandId: params.brandId,
          isArchived: false
        },
        include: {
          allCat: {
            include: {
              category: true
            }
          },
          images_catalogues: true,
          kitsFinishing: {
            include: {
              finishing: true
            }
          },
          multipleDatasheetProduct: true,
          multipleFRDZMAFiles: true,
          multiple3DModels: true,
          similarProducts: true,
          productsUsedInKits: true,
          size: true,
          connectorSpecifications: {
            include: {
              dynamicspecification: true,
              dynamicspecificationParent: true,
              dynamicspecificationSubParent: true
            }
          }
        }
      });
      const similarProd = await prismadb.product.findMany({
        where: {
          id: {
            in: product?.similarProducts.map((prod) => prod.similarProductId)
          },
          isArchived: false
        },
        select: {
          id: true,
          name: true,
          slug: true,
          cover_img_url: true
        }
      })
      
      const usedInKits = await prismadb.product.findMany({
        where: {
          id: {
            in: product?.productsUsedInKits.map((prod) => prod.productUsedInKitsId)
          },
          isArchived: false
        },
        select: {
          id: true,
          name: true,
          slug: true,
          cover_img_url: true
        }
      })

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

      const allKitsFinishing = await prismadb.allfinishing.findMany({
        where: {
          id: {
            in: product?.kitsFinishing.map((finish) => finish.finishingId)
          }
        }
      })

      return NextResponse.json({
        product,
        similarProd,
        usedInKits,
        allKitsFinishing,
        specifications: specsCombined
      });
    
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};