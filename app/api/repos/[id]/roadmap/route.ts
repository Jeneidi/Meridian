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
    const tasks = await generateRoadmapWithRetry({
      repoName: repo.name,
      readme,
      fileTree,
      issues,
    });

    // Delete existing tasks for this repo (if re-generating)
    await prisma.task.deleteMany({
      where: { repoId },
    });

    // Store tasks in database
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
            files: task.files,
            microSteps: task.microSteps,
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
    console.error("POST /api/repos/:id/roadmap error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate roadmap";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
