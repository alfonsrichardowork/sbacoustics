import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { uploadsprefix } from '@/app/(admin)/admin/lib';

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, catalogueId: string }> }
) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const catalogue = await prismadb.catalogues.findMany({
      where: {
        id: params.catalogueId
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(catalogue);
  } catch (error) {
    console.log('[SINGLE_CATALOGUE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ catalogueId: string, brandId: string }> }
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

    const { cover, pdf, pdfname } = body;

    if (!params.catalogueId) {
      return new NextResponse("Catalogue id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    



    if(params.catalogueId != 'new'){
      const oldUrl = await prismadb.catalogues.findMany({
        where: {
          id: params.catalogueId
        },
        select:{
          pdf: true,
          cover: true
        }
      })
      //Delete physical files
      if(oldUrl && oldUrl.length > 0) {
        oldUrl.map( async (val) => {
          if(val.pdf != pdf) {
            if(val.pdf.startsWith(uploadsprefix)){
              const filename = val.pdf.slice(uploadsprefix.length)
              // if (filename && path.basename(filename) === filename) {
                const imgPath = path.join(process.cwd(), 'uploads', filename);
                try {
                  await fs.unlink(imgPath);
                } catch (error) {
                  console.warn(`Could not delete file ${val.pdf}:`, error);
                } 
              // }
            }
            else{
              console.warn(`Not inside uploads folder`);
            }
          }

          if(val.cover != cover) {
            if(val.cover.startsWith(uploadsprefix)){
              const filename = val.cover.slice(uploadsprefix.length)
              // if (filename && path.basename(filename) === filename) {
                const imgPath = path.join(process.cwd(), 'uploads', filename);
                try {
                  await fs.unlink(imgPath);
                } catch (error) {
                  console.warn(`Could not delete file ${val.cover}:`, error);
                } 
              // }
            }
            else{
              console.warn(`Not inside uploads folder`);
            }
          }
           
        })
      }

      await prismadb.catalogues.update({
        where: {
          id: params.catalogueId
        },
        data: {
          cover,
          pdf,
          pdfname,
          updatedAt: new Date(),
          updatedBy: session.name,
        },
      })

    }
    else{

      const duplicates = await prismadb.catalogues.findFirst({
        where:{
          pdfname
        }
      })

      if(duplicates){
        return NextResponse.json("duplicate")
      }

      await prismadb.catalogues.create({
        data: {
          cover,
          pdf,
          pdfname,
          updatedAt: new Date(),
          createdAt: new Date(),
          updatedBy: session.name,
        },
      })
    }

    revalidatePath('/catalogues')
    return NextResponse.json("success");
  } catch (error) {
    console.log('[CATALOGUE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
  

  export async function DELETE(
    req: Request,
    props: { params: Promise<{ brandId: string, catalogueId: string }> }
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
  
      if (!params.catalogueId) {
        return new NextResponse("Catalogue id is required", { status: 400 });
      }
      
      if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
        return NextResponse.json("unauthorized");
      }    

      const toBeDeleted = await prismadb.catalogues.findMany({
        where:{
          id: params.catalogueId
        }
      })

      if (toBeDeleted) {
        toBeDeleted.map( async (val) => {
          if(val.pdf.startsWith(uploadsprefix)){
            const filename = val.pdf.slice(uploadsprefix.length)
            // if (filename && path.basename(filename) === filename) {
              const imgPath = path.join(process.cwd(), 'uploads', filename);
              try {
                await fs.unlink(imgPath);
              } catch (error) {
                console.warn(`Could not delete file ${val.pdf}:`, error);
              } 
            // }
          }
          else{
            console.warn(`Not inside uploads folder`);
          }

          
          if(val.cover.startsWith(uploadsprefix)){
            const filename = val.cover.slice(uploadsprefix.length)
            // if (filename && path.basename(filename) === filename) {
              const imgPath = path.join(process.cwd(), 'uploads', filename);
              try {
                await fs.unlink(imgPath);
              } catch (error) {
                console.warn(`Could not delete file ${val.cover}:`, error);
              } 
            // }
          }
          else{
            console.warn(`Not inside uploads folder`);
          }
        })
      }
        
      const deleted = await prismadb.catalogues.deleteMany({
        where: {
          id: params.catalogueId
        },
      });
  
      return NextResponse.json(deleted);
    } catch (error) {
      console.log('[CATALOGUE_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  