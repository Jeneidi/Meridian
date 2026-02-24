import Link from "next/link";

interface DailyTaskWidgetProps {
  repoId: string;
  taskId?: string;
  taskTitle?: string;
  reasoning?: string;
  estimate?: number;
  difficulty?: number;
}

export function DailyTaskWidget({
  repoId,
  taskId,
  taskTitle,
  reasoning,
  estimate,
  difficulty,
}: DailyTaskWidgetProps) {
  if (!taskId) {
    return (
      <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 text-center">
        <p className="text-slate-400">
          All tasks completed! 🎉 Generate a new roadmap or connect another repo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg backdrop-blur-md bg-gradient-to-br from-indigo-600/30 via-slate-800/30 to-emerald-600/30 border border-indigo-500/30 p-8">
      <div className="mb-4">
        <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full">
          Today's Focus
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">
        {taskTitle}
      </h3>

      {reasoning && (
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          {reasoning}
        </p>
      )}

      <div className="flex gap-4 mb-6 text-sm">
        {estimate && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">⏱</span>
            <span className="text-white font-semibold">{estimate} min</span>
          </div>
        )}
        {difficulty && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">📊</span>
            <span className="text-white">Level {difficulty}/5</span>
          </div>
        )}
      </div>

      <Link href={`/repo/${repoId}/task/${taskId}`}>
        <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold hover:from-indigo-700 hover:to-emerald-700 transition">
          Start Task →
        </button>
      </Link>
    </div>
  );
}
