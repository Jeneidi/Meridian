import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCoachingWithRetry } from "@/lib/ai/coaching";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, repoId, summary, diffSnippet } = await req.json();

    if (!taskId || !repoId || !summary) {
      return NextResponse.json(
        { error: "Missing required fields: taskId, repoId, summary" },
        { status: 400 }
      );
    }

    // Fetch task details
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify ownership via repo
    const repo = await prisma.repo.findUnique({
      where: { id: repoId },
    });

    if (!repo || repo.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Trim diff to max 2000 chars
    const trimmedDiff = diffSnippet
      ? diffSnippet.substring(0, 2000)
      : undefined;

    // Generate coaching response
    const coaching = await generateCoachingWithRetry({
      taskTitle: task.title,
      taskDescription: task.description,
      userSummary: summary,
      diffSnippet: trimmedDiff,
      estimate: task.estimate,
      difficulty: task.difficulty,
    });

    // Store check-in record
    const checkin = await prisma.checkIn.create({
      data: {
        repoId,
        userId: session.user.id,
        summary,
        diffSnippet: trimmedDiff,
        aiCoaching: coaching,
      },
    });

    return NextResponse.json({
      id: checkin.id,
      coaching: checkin.aiCoaching,
      createdAt: checkin.createdAt,
    });
  } catch (error) {
    console.error("POST /api/checkin error:", error);
    return NextResponse.json(
      { error: "Failed to process check-in" },
      { status: 500 }
    );
  }
}
