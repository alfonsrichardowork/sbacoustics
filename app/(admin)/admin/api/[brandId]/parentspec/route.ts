import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote?.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  return strBeforeSlash?.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '') ?? '';
};

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if(!session.isLoggedIn || !session){
      return NextResponse.json("expired_session")
    }
    
    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    const body = await req.json();

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const duplicates = await prismadb.dynamicspecificationparent.findFirst({
      where:{
        name,
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    await prismadb.dynamicspecificationparent.create({
      data: {
        name,
        slug: slugify(name),
        updatedBy: session.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[DYNAMIC_PARENT_SPEC_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request) {
  try {

    const parentspec = await prismadb.dynamicspecificationparent.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(parentspec);
  } catch (error) {
    console.log('[DYNAMIC_PARENT_SPEC_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
