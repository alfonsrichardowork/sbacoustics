import prismadb from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string }> }
) {
    const params = await props.params;
    try {
      const x = await prismadb.allcategory.findMany({
          where: {
            brandId: params.brandId
          },
          include: { productCategories: { include: { product: true } } },
      })
      return NextResponse.json(x)
    } catch (error) {
      console.error('[categories] Failed to build category hierarchy', error)
      return NextResponse.json({ error: 'Unable to load categories' }, { status: 500 })
    }
  }
  