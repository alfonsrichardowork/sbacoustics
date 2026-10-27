"use server"

import { sessionOptions, SessionData, defaultSession } from "@/app/(admin)/admin/lib";
import prismadb from "@/lib/prismadb";
import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from 'jsonwebtoken';


export const getSession = async() => {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
};


export const checkAuth = async (isadmin: boolean, brandId: string, userId: string) => {
  if(!isadmin){
    const brandByUserId = await prismadb.roles.findFirst({
      where: {
        brandId,
        userId
      }
    });

    if (!brandByUserId) {
      return false;
    }
  }
  return true;
}

export async function checkBearerAPI(session: IronSession<SessionData>) {
  const apiToken = (await cookies()).get("apiToken")?.value;
  
  let decoded_access: JwtPayload & { userId: string, name: string, email: string, role: string[], isAdmin: boolean, iat: number, exp: number };
  if(process.env.ACCESS_TOKEN_SECRET && apiToken){
    try {
      //ACCESS TOKEN OKE
      decoded_access = jwt.verify(apiToken, process.env.ACCESS_TOKEN_SECRET) as JwtPayload & { userId: string, name: string, email: string, role: string[], isAdmin: boolean, iat: number, exp: number };
    } catch (error) {
      // console.error('Expired API Token');
      (await cookies()).delete("apiToken");
      //regenerate api Token, session is confirmed in API routes
      const userId = session.userId;
      const name = session.name;
      const email = session.username;
      const role = session.authorizedBrands;
      const isAdmin = session.isAdmin;
      const accessToken = jwt.sign({userId, name, email, role, isAdmin}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: '30s'
      })
      let expired_time_access = 30*1000
      const expires_access = new Date(Date.now() + expired_time_access);
      (await cookies()).set("apiToken", accessToken, {  expires: expires_access, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: "/admin", maxAge: expired_time_access });
      
    }
    return true;
  }
  return false;
}