import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Store GitHub access token in JWT for later use
      if (account?.provider === "github" && account.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass access token to session
      (session as any).accessToken = token.accessToken;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/app");

      if (isOnDashboard) {
        return isLoggedIn; // Redirect unauthenticated users to login
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl)); // Redirect logged-in users away from login
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
