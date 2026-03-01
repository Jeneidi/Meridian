import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createGitHubClient, getUserRepos } from "@/lib/github/client";

export const runtime = "nodejs";

// GET /api/repos/search - Fetch user's GitHub repos for selection
// This uses the GitHub access token from the session
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 GET /api/repos/search - START");

    const session = await auth();
    console.log("📋 Session object:", session?.user ? { id: session.user.id, email: session.user.email } : "NO SESSION");

    if (!session?.user) {
      console.log("❌ No user in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the access token from the session
    // Note: In NextAuth v5, the access token is in the session via callbacks
    const accessToken = (session as any).accessToken;
    console.log("🔑 Access token present:", !!accessToken, accessToken ? `(${String(accessToken).substring(0, 20)}...)` : "MISSING");

    if (!accessToken) {
      console.log("❌ GitHub access token not found in session");
      console.log("   Full session object:", JSON.stringify(session, null, 2));
      return NextResponse.json(
        { error: "GitHub access token not found in session" },
        { status: 401 }
      );
    }

    console.log("✅ Token found, creating Octokit client...");
    const octokit = createGitHubClient(accessToken);

    console.log("📡 Fetching user repos...");
    const repos = await getUserRepos(octokit);
    console.log("✅ Repos fetched successfully:", repos.length, "repos");

    return NextResponse.json({ repos });
  } catch (error) {
    console.error("❌ GET /api/repos/search error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch repositories";
    console.error("   Error details:", error instanceof Error ? error.stack : error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
