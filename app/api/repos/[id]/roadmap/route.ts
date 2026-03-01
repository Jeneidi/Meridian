import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createGitHubClient,
  getRepoReadme,
  getRepoFileTree,
  getRepoIssues,
} from "@/lib/github/client";
import {
  generateRoadmapWithRetry,
  type GeneratedTask,
} from "@/lib/ai/roadmap";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getUserPlan } from "@/lib/plan-gate";

export const runtime = "nodejs";

// POST /api/repos/:id/roadmap - Generate roadmap for a repo
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

    // Get user's plan and apply appropriate rate limit
    const userId = session.user.id as string;
    const plan = await getUserPlan(userId);
    const rateLimitKey = `roadmap:${userId}`;

    const rateLimitConfig =
      plan === "PREMIUM"
        ? RATE_LIMITS.ROADMAP_PREMIUM
        : plan === "PRO"
          ? RATE_LIMITS.ROADMAP_PRO
          : RATE_LIMITS.ROADMAP_FREE;

    const rateLimit = checkRateLimit(rateLimitKey, rateLimitConfig);

    if (!rateLimit.success) {
      const limits: Record<string, number> = {
        FREE: 2,
        PRO: 10,
        PREMIUM: 50,
      };
      const limit = limits[plan];
      const window = plan === "FREE" ? "per month" : "per day";

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Max ${limit} roadmap generations ${window}.`,
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    // Get repo from database
    const repo = await prisma.repo.findUnique({
      where: { id: repoId },
    });

    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    // Check ownership
    if (repo.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get GitHub access token from session
    const accessToken = (session as any).accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "GitHub access token not available" },
        { status: 401 }
      );
    }

    // Fetch repo metadata from GitHub
    const octokit = createGitHubClient(accessToken);
    const [owner, repoName] = repo.fullName.split("/");

    const [readme, fileTree, issues] = await Promise.all([
      getRepoReadme(octokit, owner, repoName),
      getRepoFileTree(octokit, owner, repoName),
      getRepoIssues(octokit, owner, repoName),
    ]);

    // Generate roadmap using Claude
    console.log("🔧 Calling generateRoadmapWithRetry for repo:", repo.name);
    console.log("   README length:", readme?.length || 0);
    console.log("   Files count:", fileTree?.length || 0);
    console.log("   Issues count:", issues?.length || 0);
    const { tasks, metadata, message } = await generateRoadmapWithRetry({
      repoName: repo.name,
      readme,
      fileTree,
      issues,
    });
    console.log("✅ Roadmap generation succeeded, tasks:", tasks.length);
    console.log("📊 Project analysis - Type:", metadata.projectType, "| Complexity:", metadata.complexity);
    console.log("   Docs needed - README:", metadata.documentationNeeds.needsFullReadme,
      "| Setup guide:", metadata.documentationNeeds.needsComprehensiveSetupGuide,
      "| Repro steps:", metadata.documentationNeeds.needsReproductionSteps,
      "| Verification:", metadata.documentationNeeds.needsExtensiveVerification);

    // Delete existing tasks for this repo (if re-generating)
    await prisma.task.deleteMany({
      where: { repoId },
    });

    // Store tasks in database
    // Note: Prisma stores files and microSteps as JSON strings in SQLite
    const createdTasks = await Promise.all(
      tasks.map((task) =>
        prisma.task.create({
          data: {
            repoId,
            title: task.title,
            description: task.description,
            estimate: task.estimate,
            difficulty: task.difficulty,
            priority: task.priority,
            files: JSON.stringify(Array.isArray(task.files) ? task.files : []),
            microSteps: JSON.stringify(Array.isArray(task.microSteps) ? task.microSteps : []),
          },
        })
      )
    );

    // Update repo with roadmap generation timestamp
    await prisma.repo.update({
      where: { id: repoId },
      data: { roadmapGenAt: new Date() },
    });

    return NextResponse.json(
      {
        success: true,
        taskCount: createdTasks.length,
        message: message || null,
        projectAnalysis: {
          projectType: metadata.projectType,
          complexity: metadata.complexity,
          documentationNeeds: metadata.documentationNeeds,
        },
        tasks: createdTasks.map((task) => ({
          id: task.id,
          title: task.title,
          estimate: task.estimate,
          difficulty: task.difficulty,
          priority: task.priority,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/repos/:id/roadmap error:", error);
    console.error("   Error type:", error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
      console.error("   Stack trace:", error.stack);
    }

    const message =
      error instanceof Error ? error.message : "Failed to generate roadmap";
    console.log("📤 Returning error to client:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
