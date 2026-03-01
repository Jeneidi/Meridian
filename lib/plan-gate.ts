import { prisma } from "@/lib/db";

export type PlanTier = "FREE" | "PRO" | "PREMIUM";

/**
 * Get the user's current plan tier
 */
export async function getUserPlan(userId: string): Promise<PlanTier> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  return (user?.plan ?? "FREE") as PlanTier;
}

/**
 * Per-plan feature limits and configuration
 */
export const PLAN_LIMITS = {
  FREE: {
    repos: 1,
    roadmapPerMonth: 2,
    checkinsPerDay: 2,
    auditsPerDay: 0,
    coachingModel: "claude-haiku-4-5-20251001",
  },
  PRO: {
    repos: 3,
    roadmapPerDay: 10,
    checkinsPerDay: 10,
    auditsPerDay: 3,
    coachingModel: "claude-sonnet-4-6",
  },
  PREMIUM: {
    repos: 10,
    roadmapPerDay: 50,
    checkinsPerDay: 30,
    auditsPerDay: 10,
    coachingModel: "claude-sonnet-4-6",
  },
};
