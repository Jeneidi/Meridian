import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resetRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getUserPlan } from "@/lib/plan-gate";

export const runtime = "nodejs";

// DEV ONLY: Reset roadmap generation counter to give user one more attempt
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const rateLimitKey = `roadmap:${userId}`;

    // Reset the rate limit for this user
    resetRateLimit(rateLimitKey);

    // Get user's plan to determine which rate limit applies
    const plan = await getUserPlan(userId);
    const rateLimitConfig =
      plan === "PREMIUM"
        ? RATE_LIMITS.ROADMAP_PREMIUM
        : plan === "PRO"
          ? RATE_LIMITS.ROADMAP_PRO
          : RATE_LIMITS.ROADMAP_FREE;

    // Return full quota since we just reset (don't call checkRateLimit as it would consume one use)
    return NextResponse.json({
      success: true,
      message: "Roadmap generation reset for testing",
      remaining: rateLimitConfig.max,
    });
  } catch (error) {
    console.error("DEV add-roadmap-gen error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reset roadmap gen" },
      { status: 500 }
    );
  }
}
