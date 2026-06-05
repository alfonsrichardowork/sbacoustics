import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';

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


    if (!body) {
      return new NextResponse("No Data", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }
   
    await Promise.all(
        body.map( async (val : any) =>
            await prismadb.allcategory.update({
                where: {
                    id: val.categoryId
                },
                data: {
                    priority: val.priority,
                    updatedAt: new Date(),
                    updatedBy: session.name
                }
            })
        )
    );

    revalidatePath(`/`);
    revalidatePath(`/en`);
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SPEC_PRIORITY_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
