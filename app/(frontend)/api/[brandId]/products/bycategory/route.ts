import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, props: { params: Promise<{ brandId: string }> }
  ) {
    const params = await props.params;
    try {
      const product = await prismadb.product.findMany({
        select: {
          slug: true,
        },
        where:{
          isArchived: false,
          brandId: params.brandId
        }
      });
      return NextResponse.json(product);
    } catch (error) {
      console.log('[ALL_PRODUCT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };