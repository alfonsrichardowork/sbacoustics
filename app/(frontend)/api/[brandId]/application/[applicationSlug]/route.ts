import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ brandId: string, applicationSlug: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    
    if (!params.applicationSlug) {
      return new NextResponse("Application Slug is required", { status: 400 });
    }

    const app = await prismadb.sbaudienceapplication.findMany({
      where: {
        brandId: params.brandId,
        slug: params.applicationSlug
      },
      include: {
        datasheet: true,
        images_catalogues: true
      },
      orderBy: {
        updatedAt: 'asc'
      }
    });
  
    return NextResponse.json(app);
  } catch (error) {
    console.log('[SINGLE_APPLICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};