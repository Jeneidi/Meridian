import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createGitHubClient, getUserRepos } from "@/lib/github/client";

// GET /api/repos/search - Fetch user's GitHub repos for selection
// This uses the GitHub access token from the session
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the access token from the session
    // Note: In NextAuth v5, the access token is in the session via callbacks
    // For now, we'll use a placeholder - in production, this would come from the session
    const accessToken = (session as any).accessToken || process.env.GITHUB_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "GitHub access token not found" },
        { status: 401 }
      );
    }

    const octokit = createGitHubClient(accessToken);
    const repos = await getUserRepos(octokit);

    return NextResponse.json({ repos });
  } catch (error) {
    console.error("GET /api/repos/search error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch repositories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
