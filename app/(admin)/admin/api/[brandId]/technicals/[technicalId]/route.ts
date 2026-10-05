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
        id: params.technicalId,
        brandId: params.brandId
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
    const requestedPriority = priority ?? '';

    if (
      typeof requestedPriority !== 'string' ||
      (requestedPriority !== '' &&
        (!/^[1-9]\d*$/.test(requestedPriority) ||
          !Number.isSafeInteger(Number(requestedPriority))))
    ) {
      return new NextResponse("Priority must be a positive whole number", { status: 400 });
    }

    if (!params.technicalId) {
      return new NextResponse("Technical id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }

    const result = await prismadb.$transaction(async (transaction) => {
      let previousPDF = '';
      let technicalId = params.technicalId;
      const existingTechnicals = await transaction.technicals.findMany({
        where: { brandId: params.brandId },
        select: { id: true, priority: true, updatedAt: true, pdf: true },
      });

      if (params.technicalId !== 'new') {
        const existingTechnical = existingTechnicals.find(
          (technical) => technical.id === params.technicalId
        );

        if (!existingTechnical) {
          throw new Error('Technical not found');
        }

        previousPDF = existingTechnical.pdf;
        await transaction.technicals.update({
          where: {
            id: existingTechnical.id,
          },
          data: {
            name,
            desc,
            pdf,
            pdfname,
            updatedAt: new Date(),
            updatedBy: session.name,
          },
        });
      } else {
        const duplicate = await transaction.technicals.findFirst({
          where: {
            brandId: params.brandId,
            name,
          },
          select: { id: true },
        });

        if (duplicate) return { duplicate: true, previousPDF: '' };

        const createdTechnical = await transaction.technicals.create({
          data: {
            brandId: params.brandId,
            name,
            desc,
            pdf,
            pdfname,
            priority: '',
            updatedAt: new Date(),
            createdAt: new Date(),
            updatedBy: session.name,
          },
          select: { id: true },
        });
        technicalId = createdTechnical.id;
      }

      const rankedTechnicals = existingTechnicals
        .filter((technical) => /^[1-9]\d*$/.test(technical.priority))
        .map(({ id, priority, updatedAt }) => ({ id, priority, updatedAt }))
        .sort((a, b) =>
          Number(a.priority) - Number(b.priority) ||
          a.updatedAt.getTime() - b.updatedAt.getTime() ||
          a.id.localeCompare(b.id)
        );
      const existingIndex = rankedTechnicals.findIndex(
        (technical) => technical.id === technicalId
      );
      if (existingIndex !== -1) rankedTechnicals.splice(existingIndex, 1);

      if (requestedPriority !== '') {
        const targetIndex = Math.min(
          Number(requestedPriority) - 1,
          rankedTechnicals.length
        );
        rankedTechnicals.splice(targetIndex, 0, {
          id: technicalId,
          priority: requestedPriority,
          updatedAt: new Date(),
        });
      }

      await Promise.all(
        rankedTechnicals.map((technical, index) =>
          transaction.technicals.update({
            where: { id: technical.id },
            data: { priority: String(index + 1) },
          })
        )
      );

      return { duplicate: false, previousPDF };
    });

    if (result.duplicate) return NextResponse.json("duplicate");

    if (
      result.previousPDF &&
      result.previousPDF !== pdf &&
      result.previousPDF.startsWith(uploadsprefix)
    ) {
      const filename = result.previousPDF.slice(uploadsprefix.length);
      const filePath = path.join(process.cwd(), 'uploads', filename);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Could not delete file ${result.previousPDF}:`, error);
      }
    }

    revalidatePath('/technical')
    revalidatePath('/sbaudience/technical')
    revalidatePath('/sbautomotive/technical')
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
          id: params.technicalId,
          brandId: params.brandId
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
  