import { checkBearerAPI, getSession } from "@/lib/actions";
import prismadb from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  props: { params: Promise<{ brandId: string, productId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn){
      return NextResponse.json("expired_session")
    }

    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    await prismadb.multipledatasheetproduct.deleteMany({
      where:{
        productId: params.productId
      }
    });

    const body = await req.json();
    if(body.length!==0){
      const updatedmultipledatasheet = await prismadb.multipledatasheetproduct.createMany({
        data: [
          ...body.map((data: { name: string, url: string }) => ({
            name: data.name,
            url: data.url,
            productId: params.productId
          })),
        ],
      });

      const updatedProduct = await prismadb.product.update({
        where:{
          id: params.productId,
          brandId: params.brandId
        },
        data: {
          updatedBy: session.name,
          updatedAt: new Date()
        }
      });

      revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/products/${updatedProduct.slug}`);
      return NextResponse.json(updatedmultipledatasheet);
    }
    return NextResponse.json('');
    
  } catch (error) {
    console.log('[MULTIPLE_DATASHEET_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, productId: string }> }
) {
  const params = await props.params;
  try {
    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    const all_multiple_datasheet = await prismadb.multipledatasheetproduct.findMany({
      where: {
        productId: params.productId
      }
    });
    return NextResponse.json(all_multiple_datasheet);
  } catch (error) {
    console.log('[MULTIPLE_DATASHEET_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

  
