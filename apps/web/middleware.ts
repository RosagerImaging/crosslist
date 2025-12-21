import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple cookie-based auth check for Edge Runtime compatibility
  // Full session validation happens in Server Components
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some(
    (cookie) =>
      cookie.name.startsWith("sb-") &&
      (cookie.name.includes("-auth-token") ||
        cookie.name === "sb-access-token" ||
        cookie.name === "sb-refresh-token"),
  );

  // Redirect unauthenticated users from protected routes
  if (request.nextUrl.pathname.startsWith("/inventory") && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from auth pages
  const authPages = ["/login", "/signup", "/reset-password"];
  if (authPages.includes(request.nextUrl.pathname) && hasAuthCookie) {
    return NextResponse.redirect(new URL("/inventory", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
