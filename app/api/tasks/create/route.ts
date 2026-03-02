import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoId, title, description, estimate, difficulty, priority, isOptional, category, isCustom } = await req.json();

    // Validate required fields
    if (!repoId || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify repo ownership
    const repo = await prisma.repo.findUnique({
      where: { id: repoId },
    });

    if (!repo || repo.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        repoId,
        title,
        description,
        estimate: estimate || 30,
        difficulty: difficulty || 2,
        priority: priority || 5,
        files: "[]",
        microSteps: JSON.stringify(["Complete the task"]),
        isOptional: isOptional ?? false,
        category: category ?? "feature",
      },
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks/create error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create task",
      },
      { status: 500 }
    );
  }
}
