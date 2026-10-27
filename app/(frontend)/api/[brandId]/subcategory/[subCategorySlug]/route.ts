import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, subCategorySlug: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    if (!params.subCategorySlug) {
      return new NextResponse("Sub Category Slug is required", { status: 400 });
    }

    const subcategories = await prismadb.allcategory.findFirst({
      where: {
        brandId: params.brandId,
        slug: params.subCategorySlug,
        type: "Sub Category"
      },
      select:{
        name: true
      }
    });
  
    return NextResponse.json(subcategories?.name);
  } catch (error) {
    console.log('[SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};