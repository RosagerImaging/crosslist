import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Simple cookie-based auth check for Edge Runtime compatibility
  // Full session validation happens in Server Components
  const hasAuthCookie =
    request.cookies.has("sb-access-token") ||
    request.cookies.has("sb-refresh-token") ||
    // Check for newer Supabase cookie format
    Array.from(request.cookies.getAll()).some(
      (cookie) =>
        cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"),
    );

  // Redirect unauthenticated users from protected routes
  if (request.nextUrl.pathname.startsWith("/inventory") && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from auth pages
  if (
    ["/login", "/signup", "/reset-password"].includes(
      request.nextUrl.pathname,
    ) &&
    hasAuthCookie
  ) {
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
