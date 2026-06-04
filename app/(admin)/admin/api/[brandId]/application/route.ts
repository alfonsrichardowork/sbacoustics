import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { image_catalogues, multipledatasheetproduct } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote?.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  const strWithoutSatori = strBeforeSlash?.replace(/SATORI/gi, '');
  return strWithoutSatori?.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '') ?? '';
};

export async function POST(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
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

    const { name, author, description, images_catalogues, cover_img_url, datasheet } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const duplicates = await prismadb.sbaudienceapplication.findFirst({
      where:{
        name,
        brandId: params.brandId
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    const app = await prismadb.sbaudienceapplication.create({
      data: {
        name,
        author,
        cover_img_url,
        slug: slugify(name),
        description,
        updatedBy: session.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        brandId: params.brandId,
      },
    });

    if(images_catalogues.length!=0){
      images_catalogues.map(async (value: image_catalogues) => {
        if(value.url!=''){
          await prismadb.image_catalogues.create({
            data:{
              productId: '',
              applicationId: app.id,
              url:value.url,
              name: value.name,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      })
    }

    if(datasheet.length!=0){
      datasheet.map(async (datasheet: multipledatasheetproduct) => {
        if(datasheet.url!=''){
          await prismadb.multipledatasheetproduct.create({
            data:{
              applicationId: app.id,
              productId: '',
              url:datasheet.url,
              name: datasheet.name
            }
          })
        }
      })
    }
    

    revalidatePath(`/sbaudience/application/${app.slug}`);
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[APPLICATION_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const app = await prismadb.sbaudienceapplication.findMany({
      where: {
        brandId: params.brandId,
      },
      include: {
        images_catalogues: true,
        datasheet: true
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(app);
  } catch (error) {
    console.log('[APPLICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
