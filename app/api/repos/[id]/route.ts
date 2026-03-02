import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/repos/:id - Get repo details with tasks
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = await prisma.repo.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { priority: "desc" },
        },
      },
    });

    if (!repo) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    // Check ownership
    if (repo.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      repo: {
        id: repo.id,
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
        taskCount: repo.tasks.length,
        connectedAt: repo.connectedAt,
        roadmapGenAt: repo.roadmapGenAt,
      },
      tasks: repo.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        estimate: task.estimate,
        difficulty: task.difficulty,
        priority: task.priority,
        status: task.status,
        isOptional: task.isOptional,
        category: task.category,
      })),
    });
  } catch (error) {
    console.error("GET /api/repos/:id error:", error);
    return NextResponse.json(
      { error: "Failed to fetch repo" },
      { status: 500 }
    );
  }
}
