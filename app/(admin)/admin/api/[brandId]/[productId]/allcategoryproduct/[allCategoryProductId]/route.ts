import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function GET(req: Request, props: { params: Promise<{ allCategoryProductId: string }> }) {
  const params = await props.params;
  try {
    if (!params.allCategoryProductId) {
      return new NextResponse("All Category Product id is required", { status: 400 });
    }

    const allproductcategory = await prismadb.allproductcategory.findUnique({
      where: {
        id: params.allCategoryProductId
      },
      include:{
        category: true
      }
    });
    return NextResponse.json(allproductcategory);
  } catch (error) {
    console.log('[ALL_PRODUCT_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ allCategoryProductId: string, brandId: string }> }
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

    if (!params.allCategoryProductId) {
      return new NextResponse("All Category Product id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }

    const allcategoryproduct = await prismadb.allproductcategory.deleteMany({
      where: {
        id: params.allCategoryProductId
      }
    });
  
    return NextResponse.json(allcategoryproduct);
  } catch (error) {
    console.log('[ALL_PRODUCT_CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ productId: string, brandId: string, allCategoryProductId: string }> }
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

    const { 
      categoryId,
      type,
      name,
      slug
     } = body;


    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }
    
    const allcategoryproduct = await prismadb.allproductcategory.update({
      where: {
        id : params.allCategoryProductId
      },
      data: {
        categoryId,
        productId: params.productId,
        updatedAt: new Date()
      }
    });

    if( type === "Sub Category" ){
        revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/drivers/${slug}`);
      }
      else if( type === "Sub Sub Category" ){ 
        const allSub = await prismadb.allproductcategory.findMany({
          where:{
            category: {
              type: "Sub Category",
            }
          },
          include:{
            category: true
          }
        })
        allSub && allSub.length > 0 && allSub.forEach(sub => {
          revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/drivers/${sub.category.slug}/${slug}`);
        });
      }

    const updatedproduct = await prismadb.product.update({
      where: {
        id : params.productId,
        brandId: params.brandId
      },
      data: {
        updatedAt: new Date(),
        updatedBy: session.name
      }
    });

    const responseData = {
      allcategoryproduct,
      updatedproduct
  };
    return NextResponse.json(responseData);
  } catch (error) {
    console.log('[ALL_CATEGORY_PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
