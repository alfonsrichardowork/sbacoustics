import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import path from 'path';
import fs from 'fs/promises';

const slugify = (str: string): string => str.toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');

export async function GET(req: Request, props: { params: Promise<{ brandId: string, categoryId: string }> }) {
  const params = await props.params;
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const Category = await prismadb.allcategory.findUnique({
      where: {
        id: params.categoryId,
        type: "Category",
        brandId: params.brandId
      }
    });
  
    return NextResponse.json(Category);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ categoryId: string, brandId: string }> }
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

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }   

    const stillused = await prismadb.allproductcategory.findMany({
      where:{
        categoryId: params.categoryId,
        category:{
          type: "Category"
        }
      },
      include:{
        category: true
      }
    })

    if(stillused.length!=0){
      return NextResponse.json("stillused")
    }

    const deletedSubCat = await prismadb.allcategory.findFirst({
      where: {
        id: params.categoryId,
        brandId: params.brandId
      }
    })
    
    if(deletedSubCat){
      const thumbnailImgPath = path.join(process.cwd(), deletedSubCat.thumbnail_url);
      try {
        await fs.unlink(thumbnailImgPath);
      } catch (error) {
        console.warn(`Could not delete file ${deletedSubCat.thumbnail_url}:`, error);
      }
      revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}${deletedSubCat.slug}`);
    }

    await prismadb.allcategory.deleteMany({
      where: {
        id: params.categoryId,
        brandId: params.brandId
      }
    });
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ categoryId: string, brandId: string }> }
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

    const { type, name, description, thumbnail_url } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const initial = await prismadb.allcategory.findFirst({
      where:{
        id: params.categoryId,
        brandId: params.brandId
      },
      select:{
        name: true,
        thumbnail_url: true
      }
    })

    if(initial){
      if(initial.thumbnail_url && initial.thumbnail_url !== thumbnail_url) {
        const ImgPath = path.join(process.cwd(), initial.thumbnail_url);
        try {
          await fs.unlink(ImgPath);
        } catch (error) {
          console.warn(`Could not delete file ${initial.thumbnail_url}:`, error);
        }
      }
      if(initial.name ===  name){
        await prismadb.allcategory.update({
          where: {
            id: params.categoryId,
            brandId: params.brandId
          },
          data: {
            type,
            name,
            slug: slugify(name),
            description,
            thumbnail_url,
            updatedAt: new Date(),
            updatedBy: session.name,
          }
        });

        await prismadb.allproductcategory.updateMany({
          where: {
            categoryId: params.categoryId,
            category: {
              type
            }
          },
          data:{
            updatedAt: new Date(),
          }
        })
        return NextResponse.json("same")
      }
    }

    const duplicates = await prismadb.allcategory.findFirst({
      where:{
        name,
        type,
        brandId: params.brandId
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    const updatedCat = await prismadb.allcategory.update({
      where: {
        id: params.categoryId,
        brandId: params.brandId
      },
      data: {
        type,
        name,
        slug: slugify(name),
        description,
        thumbnail_url,
        updatedAt: new Date(),
        updatedBy: session.name,
      }
    });
    
    await prismadb.allproductcategory.updateMany({
      where: {
        categoryId: params.categoryId,
        category: {
          type,
        }
      },
      data:{
        updatedAt: new Date(),
      }
    })

    
    revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/${updatedCat.slug}`);
    return NextResponse.json("success");
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
