import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?:string;
  username?:string;
  name?:string;
  isAdmin?:boolean;
  authorizedBrands?:string[];
  isLoggedIn:boolean;
}

export const defaultSession:SessionData = {
  isLoggedIn:false
}

export const sessionOptions: SessionOptions ={
  password: process.env.SECRET_KEY!,
  cookieName: "loginSession",
  cookieOptions:{
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8
  }
}