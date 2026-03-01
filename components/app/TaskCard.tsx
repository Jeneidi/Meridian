import Link from "next/link";
import { formatEstimate } from "@/lib/format";

interface TaskCardProps {
  id: string;
  title: string;
  estimate: 30 | 60;
  difficulty: 1 | 2 | 3 | 4 | 5;
  priority: number;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED";
  repoId: string;
}

const difficultyColors = {
  1: "bg-emerald-500/20 text-emerald-300",
  2: "bg-cyan-500/20 text-cyan-300",
  3: "bg-yellow-500/20 text-yellow-300",
  4: "bg-orange-500/20 text-orange-300",
  5: "bg-red-500/20 text-red-300",
};

const statusBadges = {
  TODO: "bg-slate-500/20 text-slate-300",
  IN_PROGRESS: "bg-blue-500/20 text-blue-300",
  DONE: "bg-emerald-500/20 text-emerald-300",
  SKIPPED: "bg-slate-500/20 text-slate-300 line-through",
};

export function TaskCard({ id, title, estimate, difficulty, priority, status, repoId }: TaskCardProps) {
  return (
    <Link href={`/repo/${repoId}/task/${id}`}>
      <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition flex-1 pr-3">
            {title}
          </h3>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full whitespace-nowrap">
            {formatEstimate(estimate)}
          </span>
        </div>

        {/* Effort Signal Bar */}
        <div className="mb-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
            style={{ width: `${difficulty * 20}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${difficultyColors[difficulty]}`}>
              Level {difficulty}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${statusBadges[status]}`}>
              {status === "DONE" ? "Done" : status === "IN_PROGRESS" ? "In Progress" : "To Do"}
            </span>
          </div>
          <span className="text-xs text-slate-400">Priority {priority}/10</span>
        </div>
      </div>
    </Link>
  );
}
