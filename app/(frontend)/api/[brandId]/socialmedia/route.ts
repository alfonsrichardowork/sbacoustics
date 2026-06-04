import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const allSocialMedia = await prismadb.socialmedia.findMany({
      where:{
        brandId: params.brandId
      }
    });

    return NextResponse.json(allSocialMedia);
  } catch (error) {
    console.log('[ALL_SOCIAL_MEDIA_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
