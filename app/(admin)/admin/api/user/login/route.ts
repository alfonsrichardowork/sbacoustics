import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import argon2 from 'argon2';
import { cookies } from "next/headers";
import { getSession } from "@/lib/actions";

export async function PATCH(
  req: Request,
  ) {
  try {
    const session = await getSession();
    
    const body = await req.json();

    const { email, password } = body;
    const cek_user = await prismadb.users.findMany({
      where:{
        email
      }
    });
    if(cek_user && cek_user.length > 0 && cek_user[0]){
      const hashPassword = cek_user[0].password;
      const match = await argon2.verify(hashPassword, password);
      if(!match) return new NextResponse("Wrong Password", { status: 500 });

      const get_roles = await prismadb.roles.findMany({
        where:{
          userId: cek_user[0].id
        }
      });

      const role = get_roles.map(role => role.brandId);
      let isAdmin = false

      session.userId = cek_user[0].id;
      session.username = cek_user[0].email;
      session.authorizedBrands = role;
      session.isLoggedIn = true;
      session.name = cek_user[0].name;
      if (cek_user[0].email === 'admin' && cek_user[0].name === 'admin'){
        session.isAdmin = true
        isAdmin = true
      }
      else{
        session.isAdmin = false
        isAdmin = false
      }

      //CREATE API TOKEN
      if (!process.env.ACCESS_TOKEN_SECRET) {
        return NextResponse.json({ error: 'ACCESS_TOKEN_SECRET is not defined' }, { status: 500 });
      }
      const userId = cek_user[0].id;
      const name = cek_user[0].name;
      const accessToken = jwt.sign({userId, name, email, role, isAdmin}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: '30s'
      })
      let expired_time_access = 30*1000
      const expires_access = new Date(Date.now() + expired_time_access);
      (await cookies()).set("apiToken", accessToken, {  expires: expires_access, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: "/admin", maxAge: expired_time_access });

      await session.save();
      
      const getRoleId = await prismadb.roles.findFirst({
        where: {
          userId: session.userId,
        }
      });
      if(!getRoleId) return NextResponse.json('');
      return NextResponse.json(getRoleId);
    }
  } catch (error) {
    console.log('[USERS_PATCH]', error);
    return new NextResponse("Wrong Email / Password", { status: 500 });
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
      console.log('[USERS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
};
  
