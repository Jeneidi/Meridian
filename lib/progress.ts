import { prisma } from "@/lib/db";

/**
 * Calculate the current shipping streak for a repo
 * Streak = consecutive days with at least 1 task completed
 * Starting from today and looking back
 */
export async function calculateStreak(repoId: string): Promise<number> {
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if there are any completions today
  const startOfToday = new Date(currentDate);
  const endOfToday = new Date(currentDate);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const completedToday = await prisma.task.count({
    where: {
      repoId,
      completedAt: {
        gte: startOfToday,
        lt: endOfToday,
      },
    },
  });

  if (completedToday === 0) {
    return 0; // No streak if nothing completed today
  }

  streak = 1; // Start with today

  // Look back for consecutive days with completions
  let checkDate = new Date(currentDate);
  checkDate.setDate(checkDate.getDate() - 1);

  while (streak < 365) {
    const startOfCheckDate = new Date(checkDate);
    startOfCheckDate.setHours(0, 0, 0, 0);
    const endOfCheckDate = new Date(checkDate);
    endOfCheckDate.setDate(endOfCheckDate.getDate() + 1);
    endOfCheckDate.setHours(0, 0, 0, 0);

    const completedOnDate = await prisma.task.count({
      where: {
        repoId,
        completedAt: {
          gte: startOfCheckDate,
          lt: endOfCheckDate,
        },
      },
    });

    if (completedOnDate > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break; // Streak broken
    }
  }

  return streak;
}

/**
 * Get repo progress metrics
 */
export async function getRepoProgress(repoId: string) {
  const [total, completed, streak] = await Promise.all([
    prisma.task.count({
      where: { repoId },
    }),
    prisma.task.count({
      where: { repoId, status: "DONE" },
    }),
    calculateStreak(repoId),
  ]);

  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    streak,
  };
}
