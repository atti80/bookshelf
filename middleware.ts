import { NextResponse, type NextRequest } from "next/server";
import { getSessionIdFromRequest } from "@/lib/session-cookie";

const readerRoutes = ["/favourites"];
const adminRoutes = ["/admin"];

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
