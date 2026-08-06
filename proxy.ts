import { NextResponse, userAgent } from 'next/server';
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

  const ua = req.headers.get("user-agent") ?? "";

  const iosMatch = ua.match(/OS (\d+)[._](\d+)/i);
  const safariMatch = ua.match(/Version\/(\d+)(?:\.(\d+))?/i);

  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  const isIOSSafari =
    isIOS &&
    /Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|GSA/i.test(ua);

  const isMacSafari =
    /Macintosh/i.test(ua) &&
    /Safari/i.test(ua) &&
    /Version\/\d+/i.test(ua) &&
    !/Chrome|CriOS|Firefox|FxiOS|Edg|OPR/i.test(ua);

  const safariMajor = Number(safariMatch?.[1] ?? 0);
  const safariMinor = Number(safariMatch?.[2] ?? 0);

  const legacySafari =
    safariMatch !== null &&
    (
      safariMajor < 16 ||
      (safariMajor === 16 && safariMinor <= 4)
    );

  const legacyIOS =
    isIOSSafari &&
    iosMatch !== null &&
    (
      Number(iosMatch[1]) < 16 ||
      (
        Number(iosMatch[1]) === 16 &&
        Number(iosMatch[2]) <= 4
      )
    );

  const shouldRedirect =
    legacyIOS ||
    (isMacSafari && legacySafari);

  const isOldRoute =
    req.nextUrl.pathname === "/old" ||
    req.nextUrl.pathname.startsWith("/old/");

  const isStaticAsset =
    req.nextUrl.pathname.startsWith("/uploads/") ||
    req.nextUrl.pathname.startsWith("/images/") ||
    req.nextUrl.pathname.startsWith("/public/");
  
  if (
    shouldRedirect &&
    !isOldRoute &&
    !isStaticAsset
  ) {
    const url = req.nextUrl.clone();

    url.pathname = `/old${url.pathname}`;

    return NextResponse.redirect(url, 307);
  }

  if(!isAdminRoute(url)){
    return NextResponse.next();
  }

  const session = await getSession();
  if(url === '/admin/sign-in' || url === '/admin/api/user/login'){
    if(!session.isLoggedIn){
      return NextResponse.next();
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