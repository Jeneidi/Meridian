import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { selectDailyTask, getTodaysTask } from "@/lib/ai/daily-task";

export const runtime = "nodejs";

// GET /api/daily?repoId=... - Get today's selected task
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repoId = req.nextUrl.searchParams.get("repoId");
    if (!repoId) {
      return NextResponse.json(
        { error: "Missing repoId" },
        { status: 400 }
      );
    }

    // First try to get existing today's task
    let task = await getTodaysTask(repoId);

    // If none exists, select one
    if (!task) {
      task = await selectDailyTask(repoId);
    }

    if (!task) {
      return NextResponse.json(
        { task: null, message: "No incomplete tasks" },
        { status: 200 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("GET /api/daily error:", error);
    return NextResponse.json(
      { error: "Failed to select daily task" },
      { status: 500 }
    );
  }
}
