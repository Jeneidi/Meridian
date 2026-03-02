import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resetRateLimit, checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getUserPlan } from "@/lib/plan-gate";

export const runtime = "nodejs";

// DEV ONLY: Reset security audit counter to give user one more attempt
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const rateLimitKey = `audit:${userId}`;

    // Reset the rate limit for this user
    resetRateLimit(rateLimitKey);

    // Get user's plan to determine which rate limit applies
    const plan = await getUserPlan(userId);
    const rateLimitConfig =
      plan === "PREMIUM"
        ? RATE_LIMITS.AUDIT_PREMIUM
        : plan === "PRO"
          ? RATE_LIMITS.AUDIT_PRO
          : null; // FREE tier has no audit access

    if (!rateLimitConfig) {
      return NextResponse.json(
        { error: "Free tier users do not have access to security audits" },
        { status: 403 }
      );
    }

    // Check to see what the new remaining count is
    const check = checkRateLimit(rateLimitKey, rateLimitConfig);

    return NextResponse.json({
      success: true,
      message: "Security audit reset for testing",
      remaining: check.remaining,
    });
  } catch (error) {
    console.error("DEV add-security-audit error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reset security audit" },
      { status: 500 }
    );
  }
}
