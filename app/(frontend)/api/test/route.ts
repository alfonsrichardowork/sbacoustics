import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

export async function GET() {
const allDrivers = await prismadb.allproductcategory.findMany({
  where: {
    category: {
      shown_on_all_drivers_page: true,
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
    },
    product: {
      slug: {
        not: 'dw50'
      },
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
      allCat: {
        some: {
          category: {
            slug: 'drivers',
          },
        },
      },
    },
  },
  select: {
    category: {
      select: {
        name: true,
        thumbnail_url: true,
        slug: true,
        priority: true,
      },
    },
  }
})
const uniqueCategories = [
  ...new Map(
    allDrivers.map(item => [item.category.slug, item.category])
  ).values()
].sort((a, b) => Number(a.priority) - Number(b.priority))
  return NextResponse.json(uniqueCategories)    
}