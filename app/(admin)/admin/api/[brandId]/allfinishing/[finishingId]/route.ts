import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, finishingId: string }> }
) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const finishing = await prismadb.allfinishing.findMany({
      where: {
        id: params.finishingId
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(finishing);
  } catch (error) {
    console.log('[SINGLE_FINISHING_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ finishingId: string, brandId: string }> }
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

    const { name, url } = body;

    if (!params.finishingId) {
      return new NextResponse("Finishing id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    



    if(params.finishingId != 'new'){
      const oldUrl = await prismadb.allfinishing.findMany({
        where: {
          id: params.finishingId
        },
        select:{
          url: true
        }
      })
      //Delete physical files
      if(oldUrl && oldUrl.length > 0) {
        oldUrl.map( async (val) => {

          if(val.url != url) {
            const finishingImagePath = path.join(process.cwd(), val.url);
            try {
              await fs.unlink(finishingImagePath);
            } catch (error) {
              console.warn(`Could not delete image ${val.url}:`, error);
            }
          }
           
        })
      }

      await prismadb.allfinishing.update({
        where: {
          id: params.finishingId
        },
        data: {
          name,
          url,
          updatedAt: new Date(),
          updatedBy: session.name,
        },
      })

    }
    else{

      const duplicates = await prismadb.allfinishing.findFirst({
        where:{
          name
        }
      })

      if(duplicates){
        return NextResponse.json("duplicate")
      }

      await prismadb.allfinishing.create({
        data: {
          name,
          url,
          updatedAt: new Date(),
          createdAt: new Date(),
          updatedBy: session.name,
        },
      })
    }

    revalidatePath('/')
    return NextResponse.json("success");
  } catch (error) {
    console.log('[FINISHING_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
  

  export async function DELETE(
    req: Request,
    props: { params: Promise<{ brandId: string, finishingId: string }> }
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
  
      if (!params.finishingId) {
        return new NextResponse("Finishing id is required", { status: 400 });
      }
      
      if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
        return NextResponse.json("unauthorized");
      }    

      const toBeDeleted = await prismadb.allfinishing.findMany({
        where:{
          id: params.finishingId
        }
      })

      if (toBeDeleted) {
        toBeDeleted.map( async (val) => {
          const imagePath = path.join(process.cwd(), val.url);

          try {
            await fs.unlink(imagePath);
          } catch (error) {
            console.warn(`Could not delete image ${val.url}:`, error);
          }
        })
      }
        
      const deleted = await prismadb.allfinishing.deleteMany({
        where: {
          id: params.finishingId
        },
      });
  
      return NextResponse.json(deleted);
    } catch (error) {
      console.log('[FINISHING_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  