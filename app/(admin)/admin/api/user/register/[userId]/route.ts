import { checkBearerAPI, getSession } from "@/lib/actions";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, props: { params: Promise<{ userId: string }> }) {
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
    
    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
 
    await prismadb.roles.deleteMany({
      where:{
          userId: params.userId
      }
    })

    const deletedUser = await prismadb.users.deleteMany({
      where: {
        id: params.userId
      }
    });
  
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.log('[USER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};