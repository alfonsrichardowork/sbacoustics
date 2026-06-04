import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const oneBrand = await prismadb.brand.findFirst({
      where: {
        id: params.brandId
      }
    });

    return NextResponse.json(oneBrand);
  } catch (error) {
    console.log('[ONE_BRAND_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
