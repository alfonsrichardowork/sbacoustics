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
   


    // await prismadb.menuPriority.deleteMany();
    
    // Group by categoryId and reassign priorityNumber
    interface GroupedProducts {
      [categoryId: string]: PriorityMenu[];
    }

    const grouped: GroupedProducts = temp.reduce(
      (acc: GroupedProducts, product: PriorityMenu) => {
        if (!acc[product.categoryId]) acc[product.categoryId] = [];
        acc[product.categoryId]?.push(product);
        return acc;
      },
      {} as GroupedProducts
    );

    // Now reassign priority numbers for each group
    const renumbered = Object.values(grouped).flatMap(group => {
      return group.map((product, index: number) => ({
        ...product,
        priority: index + 1, // 1-based numbering
      }));
    });

    // Insert into DB
    await Promise.all(
      renumbered.map(product =>
        product.priorityId === '' ?
          prismadb.menupriority.create({
            data: {
              productId: product.productId,
              priorityNumber: product.priority.toString(),
              categoryId: product.categoryId,
              updatedAt: new Date(),
            },
          })
          :
          prismadb.menupriority.update({
            where: {
              id: product.priorityId
            },
            data: {
              productId: product.productId,
              priorityNumber: product.priority.toString(),
              categoryId: product.categoryId,
              updatedAt: new Date(),
            },
          })
      )
    );

    revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}`);
    return NextResponse.json("success");
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
