import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

// For development: generate a temporary secret if AUTH_SECRET is not set
const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️ AUTH_SECRET not set. Using temporary secret for development.\n" +
        "For production, set AUTH_SECRET in your environment variables.\n" +
        "Generate one with: openssl rand -base64 32"
      );
      return "dev-secret-change-in-production-9876543210123456789";
    }
    throw new Error(
      "AUTH_SECRET must be set in environment variables for production"
    );
  }
  return secret;
};

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
    async signIn({ user, account, profile }) {
      console.log("✅ SignIn callback STARTED");
      try {
        if (!user?.email) {
          console.error("❌ No email provided by GitHub");
          return false;
        }
        console.log("✅ SignIn callback SUCCESS - email:", user.email);
        return true;
      } catch (error) {
        console.error("❌ SignIn callback ERROR:", error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      console.log("✅ JWT callback STARTED");
      try {
        if (account?.provider === "github" && account.access_token) {
          token.accessToken = account.access_token;
          console.log("✅ JWT callback SUCCESS - token stored");
        }
        return token;
      } catch (error) {
        console.error("❌ JWT callback ERROR:", error);
        return token;
      }
    },
    async session({ session, user }) {
      // Database session strategy: fetch access token from Account
      if (user?.id) {
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: "github",
          },
        });
        if (account?.access_token) {
          (session as any).accessToken = account.access_token;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
