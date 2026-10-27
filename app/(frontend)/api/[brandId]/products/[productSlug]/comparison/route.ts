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
      select: {
        name: true,
        cover_img_url: true,
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};