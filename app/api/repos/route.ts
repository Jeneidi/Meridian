import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createGitHubClient, getRepoReadme, getRepoFileTree, getRepoIssues } from "@/lib/github/client";

// GET /api/repos - List user's connected repos
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repos = await prisma.repo.findMany({
      where: {
        user: {
          id: session.user.id as string,
        },
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json({
      repos: repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
        taskCount: repo.tasks.length,
        connectedAt: repo.connectedAt,
        roadmapGenAt: repo.roadmapGenAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/repos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 500 }
    );
  }
}

// POST /api/repos - Connect a new repo
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { githubRepoId, name, fullName, url, defaultBranch } = await req.json();

    if (!githubRepoId || !name || !fullName || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if repo already connected
    const existing = await prisma.repo.findUnique({
      where: { githubRepoId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Repo already connected" },
        { status: 409 }
      );
    }

    // Create repo record
    const repo = await prisma.repo.create({
      data: {
        userId: session.user.id as string,
        githubRepoId,
        name,
        fullName,
        url,
        defaultBranch: defaultBranch || "main",
      },
    });

    return NextResponse.json(
      {
        success: true,
        repo: {
          id: repo.id,
          name: repo.name,
          fullName: repo.fullName,
          connectedAt: repo.connectedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/repos error:", error);
    return NextResponse.json(
      { error: "Failed to connect repo" },
      { status: 500 }
    );
  }
}
