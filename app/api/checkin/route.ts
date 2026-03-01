import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCoachingWithRetry } from "@/lib/ai/coaching";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plan-gate";
import { sanitizeInput, sanitizeDiff, containsMaliciousContent } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's plan and apply appropriate rate limit
    const userId = session.user.id as string;
    const plan = await getUserPlan(userId);
    const rateLimitKey = `checkin:${userId}`;

    const rateLimitConfig =
      plan === "PREMIUM"
        ? RATE_LIMITS.CHECKIN_PREMIUM
        : plan === "PRO"
          ? RATE_LIMITS.CHECKIN_PRO
          : RATE_LIMITS.CHECKIN_FREE;

    const rateLimit = checkRateLimit(rateLimitKey, rateLimitConfig);

    if (!rateLimit.success) {
      const limits: Record<string, number> = {
        FREE: 2,
        PRO: 10,
        PREMIUM: 30,
      };
      const limit = limits[plan];

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Max ${limit} check-ins per day.`,
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
    // Use plan-appropriate model (Haiku for FREE, Sonnet for paid)
    const model = PLAN_LIMITS[plan].coachingModel;
    const coaching = await generateCoachingWithRetry(
      {
        taskTitle: task.title,
        taskDescription: task.description,
        userSummary: sanitizedSummary,
        diffSnippet: sanitizedDiff || undefined,
        estimate: task.estimate,
        difficulty: task.difficulty,
      },
      2,
      model
    );

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
