import { NextResponse } from "next/server";

export function middleware() {
  // Middleware runs on the edge and can't use Prisma
  // Authentication checks are handled in server components instead
  // This middleware is a no-op to avoid edge runtime errors
  return NextResponse.next();
}

export const config = {
  matcher: ["/repo/:path*", "/settings", "/checkin/:path*", "/audit/:path*", "/task/:path*", "/pricing", "/connect"],
};
