import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const { sessionNotes } = await req.json();

    // Fetch task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { repo: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify ownership via repo
    if (task.repo.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Mark task as done
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "DONE",
        completedAt: new Date(),
      },
    });

    // Create task history record
    await prisma.taskHistory.create({
      data: {
        taskId,
        sessionNotes: sessionNotes || undefined,
      },
    });

    // Calculate streak for this repo
    const repoId = task.repoId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all tasks completed today
    const completedToday = await prisma.task.count({
      where: {
        repoId,
        completedAt: {
          gte: today,
        },
      },
    });

    // Get previous days with completions (for streak calculation)
    let streak = 1;
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - 1);

    while (true) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const completedOnDate = await prisma.task.count({
        where: {
          repoId,
          completedAt: {
            gte: currentDate,
            lt: nextDate,
          },
        },
      });

      if (completedOnDate > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }

      // Safety limit (max 365 day streak lookup)
      if (streak > 365) break;
    }

    return NextResponse.json({
      task: updatedTask,
      streak,
      completedToday,
    });
  } catch (error) {
    console.error("POST /api/tasks/:id/complete error:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
