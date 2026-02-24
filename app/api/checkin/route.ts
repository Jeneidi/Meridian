import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCoachingWithRetry } from "@/lib/ai/coaching";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeInput, sanitizeDiff, containsMaliciousContent } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit (10 checkins per day per user)
    const rateLimitKey = `checkin:${session.user.id}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.CHECKIN);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Max 10 check-ins per day.",
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

    const { taskId, repoId, summary, diffSnippet } = await req.json();

    if (!taskId || !repoId || !summary) {
      return NextResponse.json(
        { error: "Missing required fields: taskId, repoId, summary" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedSummary = sanitizeInput(summary as string, 5000);
    const sanitizedDiff = sanitizeDiff(diffSnippet as string || "", 2000);

    // Check for malicious content
    if (containsMaliciousContent(sanitizedSummary) || containsMaliciousContent(sanitizedDiff)) {
      return NextResponse.json(
        { error: "Input contains invalid content" },
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

    // Generate coaching response with sanitized inputs
    const coaching = await generateCoachingWithRetry({
      taskTitle: task.title,
      taskDescription: task.description,
      userSummary: sanitizedSummary,
      diffSnippet: sanitizedDiff || undefined,
      estimate: task.estimate,
      difficulty: task.difficulty,
    });

    // Store check-in record with sanitized inputs
    const checkin = await prisma.checkIn.create({
      data: {
        repoId,
        userId: session.user.id,
        summary: sanitizedSummary,
        diffSnippet: sanitizedDiff || undefined,
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
