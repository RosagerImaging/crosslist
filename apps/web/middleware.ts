import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Temporarily disable all auth logic to test Edge Runtime
  return NextResponse.next();
}

// Temporarily disable matcher to test if it's causing the crash
// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };
