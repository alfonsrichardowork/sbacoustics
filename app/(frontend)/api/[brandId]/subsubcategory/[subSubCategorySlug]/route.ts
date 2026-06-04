import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, subSubCategorySlug: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    
    if (!params.subSubCategorySlug) {
      return new NextResponse("Sub Sub Category Slug is required", { status: 400 });
    }

    const subcategories = await prismadb.allcategory.findFirst({
      where: {
        brandId: params.brandId,
        slug: params.subSubCategorySlug,
        type: "Sub Sub Category"
      },
      select:{
        name: true
      }
    });
  
    return NextResponse.json(subcategories?.name);
  } catch (error) {
    console.log('[SUB_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};