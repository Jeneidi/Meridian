import { PartyPopper, Rocket, Zap, Flame } from "lucide-react";

interface ProgressBarProps {
  completedTasks: number;
  totalTasks: number;
  streak: number;
  repoName: string;
}

export function ProgressBar({
  completedTasks,
  totalTasks,
  streak,
  repoName,
}: ProgressBarProps) {
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Shipping Progress
          </h3>
          <span className="text-sm font-semibold text-emerald-400">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded bg-indigo-500/10 border border-indigo-500/20 p-4 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
            Streak
          </p>
          <p className="text-3xl font-bold text-indigo-400">{streak}</p>
          <p className="text-xs text-slate-500 mt-1">days</p>
        </div>

        <div className="rounded bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
            Completed
          </p>
          <p className="text-3xl font-bold text-emerald-400">{completedTasks}</p>
          <p className="text-xs text-slate-500 mt-1">tasks</p>
        </div>

        <div className="rounded bg-cyan-500/10 border border-cyan-500/20 p-4 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
            Remaining
          </p>
          <p className="text-3xl font-bold text-cyan-400">
            {Math.max(0, totalTasks - completedTasks)}
          </p>
          <p className="text-xs text-slate-500 mt-1">tasks</p>
        </div>
      </div>

      {/* Motivational message */}
      <div className="pt-4 border-t border-white/10">
        {progressPercent === 100 ? (
          <p className="text-sm text-emerald-400 font-semibold flex items-center gap-2">
            <PartyPopper className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2} />
            Roadmap complete! Generate a new one to keep shipping.
          </p>
        ) : progressPercent >= 75 ? (
          <p className="text-sm text-emerald-400 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2} />
            Almost done! Keep the momentum going.
          </p>
        ) : progressPercent >= 50 ? (
          <p className="text-sm text-indigo-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400 flex-shrink-0" strokeWidth={2} />
            Halfway there! You're making great progress.
          </p>
        ) : streak > 3 ? (
          <p className="text-sm text-indigo-400 flex items-center gap-2">
            <Flame className="w-4 h-4 text-indigo-400 flex-shrink-0" strokeWidth={2} />
            {streak}-day streak! Keep shipping.
          </p>
        ) : (
          <p className="text-sm text-slate-400">
            Focus on today's task and build momentum.
          </p>
        )}
      </div>
    </div>
  );
}
