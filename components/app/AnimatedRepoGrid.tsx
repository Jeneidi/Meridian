"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

interface Repo {
  id: string;
  name: string;
  fullName: string;
  tasks: { id: string }[];
  roadmapGenAt: Date | null;
}

interface AnimatedRepoGridProps {
  repos: Repo[];
}

export function AnimatedRepoGrid({ repos }: AnimatedRepoGridProps) {
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

  return (
    <motion.div
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {repos.map((repo) => (
        <Link key={repo.id} href={`/repo/${repo.id}`}>
          <motion.div
            className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition cursor-pointer group h-full"
            variants={fadeUp}
            whileHover={{ y: -3 }}
          >
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition mb-2 line-clamp-2">
              {repo.name}
            </h3>
            <p className="text-sm text-slate-400 mb-6 line-clamp-1">{repo.fullName}</p>

            <div className="space-y-3 text-sm border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Tasks:</span>
                <span className="text-white font-semibold">{repo.tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Roadmap:</span>
                <span className={`flex items-center gap-1.5 ${repo.roadmapGenAt ? "text-emerald-400" : "text-slate-400"}`}>
                  {repo.roadmapGenAt ? <><Check className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} /> Generated</> : "Pending"}
                </span>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
}
