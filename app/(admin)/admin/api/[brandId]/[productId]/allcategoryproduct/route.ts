import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { revalidatePath } from 'next/cache';

export async function POST(
  req: Request,
  props: { params: Promise<{ brandId: string, productId: string }> }
) {
  const params = await props.params;
  const allResults = [];
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
    
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }

    let isKitsCounter = 0
    const kitsId = process.env.NEXT_PUBLIC_KITS_CATEGORY_ID ?? ''

    for (const item of body) {
      const { 
        id,
        brandId,
        type,
        name,
        slug,
        description,
        thumbnail_url,
        createdAt,
        updatedAt
      } = item;
      
      kitsId === id && isKitsCounter++
    
      const allproductcategory = await prismadb.allproductcategory.create({
        data: {
          productId: params.productId,
          categoryId: id,
          createdAt,
          updatedAt,
        }
      });
      allResults.push(allproductcategory);


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
    }

    await prismadb.product.update({
      where: {
        id : params.productId,
        brandId: params.brandId
      },
      data: {
        updatedAt: new Date(),
        updatedBy: session.name,
        isKits: isKitsCounter > 0
      }
    });
    
    

    return NextResponse.json("success");
  } catch (error) {
    console.log('[ALL_PRODUCT_CATEGORY_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
  // return NextResponse.json(allproductcategory);
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

    const allProductCategory = await prismadb.allproductcategory.findMany({
      where: {
        productId: params.productId
      },
      include:{
        category: true
      }
    });
    return NextResponse.json(allProductCategory);
  } catch (error) {
    console.log('[ALL_PRODUCT_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ brandId: string, productId: string }> }
) {
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

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }

    const allproductcategory = await prismadb.allproductcategory.deleteMany({
      where: {
        productId: params.productId
      }
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
  
    return NextResponse.json(allproductcategory);
  } catch (error) {
    console.log('[ALL_PRODUCT_CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ brandId: string, productId: string }> }
) {
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

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }

    const deleteOldCategories = await prismadb.allproductcategory.deleteMany({
      where: {
        productId: params.productId
      }
    });

    let isKitsCounter = 0
    const kitsId = process.env.NEXT_PUBLIC_KITS_CATEGORY_ID ?? ''
  
    const allResults = []
    for (const item of body) {
      const { 
        id,
        brandId,
        type,
        name,
        slug,
        description,
        thumbnail_url,
        createdAt,
        updatedAt
      } = item;

      kitsId === id && isKitsCounter++
      
      const allproductcategory = await prismadb.allproductcategory.create({
        data: {
          productId: params.productId,
          categoryId: id,
          createdAt,
          updatedAt
        }
      });
      allResults.push(allproductcategory);

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
          include: {
            category: true
          }
        })
        allSub && allSub.length > 0 && allSub.forEach(sub => {
          revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/drivers/${sub.category.slug}/${slug}`);
        });
      }
    }



    const updatedproduct = await prismadb.product.update({
      where: {
        id : params.productId,
        brandId: params.brandId
      },
      data: {
        updatedAt: new Date(),
        updatedBy: session.name,
        isKits: isKitsCounter > 0
      }
    });
  
    const responseData = {
      deletedCount: deleteOldCategories.count,
      addedRecords: allResults,
      updatedTime: updatedproduct
    };


    return NextResponse.json(responseData);
  } catch (error) {
    console.log('[ALL_CATEGORY_PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

