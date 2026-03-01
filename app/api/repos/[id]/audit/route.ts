import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createGitHubClient,
  getRepoReadme,
  getRepoFileTree,
  getRepoIssues,
  getRepoAllFiles,
} from "@/lib/github/client";
import { runSecurityScan } from "@/lib/security-scan";
import { generateSecurityAudit } from "@/lib/ai/security-audit";
import { getUserPlan } from "@/lib/plan-gate";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: repoId } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Get the repo and verify ownership
    const repo = await prisma.repo.findUnique({ where: { id: repoId } });
    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    if (repo.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const accessToken = (session as any).accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "GitHub access token not available" },
        { status: 401 }
      );
    }

    const octokit = createGitHubClient(accessToken);
    const [owner, repoName] = repo.fullName.split("/");

    // Fetch repo metadata in parallel
    const [readme, fileTree, issues] = await Promise.all([
      getRepoReadme(octokit, owner, repoName),
      getRepoFileTree(octokit, owner, repoName),
      getRepoIssues(octokit, owner, repoName),
    ]);

    // Concatenate all text content for grep scan
    const textContent = [
      readme ?? "",
      ...issues.map((i) => i.title + " " + (i.body ?? "")),
    ].join("\n");

    // Run the surface-level grep scan (instant, free)
    const scanResult = runSecurityScan(fileTree, textContent);

    // Get user's plan
    const plan = await getUserPlan(userId);

    // For FREE users: return grep results only
    if (plan === "FREE") {
      return NextResponse.json({
        tier: "free",
        scanResult,
        aiReport: null,
        upgrade: {
          message:
            "Upgrade to PRO to get deep code analysis — Claude reads every line of your source code",
          url: "/pricing",
        },
      });
    }

    // For PRO users: also run Claude deep analysis
    const allFiles = await getRepoAllFiles(octokit, owner, repoName);

    const aiReport = await generateSecurityAudit({
      repoName: repo.name,
      files: allFiles,
      grepFindings: scanResult.issues,
    });

    return NextResponse.json({
      tier: plan === "PREMIUM" ? "premium" : "pro",
      scanResult,
      aiReport,
      upgrade: null,
    });
  } catch (error) {
    console.error("POST /api/repos/:id/audit error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to run security audit",
      },
      { status: 500 }
    );
  }
}
