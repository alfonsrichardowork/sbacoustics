import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string }> }
) {
  const params = await props.params

  try {
    const x = await prismadb.allcategory.findMany({
      where: {
        brandId: params.brandId,
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
        productCategories: {
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
                isArchived: true
              },
            },
          },
        },
      },
    })

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