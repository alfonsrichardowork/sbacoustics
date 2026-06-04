import { checkBearerAPI, getSession } from "@/lib/actions";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ userId: string }> }) {
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
    
    if(!session.isAdmin){
      return NextResponse.json("not_admin")
    }

    await prismadb.roles.deleteMany({
      where:{
        userId: params.userId
      }
    });

    const body = await req.json();
    if(body.length!==0){
      const updatedRoles = await prismadb.roles.createMany({
        data: [
          ...body.map((data: { userId: string, brandId: string, brandName: string }) => ({
            userId: data.userId,
            brandId: data.brandId,
            brandName: data.brandName
          })),
        ],
      });
      return NextResponse.json(updatedRoles);
    }
    return NextResponse.json('');
  } catch (error) {
    console.log('[ROLES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  ) {
  try {
    const body = await req.json();

    const session = await getSession();

    if(!session.isLoggedIn){
      redirect("/admin")
    }

    await prismadb.roles.deleteMany({
      where:{
        userId: body[0].userId
      }
    });

    const updatedRoles = await prismadb.roles.createMany({
      data: [
        ...body.map((data: { userId: string, brandId: string, brandName: string }) => ({
          userId: data.userId,
          brandId: data.brandId,
          brandName: data.brandName
        })),
      ],
    });

    return NextResponse.json(updatedRoles);
  } catch (error) {
    console.log('[ROLES_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};



export async function GET(
    req: Request,
  ) {
    try {
      const body = await req.json();

      const { email } = body;

      const user = await prismadb.users.findMany({
        where:{
          email
        }
      });
    
      return NextResponse.json(user);
    } catch (error) {
      console.log('[ROLES_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
};
  
