import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import path from 'path';
import fs from 'fs/promises';

const slugify = (str: string): string => str.toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');

export async function GET(req: Request, props: { params: Promise<{ brandId: string, subSubCategoryId: string }> }) {
  const params = await props.params;
  try {
    if (!params.subSubCategoryId) {
      return new NextResponse("Sub Sub Category id is required", { status: 400 });
    }

    const subsubCategory = await prismadb.allcategory.findUnique({
      where: {
        id: params.subSubCategoryId,
        type: "Sub Sub Category",
        brandId: params.brandId
      }
    });
  
    return NextResponse.json(subsubCategory);
  } catch (error) {
    console.log('[SUB_SUB_CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ subSubCategoryId: string, brandId: string }> }
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

    if (!params.subSubCategoryId) {
      return new NextResponse("Sub Sub Category id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const stillused = await prismadb.allproductcategory.findMany({
      where:{
        categoryId: params.subSubCategoryId,
        category: {
          type: "Sub Sub Category"
        }
      }
    })

    if(stillused.length!=0){
      return NextResponse.json("stillused")
    }

    const cat = await prismadb.allcategory.findMany({
      where: {
        type: 'Category',
        brandId: params.brandId
      }
    })
    const subcat = await prismadb.allcategory.findMany({
      where: {
        type: 'Sub Category',
        brandId: params.brandId
      }
    })
    const deletedSubSubCat = await prismadb.allcategory.findFirst({
      where: {
        id: params.subSubCategoryId,
        brandId: params.brandId
      }
    })

    if(deletedSubSubCat){
      const thumbnailImgPath = path.join(process.cwd(), deletedSubSubCat.thumbnail_url);
      try {
        await fs.unlink(thumbnailImgPath);
      } catch (error) {
        console.warn(`Could not delete file ${deletedSubSubCat.thumbnail_url}:`, error);
      }
    }

    cat && cat.length > 0 && subcat && subcat.length > 0 && deletedSubSubCat && 
    (
      cat.map((val) => 
        subcat.map((subval) =>
      revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/${val.slug}/${subval.slug}/${deletedSubSubCat.slug}`)
      )))

    await prismadb.allcategory.deleteMany({
      where: {
        id: params.subSubCategoryId,
        brandId: params.brandId
      }
    });
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SUB_SUB_CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ subSubCategoryId: string, brandId: string }> }
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

    const { type, name, description, thumbnail_url, shown_on_all_drivers_page } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.subSubCategoryId) {
      return new NextResponse("Sub Sub Category id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const initial = await prismadb.allcategory.findFirst({
      where:{
        id: params.subSubCategoryId,
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
        const updatedSubSubCat = await prismadb.allcategory.update({
          where: {
            id: params.subSubCategoryId,
            brandId: params.brandId
          },
          data: {
            type,
            name,
            slug: slugify(name),
            description,
            thumbnail_url,
            shown_on_all_drivers_page,
            updatedAt: new Date(),
            updatedBy: session.name,
          }
        });

        await prismadb.allproductcategory.updateMany({
          where: {
            categoryId: params.subSubCategoryId,
            category: {
              type: "Sub Sub Category"
            }
          },
          data:{
            updatedAt: new Date(),
          }
        })

        const cat = await prismadb.allcategory.findMany({
          where: {
            type: 'Category',
            brandId: params.brandId
          }
        })
        const subcat = await prismadb.allcategory.findMany({
          where: {
            type: 'Sub Category',
            brandId: params.brandId
          }
        })

        cat && cat.length > 0 && subcat && subcat.length > 0 && updatedSubSubCat && 
        (
          cat.map((val) => 
            subcat.map((subval) =>
          revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/${val.slug}/${subval.slug}/${updatedSubSubCat.slug}`)
          )))
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

    const updatedSubSubCat = await prismadb.allcategory.update({
      where: {
        id: params.subSubCategoryId,
        brandId: params.brandId
      },
      data: {
        type,
        name,
        slug: slugify(name),
        description,
        thumbnail_url,
        shown_on_all_drivers_page,
        updatedAt: new Date(),
        updatedBy: session.name,
      }
    });
    await prismadb.allproductcategory.updateMany({
      where: {
        categoryId: params.subSubCategoryId,
        category: {
          type
        }
      },
      data:{
        updatedAt: new Date(),
      }
    })

    const cat = await prismadb.allcategory.findMany({
      where: {
        type: 'Category',
        brandId: params.brandId
      }
    })
    const subcat = await prismadb.allcategory.findMany({
      where: {
        type: 'Sub Category',
        brandId: params.brandId
      }
    })

    cat && cat.length > 0 && subcat && subcat.length > 0 && updatedSubSubCat && 
    (
      cat.map((val) => 
        subcat.map((subval) =>
      revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/${val.slug}/${subval.slug}/${updatedSubSubCat.slug}`)
    )))
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SUB_SUB_CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
