import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckInForm } from "@/components/app/CheckInForm";
import Link from "next/link";

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

  const difficultyColor = {
    1: "text-emerald-400",
    2: "text-cyan-400",
    3: "text-yellow-400",
    4: "text-orange-400",
    5: "text-red-400",
  }[task.difficulty as 1 | 2 | 3 | 4 | 5];

  const statusBadge = {
    TODO: "bg-slate-500/20 text-slate-300",
    IN_PROGRESS: "bg-blue-500/20 text-blue-300",
    DONE: "bg-emerald-500/20 text-emerald-300",
    SKIPPED: "bg-slate-500/20 text-slate-300",
  }[task.status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <Link
            href={`/repo/${repoId}`}
            className="text-sm text-slate-400 hover:text-slate-300 transition mb-3"
          >
            ← Back to Repo
          </Link>
          <h1 className="text-3xl font-bold text-white">{task.title}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        {/* Task Info */}
        <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 space-y-6">
          <p className="text-slate-300 text-lg leading-relaxed">
            {task.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Estimate
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {task.estimate}m
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Difficulty
              </p>
              <p className={`text-2xl font-bold ${difficultyColor}`}>
                {task.difficulty}/5
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Priority
              </p>
              <p className="text-2xl font-bold text-indigo-400">
                {task.priority}/10
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Status
              </p>
              <span className={`inline-block text-sm font-semibold px-3 py-1 rounded ${statusBadge}`}>
                {task.status === "DONE"
                  ? "Done"
                  : task.status === "IN_PROGRESS"
                    ? "In Progress"
                    : task.status === "SKIPPED"
                      ? "Skipped"
                      : "To Do"}
              </span>
            </div>
          </div>

          {/* Micro Steps */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Micro Steps
            </h3>
            <ol className="space-y-3">
              {task.microSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <span className="text-indigo-400 font-semibold flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Files */}
          {task.files.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Likely Files to Touch
              </h3>
              <ul className="space-y-2">
                {task.files.map((file) => (
                  <li key={file} className="text-slate-400 text-sm font-mono">
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Check-in Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Check In</h2>
          <CheckInForm taskId={taskId} repoId={repoId} taskTitle={task.title} />
        </div>

        {/* Mark Done Button */}
        {task.status !== "DONE" && (
          <div className="flex gap-3">
            <Link href={`/repo/${repoId}`} className="flex-1">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                ✓ Mark Done
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
