import { NextRequest, NextResponse } from "next/server";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAdminPath = /^\/admin(\/.*)?$/.test(pathname);

  if (isAdminPath) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.warn("ADMIN_PASSWORD must be set in .env.local");
      return NextResponse.next();
    }

    const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
    const expectedToken = await getExpectedToken(adminPassword);

    if (cookieToken !== expectedToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
