import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string }> }
) {
  const params = await props.params

  try {
    // 1. Categories shown on the page (or nested under another category)
    const categories = await prismadb.allcategory.findMany({
      where: {
        brandId: params.brandId,
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

    // 2. Parent map for the whole brand
    const allBrandCategories = await prismadb.allcategory.findMany({
      where: { brandId: params.brandId },
      select: { id: true, under_categoryId: true },
    })

    const categoryParentMap = new Map(
      allBrandCategories.map((c) => [c.id, c.under_categoryId])
    )

    // Drivers > Midwoofers > NBAC  =>  [NBAC, Midwoofers, Drivers]
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

    // 3. Only categories that actually render products
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

    // 4. Which categories each product belongs to
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

    // ---------------------------------------------------------
    // NEW RULE:
    // A product qualifies for EVERY show_products category whose
    // full family it satisfies. No "owning" category, no removal
    // from parents, no dedupe across branches.
    //
    // DW50 in (drivers > passive radiators) AND (kits > accessories)
    // appears in BOTH, each with its own link priority.
    // ---------------------------------------------------------
    const qualifyingProductIdsByCategory: Record<string, string[]> = {}

    // First:
    // Find every product that qualifies for every show_products category.
    //
    // Example:
    //
    // W
    // └── F
    //
    // Product A = D, W, F
    // Product B = D, W
    //
    // Initial result:
    //
    // W -> A, B
    // F -> A

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


    // ---------------------------------------------------------
    // Second:
    // If a product qualifies for a more specific descendant
    // category, remove it from the parent category.
    //
    // Example:
    //
    // W -> A, B
    // F -> A
    //
    // Since F is a child of W and A qualifies for F:
    //
    // W -> B
    // F -> A
    //
    // This also works for multiple levels:
    //
    // W
    // └── F
    //     └── G
    //
    // A product qualifying for G will not appear in F or W.
    // A product qualifying for F but not G will remain in F.
    // ---------------------------------------------------------

    for (const category of categories) {
      if (!category.show_products) {
        continue
      }

      const currentProducts =
        qualifyingProductIdsByCategory[category.id] ?? []

      if (currentProducts.length === 0) {
        continue
      }

      // Find every show_products descendant of this category.
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

            // We found this category somewhere in the
            // descendant's ancestor chain.
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

      // Collect products that have already qualified for
      // a more specific descendant category.
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

    // 5. Fetch the link records for the exact (product, category) pairs
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

    // Lookup keyed by the LINK, not the product
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

    // 6. Response: each category carries its own link rows,
    //    sorted by that link's priority.
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

    return NextResponse.json(x)
  } catch (error) {
    console.error("[categories] Failed to build category hierarchy", error)

    return NextResponse.json(
      { error: "Unable to load categories" },
      { status: 500 }
    )
  }
}
