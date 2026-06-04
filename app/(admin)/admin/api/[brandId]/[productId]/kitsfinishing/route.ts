import { checkBearerAPI, getSession } from "@/lib/actions";
import prismadb from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs/promises';

type KitsFinishingRow = {
  id: string
  finishingId: string
  productId: string
  url: string
  order: number
}

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

    const body = await req.json();

    const rows: KitsFinishingRow[] = body.map((data: KitsFinishingRow) => ({
      id: data.id,
      finishingId: data.finishingId,
      productId: data.productId,
      url: data.url,
      order: data.order
      
    }))
    const newUrls = new Set(rows.map(row => row.url))

    const coverImages = await prismadb.kitsfinishing.findMany({
      where: {
        productId: params.productId,
      },
      select: {
        url: true
      }
    });

    for (const image of coverImages) {
      if (!newUrls.has(image.url)) {
        const imagePath = path.join(process.cwd(), image.url);

        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.warn(`Could not delete file ${image.url}:`, error);
        }
      }
    }
    await prismadb.kitsfinishing.deleteMany({
      where:{
        productId: params.productId
      }
    });

    console.log("rows: ", rows)

    if(body.length!==0){
      const updatedFinishing = await prismadb.kitsfinishing.createMany({
        data: rows.map(row => ({
          ...row,
          productId: params.productId,
        })),
      })

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
      return NextResponse.json(updatedFinishing);
    }
    return NextResponse.json('');
  } catch (error) {
    console.log('[KITS_FINISHING_POST]', error);
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

    const all_kits_finishing = await prismadb.kitsfinishing.findMany({
      where: {
        productId: params.productId
      }
    });
    return NextResponse.json(all_kits_finishing);
  } catch (error) {
    console.log('[SPECIFICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

  
