import { NextResponse, type NextRequest } from "next/server";
import { getUserFromSession, updateUserSessionExpiration } from "@/lib/session";

const readerRoutes = ["/favourites"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();

  await updateUserSessionExpiration({
    set: (key, value, options) => {
      response.cookies.set({ ...options, name: key, value });
    },
    get: (key) => request.cookies.get(key),
  });

  return response;
}

async function middlewareAuth(request: NextRequest) {
  if (
    readerRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    const user = await getUserFromSession(request.cookies);
    if (user == null) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const user = await getUserFromSession(request.cookies);
    if (user == null) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (!user.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: ["/admin/:path*", "/favourites/:path*"],
  //matcher: [
  // Skip Next.js internals and all static files, unless found in search params
  //"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  //],
};
