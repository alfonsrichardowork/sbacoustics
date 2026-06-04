import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { PriorityMenu } from '@/app/(frontend)/types';
import { revalidatePath } from 'next/cache';

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
    const temp = body; // Since the `temp` array was sent directly, it is the body


    if (!temp) {
      return new NextResponse("No Data", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }
   
    await Promise.all(
      temp.map((priority: PriorityMenu) =>
        priority.menuType === 'Parent' ?
          prismadb.dynamicspecificationparent.update({
            where: {
              id: priority.productId
            },
            data: {
              updatedAt: new Date(),
              updatedBy: session.userId,
              priority: priority.priority.toString()
            },
          })
        : 
        priority.menuType === 'SubParent' ?
          prismadb.dynamicspecificationsubparent.update({
            where: {
              id: priority.productId
            },
            data: {
              updatedAt: new Date(),
              updatedBy: session.userId,
              priority: priority.priority.toString()
            },
          })
        :
        priority.menuType === 'Child' ?
          prismadb.dynamicspecification.update({
            where: {
              id: priority.productId
            },
            data: {
              updatedAt: new Date(),
              updatedBy: session.userId,
              priority: priority.priority.toString()
            },
          })
        :
        null
      )
    );

    // revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}`);
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SPEC_PRIORITY_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
