import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const searchbox = await prismadb.product.findMany({
      where: {
        brandId: params.brandId,
      },
      select: {
        id: true,
        name: true,
        // Add other fields you want to include here
      }
    });
  
    return NextResponse.json(searchbox);
  } catch (error) {
    console.log('[SEARCHBOX_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};