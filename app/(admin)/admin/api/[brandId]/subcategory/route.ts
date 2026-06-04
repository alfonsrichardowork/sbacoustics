import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { revalidatePath } from 'next/cache';
 
const slugify = (str: string): string => str.toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');

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

    const { name, description, type, thumbnail_url } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized")
    }    

    const duplicates = await prismadb.allcategory.findFirst({
      where:{
        brandId: params.brandId,
        name,
        type
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    const createdSubCat = await prismadb.allcategory.create({
      data: {
        name,
        description,
        brandId: params.brandId,
        type,
        slug: slugify(name),
        thumbnail_url,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: session.name,
      }
    });

    const cat = await prismadb.allcategory.findMany({
      where: {
        type: 'Category',
        brandId: params.brandId
      }
    })
    cat && cat.length > 0 && createdSubCat && 
    (
      cat.map((val) => 
      revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/${val.slug}/${createdSubCat.slug}`)
    ))
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SUB_CATEGORY_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const subcategories = await prismadb.allcategory.findMany({
      where: {
        brandId: params.brandId,
        type: "Sub Category"
      }
    });
  
    return NextResponse.json(subcategories);
  } catch (error) {
    console.log('[SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};