import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { CheckInForm } from "@/components/app/CheckInForm";
import { Button } from "@/components/ui/button";

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: repoId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get repo and verify ownership
  const repo = await prisma.repo.findUnique({
    where: { id: repoId },
  });

  if (!repo || repo.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Get today's task
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

  // Get task completion stats for this repo
  const completedTasks = await prisma.task.findMany({
    where: {
      repoId,
      status: "DONE",
    },
  });

  const totalTasks = await prisma.task.count({
    where: { repoId },
  });

  const completionPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  if (!dailyTask) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <PageHeader title="Check-In Session" backHref={`/repo/${repoId}`} />

        <main className="max-w-7xl mx-auto px-8 py-12">
          <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">No Task Selected</h2>
            <p className="text-slate-300 mb-8">
              Generate a roadmap or select a task to start a check-in session.
            </p>
            <Link href={`/repo/${repoId}`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Go to Roadmap
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title="Check-In Session" backHref={`/repo/${repoId}`} />

      <main className="max-w-7xl mx-auto px-8 py-12">

        {/* Task Context Card */}
        <div className="mb-8 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8">
          <p className="text-slate-300 mb-6">
            How did your session on <span className="text-indigo-400 font-semibold">"{dailyTask.task.title}"</span> go?
          </p>

          {/* Task Details */}
          <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Estimate</p>
              <p className="text-lg text-white font-semibold">{dailyTask.task.estimate} min</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Difficulty</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-3 rounded-full ${
                      i < dailyTask.task.difficulty ? "bg-orange-500" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Progress</p>
              <p className="text-lg text-white font-semibold">{completionPercent}%</p>
            </div>
          </div>

          {/* Roadmap Progress */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <BarChart3 className="w-4 h-4" />
            <span>
              {completedTasks.length} of {totalTasks} tasks completed
            </span>
          </div>
        </div>

        {/* Check-In Form */}
        <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8">
          <CheckInForm
            taskId={dailyTask.task.id}
            repoId={repoId}
            taskTitle={dailyTask.task.title}
          />
        </div>

        {/* Help Text */}
        <div className="mt-8 rounded-lg backdrop-blur-md bg-slate-900/50 border border-white/5 p-6">
          <h3 className="text-sm font-semibold text-white mb-3">💡 Tips for a Great Check-In</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Be specific about what you built, not generic ("Added authentication" vs "Coded stuff")</li>
            <li>• Paste a git diff for more context-aware coaching (optional but better)</li>
            <li>• Mention blockers or surprises you encountered</li>
            <li>• Get honest feedback on scope and next steps</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
