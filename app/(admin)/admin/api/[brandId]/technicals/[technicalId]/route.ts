import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { checkAuth, checkBearerAPI, getSession } from '@/lib/actions';
import { uploadsprefix } from '@/app/(admin)/admin/lib';

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, technicalId: string }> }
) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const technical = await prismadb.technicals.findMany({
      where: {
        id: params.technicalId
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(technical);
  } catch (error) {
    console.log('[SINGLE_TECHNICAL_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ technicalId: string, brandId: string }> }
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

    const { name, desc, pdf, pdfname, priority } = body;

    if (!params.technicalId) {
      return new NextResponse("Technical id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    



    if(params.technicalId != 'new'){
      const oldUrl = await prismadb.technicals.findMany({
        where: {
          id: params.technicalId
        },
        select:{
          pdf: true
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
        })
      }

      await prismadb.technicals.update({
        where: {
          id: params.technicalId
        },
        data: {
          brandId: params.brandId,
          name, 
          desc, 
          pdf, 
          pdfname,
          priority,
          updatedAt: new Date(),
          updatedBy: session.name,
        },
      })

    }
    else{

      const duplicates = await prismadb.technicals.findFirst({
        where:{
          name
        }
      })

      if(duplicates){
        return NextResponse.json("duplicate")
      }

      await prismadb.technicals.create({
        data: {
          brandId: params.brandId,
          name, 
          desc, 
          pdf, 
          pdfname,
          priority,
          updatedAt: new Date(),
          createdAt: new Date(),
          updatedBy: session.name,
        },
      })
    }

    revalidatePath('/technical')
    return NextResponse.json("success");
  } catch (error) {
    console.log('[TECHNICAL_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
  

  export async function DELETE(
    req: Request,
    props: { params: Promise<{ brandId: string, technicalId: string }> }
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
  
      if (!params.technicalId) {
        return new NextResponse("Technical id is required", { status: 400 });
      }
      
      if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
        return NextResponse.json("unauthorized");
      }    

      const toBeDeleted = await prismadb.technicals.findMany({
        where:{
          id: params.technicalId
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
        })
      }
        
      const deleted = await prismadb.technicals.deleteMany({
        where: {
          id: params.technicalId
        },
      });
  
      return NextResponse.json(deleted);
    } catch (error) {
      console.log('[TECHNICAL_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  