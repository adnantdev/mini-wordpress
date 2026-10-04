import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "siteforge-fallback-secret-key-must-be-min-32-chars-long"
);
const COOKIE_NAME = "siteforge_session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/projects",
  "/editor",
  "/templates",
  "/assets",
  "/settings",
  "/preview",
];

const PROTECTED_API_PREFIXES = [
  "/api/projects",
  "/api/templates",
  "/api/assets",
  "/api/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // If visiting login while already authenticated
  if (pathname === "/login" || pathname === "/") {
    if (isValid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Check private web pages
  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedPage && !isValid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check private API routes
  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedApi && !isValid) {
    return NextResponse.json(
      { error: "Unauthorized access. Please login." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - web/* (public websites)
     * - uploads/* (public uploaded assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|web/|uploads/).*)",
  ],
};
