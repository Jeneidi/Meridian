export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/app/:path*", "/api/repos/:path*", "/api/tasks/:path*", "/api/checkin/:path*", "/api/daily/:path*"],
};
