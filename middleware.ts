import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from "next/server";
import { routing } from './routing';

const COOKIE_NAME = "admin_session";
const COOKIE_SALT = "admin";

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getExpectedToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + COOKIE_SALT);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return arrayBufferToBase64Url(hash);
}

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin authentication (before i18n)
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login")) {
    return intlMiddleware(request);
  }

  const isAdminPath = /^\/(ka|en)?\/?admin(\/.*)?$/.test(pathname);

  if (isAdminPath) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.warn("ADMIN_PASSWORD must be set in .env.local");
      return intlMiddleware(request);
    }

    const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
    const expectedToken = await getExpectedToken(adminPassword);

    if (cookieToken !== expectedToken) {
      const url = request.nextUrl.clone();
      // Extract locale from pathname
      const localeMatch = pathname.match(/^\/(ka|en)/);
      const locale = localeMatch ? localeMatch[1] : 'ka';
      url.pathname = `/${locale}/admin/login`;
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
