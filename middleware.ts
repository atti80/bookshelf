import { NextResponse, type NextRequest } from "next/server";

const readerRoutes = ["/favourites"];
const adminRoutes = ["/admin"];
const COOKIE_SESSION_KEY = "session-id";

function getSessionIdFromRequest(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_SESSION_KEY)?.value ?? null;
}

export function middleware(request: NextRequest) {
  const sessionId = getSessionIdFromRequest(request);
  const url = request.nextUrl.clone();

  // Redirect if no session cookie
  if (
    (readerRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) ||
      adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) &&
    !sessionId
  ) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/favourites/:path*"],
};
