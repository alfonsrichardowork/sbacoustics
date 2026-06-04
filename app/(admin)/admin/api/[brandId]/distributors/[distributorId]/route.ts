import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import { revalidatePath } from "next/cache";

export async function GET(req: Request, props: { params: Promise<{ brandId: string, distributorId: string }> }) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    if (!params.distributorId) {
      return new NextResponse("Distributor id is required", { status: 400 });
    }

    const distributor = await prismadb.distributors.findUnique({
      where: {
        id: params.distributorId,
        brandId: params.brandId
      }
    });
  
    return NextResponse.json(distributor);
  } catch (error) {
    console.log('[SINGLE_DISTRIBUTOR_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ brandId: string, distributorId: string }> }
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

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    if (!params.distributorId) {
      return new NextResponse("Distributor id is required", { status: 400 });
    }

    await prismadb.distributors.deleteMany({
      where: {
        id: params.distributorId,
      }
    });

    revalidatePath('/sbaudience/distributors') && revalidatePath('/sbautomotive/distributors') && revalidatePath('/distributors');

    return NextResponse.json("success delete");
  } catch (error) {
    console.log('[DISTRIBUTOR_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ brandId: string, distributorId: string }> }
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

    const { 
      name,
      country,
      phone,
      email,
      website,
      facebook,
      instagram,
      lat,
      lng,
      continent,
      address
     } = body;

    if (!params.distributorId) {
      return new NextResponse("Distributor id is required", { status: 400 });
    }

    const initial = await prismadb.distributors.findFirst({
      where:{
        id: params.distributorId,
      }
    })

    if(initial){

      const duplicate = await prismadb.distributors.findFirst({
        where: {
          name,
          brandId: params.brandId,
          id: {
            not: initial.id,
          },
        },
      });

      if (duplicate) {
        return NextResponse.json("duplicate", { status: 400 });
      }
      
      await prismadb.distributors.update({
        where: {
          id: params.distributorId,
        },
        data: {
          name,
          brandId: params.brandId,
          country,
          phone,
          email,
          website,
          facebook,
          instagram,
          lat,
          lng,
          continent,
          address,
          updatedAt: new Date(),
          updatedBy: session.name
        }
      });
      revalidatePath('/sbaudience/distributors') && revalidatePath('/sbautomotive/distributors') && revalidatePath('/distributors');
      return NextResponse.json("update existing")
    }
    else{
      const duplicates = await prismadb.distributors.findFirst({
        where:{
          name,
          brandId: params.brandId
        }
      })

      console.log("duplicates: ", duplicates)
      if(duplicates){
        return NextResponse.json("duplicate")
      }
      
      await prismadb.distributors.create({
        data: {
          name,
          brandId: params.brandId,
          country,
          phone,
          email,
          website,
          facebook,
          instagram,
          lat,
          lng,
          continent,
          address,
          createdAt: new Date(),
          updatedAt: new Date(),
          updatedBy: session.name
        }
      });
      revalidatePath('/sbaudience/distributors') && revalidatePath('/sbautomotive/distributors') && revalidatePath('/distributors');
      return NextResponse.json("create new")
    }

  } catch (error) {
    console.log('[DISTRIBUTOR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
