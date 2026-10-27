import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import argon2 from "argon2"
import { checkBearerAPI, getSession } from "@/lib/actions";

export async function POST(
  req: Request,
  ) {
  try {
    const session = await getSession();

    if(!session.isLoggedIn){
      return NextResponse.json("expired_session")
    }

    if(!await checkBearerAPI(session)){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    if(!session.isAdmin){
      return NextResponse.json("not_admin")
    }

    const body = await req.json();
    const { name, email, password, confPassword } = body;

    const allUser = await prismadb.users.findMany({
      select:{
        email: true
      }
    })

    const allUser_changed = allUser.map((user) => user.email)
    const usernameTaken = allUser_changed.includes(email);
    if(usernameTaken){
      return NextResponse.json("taken")
    }

    const hashPassword = await argon2.hash(password)

    await prismadb.users.create({
      data: {
          name,
          email,
          password: hashPassword,
          refresh_token: "",
          createdAt: new Date(),
          updatedAt: new Date(),
      }
    });
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[USERS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

  
