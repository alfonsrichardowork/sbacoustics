import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string }> }
) {
  const params = await props.params

  try {
    // 1. Get all relevant categories
    const categories = await prismadb.allcategory.findMany({
      where: {
        brandId: params.brandId,
        OR: [
          {
            shown_on_all_drivers_page: true,
          },
          {
            under_categoryId: {
              not: "",
            },
          },
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

    // 2. Only get products for categories where show_products = true
    const productCategoryIds = categories
      .filter((category) => category.show_products)
      .map((category) => category.id)

    const productCategories =
      productCategoryIds.length > 0
        ? await prismadb.allproductcategory.findMany({
            where: {
              categoryId: {
                in: productCategoryIds,
              },
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

    // 3. Group productCategories by categoryId
    const productCategoriesByCategory = productCategories.reduce(
      (acc, productCategory) => {
        if (!acc[productCategory.categoryId]) {
          acc[productCategory.categoryId] = []
        }

        acc[productCategory.categoryId]?.push(productCategory)

        return acc
      },
      {} as Record<string, typeof productCategories>
    )

    // 4. Rebuild the same nested structure
    const x = categories.map((category) => ({
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

      productCategories:
        productCategoriesByCategory[category.id] ?? [],
    }))

    return NextResponse.json(x)
  } catch (error) {
    console.error(
      "[categories] Failed to build category hierarchy",
      error
    )

    return NextResponse.json(
      { error: "Unable to load categories" },
      { status: 500 }
    )
  }
}