import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/actions';

export async function POST(
  req: Request,
) {
  try {
    const session = await getSession();

    if(!session.isLoggedIn){
      redirect("/admin")
    }
    const body = await req.json();

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!session.isLoggedIn) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const brand = await prismadb.brand.create({
      data: {
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: session.userId!,
      }
    });
  
    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRANDS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {
    const session = await getSession();

    if(!session.isLoggedIn){
      redirect("/admin")
    }
    
    const brand = await prismadb.brand.findMany({});
  
    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRANDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
