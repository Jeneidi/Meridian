import { getTodaysTask, selectDailyTask } from "@/lib/ai/daily-task";
import { DailyTaskWidget } from "./DailyTaskWidget";

interface TodaysTaskSectionProps {
  repoId: string;
}

export async function TodaysTaskSection({ repoId }: TodaysTaskSectionProps) {
  // Get today's task, or select one if it doesn't exist
  let task = await getTodaysTask(repoId);

  if (!task) {
    task = await selectDailyTask(repoId);
  }

  return (
    <DailyTaskWidget
      repoId={repoId}
      taskId={task?.taskId}
      taskTitle={task?.taskTitle}
      reasoning={task?.reasoning}
      estimate={task?.estimate}
      difficulty={task?.difficulty}
    />
  );
}
