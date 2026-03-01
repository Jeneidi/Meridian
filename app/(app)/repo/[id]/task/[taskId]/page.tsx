import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { CheckInForm } from "@/components/app/CheckInForm";
import { MarkTaskDoneButton } from "@/components/app/MarkTaskDoneButton";
import { TaskDetailContent } from "@/components/app/TaskDetailContent";
import { Check } from "lucide-react";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id: repoId, taskId } = await params;

  if (!repoId || !taskId) {
    redirect("/dashboard");
  }

  // Verify repo ownership
  const repo = await prisma.repo.findUnique({
    where: { id: repoId },
  });

  if (!repo || repo.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Fetch task
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.repoId !== repoId) {
    redirect(`/repo/${repoId}`);
  }

  // Parse JSON strings for files and microSteps (stored as JSON strings in SQLite)
  const microSteps = typeof task.microSteps === "string"
    ? JSON.parse(task.microSteps)
    : task.microSteps;
  const files = typeof task.files === "string"
    ? JSON.parse(task.files)
    : task.files;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title={task.title} backHref={`/repo/${repoId}`} />

      <main className="max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Task Info */}
        <TaskDetailContent task={task} microSteps={microSteps} files={files} />

        {/* Check-in Section */}
        {task.status !== "DONE" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Check In</h2>
            <CheckInForm taskId={taskId} repoId={repoId} taskTitle={task.title} />
          </div>
        )}

        {/* Mark Done Button */}
        {task.status !== "DONE" && (
          <MarkTaskDoneButton taskId={taskId} repoId={repoId} />
        )}

        {task.status === "DONE" && (
          <div className="rounded-lg backdrop-blur-md bg-emerald-600/10 border border-emerald-500/30 p-6 text-center">
            <p className="text-emerald-400 font-semibold text-lg flex items-center justify-center gap-2">
              <Check className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
              Task completed! Great work shipping this feature.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
