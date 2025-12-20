import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((cookie) => {
            request.cookies.set(cookie.name, cookie.value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach((cookie) => {
            supabaseResponse.cookies.set(
              cookie.name,
              cookie.value,
              cookie.options,
            );
          });
        },
      },
      auth: {
        flowType: "pkce",
      },
    },
  );

  // refresh the session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/inventory") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    ["/login", "/signup", "/reset-password"].includes(
      request.nextUrl.pathname,
    ) &&
    user
  ) {
    return NextResponse.redirect(new URL("/inventory", request.url));
  }

  return supabaseResponse;
}
