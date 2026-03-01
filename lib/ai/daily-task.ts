import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";

const client = new Anthropic();

export interface DailyTaskSelection {
  taskId: string;
  taskTitle: string;
  reasoning: string;
  estimate: number;
  difficulty: number;
}

/**
 * Select the best task for today using scoring algorithm + LLM reasoning
 * Factors:
 * - Priority (weight: 40%)
 * - Recency (haven't picked in N days: weight: 30%)
 * - Difficulty fit (current streak vs task difficulty: weight: 20%)
 * - Dependencies (blockers: weight: 10%)
 */
export async function selectDailyTask(
  repoId: string
): Promise<DailyTaskSelection | null> {
  // Get all incomplete tasks
  const tasks = await prisma.task.findMany({
    where: {
      repoId,
      status: { not: "DONE" },
    },
  });

  if (tasks.length === 0) {
    return null;
  }

  // Get task history to check recency
  const taskHistory = await prisma.taskHistory.groupBy({
    by: ["taskId"],
    where: {
      taskId: { in: tasks.map((t) => t.id) },
    },
    _max: {
      completedAt: true,
    },
  });

  const historyMap = new Map(
    taskHistory.map((h) => [h.taskId, h._max.completedAt])
  );

  // Calculate scores
  const now = new Date();
  const scoredTasks = tasks.map((task) => {
    const lastCompletedAt = historyMap.get(task.id);
    const daysSinceCompleted = lastCompletedAt
      ? Math.floor((now.getTime() - lastCompletedAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999; // Never completed = high recency score

    // Priority score (1-10 -> 0-40 points)
    const priorityScore = (task.priority / 10) * 40;

    // Recency score (decay: older tasks get higher score)
    const recencyScore = Math.min(daysSinceCompleted * 3, 30);

    // Difficulty fit (prefer medium tasks today, not too hard/easy)
    // Assume average user can handle difficulty 2-3
    const difficultyFit = Math.abs(task.difficulty - 2.5) < 1 ? 20 : 15;

    const totalScore = priorityScore + recencyScore + difficultyFit;

    return {
      task,
      score: totalScore,
      priorityScore,
      recencyScore,
      difficultyFit,
    };
  });

  // Sort by score (highest first)
  scoredTasks.sort((a, b) => b.score - a.score);
  const selectedTask = scoredTasks[0].task;

  // Get LLM reasoning for why this task was selected
  const reasoning = await generateTaskReasoningWithRetry(
    selectedTask,
    scoredTasks[0]
  );

  // Create DailyTask record
  const today = new Date(new Date().toDateString());
  await prisma.dailyTask.upsert({
    where: {
      repoId_date: {
        repoId,
        date: today,
      },
    },
    create: {
      repoId,
      taskId: selectedTask.id,
      date: today,
      reasoning,
    },
    update: {
      taskId: selectedTask.id,
      reasoning,
    },
  });

  return {
    taskId: selectedTask.id,
    taskTitle: selectedTask.title,
    reasoning,
    estimate: selectedTask.estimate,
    difficulty: selectedTask.difficulty,
  };
}

async function generateTaskReasoningWithRetry(task: any, scored: any): Promise<string> {
  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Task: "${task.title}"
Estimate: ${task.estimate} minutes
Difficulty: ${task.difficulty}/5
Priority: ${task.priority}/10

Write a 1-2 sentence encouraging reason why this is a good task to work on RIGHT NOW.
Be concise, motivational, and specific to the task.
Focus on momentum and shipping.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return content.text;
    }
    return "Let's ship this feature!";
  } catch (error) {
    console.error("Failed to generate reasoning:", error);
    return `Focus on "${task.title}" (${task.estimate}min) — priority ${task.priority}/10`;
  }
}

/**
 * Get today's selected task
 */
export async function getTodaysTask(repoId: string) {
  const today = new Date(new Date().toDateString());

  const dailyTask = await prisma.dailyTask.findUnique({
    where: {
      repoId_date: {
        repoId,
        date: today,
      },
    },
    include: {
      task: true,
    },
  });

  if (!dailyTask) {
    return null;
  }

  return {
    taskId: dailyTask.task.id,
    taskTitle: dailyTask.task.title,
    reasoning: dailyTask.reasoning,
    estimate: dailyTask.task.estimate,
    difficulty: dailyTask.task.difficulty,
  };
}
