import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"
import getAllNavbarContent, { buildHierarchy, loadCategories, serializeCategory, SerializedCategory } from "../../actions/get-all-navbar-content";
import { buildNavbarMenus, NavbarMenus } from "@/components/build-navbar-menu";

export function getNavbarRoutes(menus: NavbarMenus): string[][] {
  const allRoutes = [
    ...menus.firstMenu,
    ...Object.values(menus.subMenuMapping).flat(),
    ...Object.values(menus.subSubMenuMapping).flat(),
    ...Object.values(menus.subSubSubMenuMapping).flat(),
    ...Object.values(menus.subSubSubSubMenuMapping).flat(),
  ]
    .map(item => item.href)
    .filter(
      (href): href is string =>
        !!href && !href.startsWith('/products/')
    );

  return menus.firstMenu.map(first => {
    return [
      ...new Set(
        allRoutes.filter(
          href =>
            href === first.href ||
            href.startsWith(`${first.href}/`)
        )
      ),
    ];
  });
}


export async function GET() {
    try {
        const categories = await prismadb.allcategory.findMany({
          where: {
            brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
            OR: [
              { shown_on_all_drivers_page: true },
              { under_categoryId: { not: "" } },
            ],
          },
          select: {
            id: true,
            name: true,
            type: true,
            singularname: true,
            slug: true,
            priority: true,
            shown_on_all_drivers_page: true,
            under_categoryId: true,
            combine_name: true,
            show_products: true,
          },
        })

        const allBrandCategories = await prismadb.allcategory.findMany({
          where: { brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID },
          select: { id: true, under_categoryId: true },
        })

        const categoryParentMap = new Map(
          allBrandCategories.map((c) => [c.id, c.under_categoryId])
        )

        const getCategoryFamily = (categoryId: string) => {
          const family: string[] = []
          const visited = new Set<string>()
          let currentId = categoryId

          while (currentId && !visited.has(currentId)) {
            visited.add(currentId)
            family.push(currentId)

            const parentId = categoryParentMap.get(currentId)
            if (!parentId || parentId === "") break

            currentId = parentId
          }

          return family
        }

        const productCategoryIds = categories
          .filter((c) => c.show_products)
          .map((c) => c.id)

        const categoryFamilies = productCategoryIds.map((categoryId) => ({
          categoryId,
          family: getCategoryFamily(categoryId),
        }))

        const requiredCategoryIds = [
          ...new Set(categoryFamilies.flatMap(({ family }) => family)),
        ]

        const productCategoryRelations =
          requiredCategoryIds.length > 0
            ? await prismadb.allproductcategory.findMany({
                where: { categoryId: { in: requiredCategoryIds } },
                select: { productId: true, categoryId: true },
              })
            : []

        const productCategoryMap = new Map<string, Set<string>>()

        for (const item of productCategoryRelations) {
          if (!productCategoryMap.has(item.productId)) {
            productCategoryMap.set(item.productId, new Set())
          }
          productCategoryMap.get(item.productId)!.add(item.categoryId)
        }

        const qualifyingProductIdsByCategory: Record<string, string[]> = {}

        for (const { categoryId, family } of categoryFamilies) {
          qualifyingProductIdsByCategory[categoryId] = [
            ...productCategoryMap.entries(),
          ]
            .filter(([, productCategories]) =>
              family.every((familyCategoryId) =>
                productCategories.has(familyCategoryId)
              )
            )
            .map(([productId]) => productId)
        }

        for (const category of categories) {
          if (!category.show_products) {
            continue
          }

          const currentProducts =
            qualifyingProductIdsByCategory[category.id] ?? []

          if (currentProducts.length === 0) {
            continue
          }

          
          const descendantCategoryIds = categories
            .filter((possibleDescendant) => {
              if (
                possibleDescendant.id === category.id ||
                !possibleDescendant.show_products
              ) {
                return false
              }

              let currentId = possibleDescendant.id
              const visited = new Set<string>()

              while (currentId && !visited.has(currentId)) {
                visited.add(currentId)

                const parentId = categoryParentMap.get(currentId)

                if (!parentId || parentId === "") {
                  break
                }

                if (parentId === category.id) {
                  return true
                }

                currentId = parentId
              }

              return false
            })
            .map((possibleDescendant) => possibleDescendant.id)

          if (descendantCategoryIds.length === 0) {
            continue
          }

          const productsClaimedByDescendants = new Set(
            descendantCategoryIds.flatMap(
              (descendantCategoryId) =>
                qualifyingProductIdsByCategory[descendantCategoryId] ?? []
            )
          )

          // Remove those products from this parent category.
          qualifyingProductIdsByCategory[category.id] =
            currentProducts.filter(
              (productId) =>
                !productsClaimedByDescendants.has(productId)
            )
        }

        const allQualifyingProductIds = [
          ...new Set(Object.values(qualifyingProductIdsByCategory).flat()),
        ]

        const productCategories =
          allQualifyingProductIds.length > 0
            ? await prismadb.allproductcategory.findMany({
                where: {
                  productId: { in: allQualifyingProductIds },
                  categoryId: { in: productCategoryIds },
                },
                select: {
                  id: true,
                  categoryId: true,
                  productId: true,
                  priority: true,
                  product: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      cover_img_url: true,
                      isKits: true,
                      isNewProduct: true,
                      navbarNotes: true,
                      tempAllFinished: true,
                      isArchived: true,
                    },
                  },
                },
              })
            : []

        const linksByCategoryAndProduct = new Map<
          string,
          (typeof productCategories)[number]
        >()

        for (const link of productCategories) {
          linksByCategoryAndProduct.set(
            `${link.categoryId}::${link.productId}`,
            link
          )
        }

        const priorityValue = (raw?: string | null) => {
          const n = Number(raw?.trim())
          return raw?.trim() && Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
        }

        const x = categories.map((category) => {
          const qualifyingProductIds =
            qualifyingProductIdsByCategory[category.id] ?? []

          const categoryProducts = qualifyingProductIds
            .map((productId) =>
              linksByCategoryAndProduct.get(`${category.id}::${productId}`)
            )
            .filter(
              (link): link is (typeof productCategories)[number] => Boolean(link)
            )
            .sort(
              (a, b) =>
                priorityValue(a.priority) - priorityValue(b.priority) ||
                (a.product?.name ?? "").localeCompare(b.product?.name ?? "")
            )

          return {
            id: category.id,
            name: category.name,
            type: category.type,
            singularname: category.singularname,
            slug: category.slug,
            priority: category.priority,
            shown_on_all_drivers_page: category.shown_on_all_drivers_page,
            under_categoryId: category.under_categoryId,
            combine_name: category.combine_name,
            show_products: category.show_products,

            productCategories: categoryProducts,
          }
        })

        const { roots } = buildHierarchy(x)
        const navbarData: SerializedCategory[] =  roots.map(serializeCategory)
        const menus = buildNavbarMenus(navbarData)
        const y = getNavbarRoutes(menus)
        return NextResponse.json(y[0])
    } catch (error) {
    console.error("GET /api/test ERROR:", error)

        return NextResponse.json(
            { error: "Unable" },
            { status: 500 }
        )
    }
}
