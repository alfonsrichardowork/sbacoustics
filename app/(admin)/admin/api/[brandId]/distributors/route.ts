import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }
    const session = await getSession();

    if(!session.isLoggedIn || !session){
      return NextResponse.json("expired_session")
    }
    
    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    const body = await req.json();

    const { 
      name,
      country,
      phone,
      email,
      website,
      facebook,
      instagram,
      lat,
      lng,
      continent,
      address
     } = body;
    
    const duplicates = await prismadb.distributors.findFirst({
      where:{
        name,
        brandId: params.brandId
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    await prismadb.distributors.create({
        data: {
            name,
            brandId: params.brandId,
            country,
            phone,
            email,
            website,
            facebook,
            instagram,
            lat,
            lng,
            continent,
            address,
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedBy: session.name
        }
    });

    revalidatePath('/sbaudience/distributors') && revalidatePath('/sbautomotive/distributors') && revalidatePath('/distributors');
    return NextResponse.json("success");
  } catch (error) {
    console.log('[NEW_DISTRIBUTOR_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(req: Request) {
  try {
    const distributor = await prismadb.distributors.findMany({    
    });
  
    return NextResponse.json(distributor);
  } catch (error) {
    console.log('[DISTRIBUTOR_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};