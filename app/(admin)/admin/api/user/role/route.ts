import { getSession } from "@/lib/actions";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
  ) {
    const session = await getSession();

    if(!session.isLoggedIn){
      redirect("/admin")
    }
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
  