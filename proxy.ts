import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/actions';

const superadminOnlyRoutes = ['/createuser', '/customapi', '/settings', '/usersettings']

function isAdminRoute(url: string): boolean {
  return url.startsWith('/admin');
}

function isSuperAdminOnlyRoute(url: string): boolean {
  return superadminOnlyRoutes.some(route => url.endsWith(route));
}

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.pathname;
  
  if(!isAdminRoute(url)){
    return NextResponse.next()
  }

  const session = await getSession();
  if(url === '/admin/sign-in' || url === '/admin/api/user/login'){
    if(!session.isLoggedIn){
      return NextResponse.next()
    }
    else{
      return NextResponse.redirect(new URL('/admin/', req.url));
    }
  }

  if(!session.isLoggedIn){
    return NextResponse.redirect(new URL('/admin/sign-in', req.url));
  }

  if(isSuperAdminOnlyRoute(url) ){
    if(session.isAdmin){
      return NextResponse.next();
    }
    else{
      return NextResponse.redirect(new URL('/admin/', req.url));
    }
  }
  
  return NextResponse.next();
}



export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};