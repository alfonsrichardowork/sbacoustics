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

    await prismadb.similarproducts.deleteMany({
      where:{
        productId: params.productId
      }
    });

    const body = await req.json();
    if(body.length!==0){
      const updatedSimilarprod = await prismadb.similarproducts.createMany({
        data: [
          ...body.map((data: { productId: string, similarProductId: string }) => ({
            productId: params.productId,
            similarProductId: data.similarProductId
          })),
        ],
      });
      
      const updatedProduct = await prismadb.product.update({
        where: {
          id : params.productId,
          brandId: params.brandId
        },
        data: {
          updatedAt: new Date(),
          updatedBy: session.name
        }
      });
      
      revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/products/${updatedProduct.slug}`);
      return NextResponse.json(updatedSimilarprod);
    }
    return NextResponse.json('');
    
  } catch (error) {
    console.log('[SIMILAR_PRODUCTS_POST]', error);
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

    const all_similar = await prismadb.similarproducts.findMany({
      where: {
        productId: params.productId
      }
    });
    return NextResponse.json(all_similar);
  } catch (error) {
    console.log('[SIMILAR_PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

  
