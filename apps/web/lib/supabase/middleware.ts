import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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
