"use client";

import { motion } from "framer-motion";
import { formatEstimate } from "@/lib/format";

interface Task {
  id: string;
  title: string;
  description: string;
  estimate: number;
  difficulty: number;
  priority: number;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED";
}

interface TaskDetailContentProps {
  task: Task;
  microSteps: string[];
  files: string[];
}

export function TaskDetailContent({ task, microSteps, files }: TaskDetailContentProps) {
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

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
    <motion.div
      className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <p className="text-slate-300 text-lg leading-relaxed">
        {task.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Estimate
          </p>
          <p className="text-2xl font-bold text-emerald-400">
            {formatEstimate(task.estimate)}
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
      {Array.isArray(microSteps) && microSteps.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
            Micro Steps
          </h3>
          <motion.ol
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {microSteps.map((step, i) => (
              <motion.li key={i} className="flex gap-3 text-slate-300" variants={fadeUp}>
                <span className="text-indigo-400 font-semibold flex-shrink-0">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      )}

      {/* Files */}
      {Array.isArray(files) && files.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
            Likely Files to Touch
          </h3>
          <motion.ul
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {files.map((file) => (
              <motion.li key={file} className="text-slate-400 text-sm font-mono" variants={fadeUp}>
                {file}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </motion.div>
  );
}
