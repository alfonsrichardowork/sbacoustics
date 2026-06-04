import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const app = await prismadb.sbaudienceapplication.findMany({
      where: {
        brandId: params.brandId,
      },
      orderBy: {
        updatedAt: 'asc'
      }
    });
  
    return NextResponse.json(app);
  } catch (error) {
    console.log('[APPLICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};