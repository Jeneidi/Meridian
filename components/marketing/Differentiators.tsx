"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Package,
  Target,
  Zap,
  Check,
  X,
  Users,
} from "lucide-react";

const iconByColor: Record<string, string> = {
  "from-indigo-600/20 to-indigo-600/10": "text-indigo-400",
  "from-emerald-600/20 to-emerald-600/10": "text-emerald-400",
  "from-cyan-600/20 to-cyan-600/10": "text-cyan-400",
  "from-orange-600/20 to-orange-600/10": "text-orange-400",
  "from-rose-600/20 to-rose-600/10": "text-rose-400",
  "from-violet-600/20 to-violet-600/10": "text-violet-400",
};

/** Comparison: Meridian vs Copilot vs Generic Tutoring */
const comparisonRows: { feature: string; meridian: boolean; copilot: boolean; genericTutoring: boolean }[] = [
  { feature: "Repo Analysis", meridian: true, copilot: false, genericTutoring: false },
  { feature: "AI Roadmapping", meridian: true, copilot: false, genericTutoring: false },
  { feature: "Daily Task Selection", meridian: true, copilot: false, genericTutoring: false },
  { feature: "Diff-Aware Coaching", meridian: true, copilot: false, genericTutoring: false },
  { feature: "Streak Tracking", meridian: true, copilot: false, genericTutoring: false },
  { feature: "Writes Code", meridian: false, copilot: true, genericTutoring: true },
  { feature: "Learning-Focused", meridian: false, copilot: true, genericTutoring: true },
  { feature: "Free for Projects", meridian: true, copilot: false, genericTutoring: false },
];

export function Differentiators() {
  const differentiators = [
    {
      title: "Built for Teams",
      description:
        "Shared roadmaps, team dashboards, accountability across engineers. Know what everyone is shipping, every day.",
      Icon: Users,
      color: "from-indigo-600/20 to-indigo-600/10",
    },
    {
      title: "Analysis-First",
      description:
        "We deeply analyze your codebase across repos, not just generate tasks. Give your team honest feedback on what to build.",
      Icon: FileText,
      color: "from-cyan-600/20 to-cyan-600/10",
    },
    {
      title: "Honest Feedback",
      description:
        "Up to 20 priority-ordered tasks (only if needed). Diff-aware coaching after each shipped feature. Real next steps.",
      Icon: Package,
      color: "from-orange-600/20 to-orange-600/10",
    },
    {
      title: "Accountability Built-In",
      description:
        "Daily task selection, team streaks, shared progress. Ship consistently as a team. No burnout.",
      Icon: Target,
      color: "from-rose-600/20 to-rose-600/10",
    },
    {
      title: "Indie-Friendly Too",
      description:
        "Solo developers get a free tier. Test Meridian on your personal projects. Perfect for students and side hustles.",
      Icon: Zap,
      color: "from-violet-600/20 to-violet-600/10",
    },
  ];

  const easeOutExpo = [0.16, 1, 0.3, 1] as const;
  const fromBelow = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
  };

  const cardLanding = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: easeOutExpo } },
  };

  const iconPop = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 20, delay: 0.06 } },
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
        >
          <motion.p
            className="text-indigo-400 text-xs font-medium flex items-center gap-2 justify-center"
            variants={fromBelow}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
            Why Meridian
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white"
            variants={fromBelow}
          >
            Built for Teams Shipping Together
          </motion.h2>
          <motion.p
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
            variants={fromBelow}
          >
            Not a project manager, not a code writer, not a chaos manager.
            <br />
            The AI planning layer for dev teams that ship.
          </motion.p>
        </motion.div>

        {/* Differentiators Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } }}
        >
          {differentiators.map((item) => (
            <motion.div
              key={item.title}
              className="rounded-md bg-zinc-900 border border-zinc-800 p-6"
              variants={cardLanding}
              whileHover={{ y: -5, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } }}
            >
              <motion.div className="mb-4 text-indigo-400" variants={iconPop}>
                <item.Icon className="w-10 h-10" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="mt-16 rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900/30"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fromBelow}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80">
                  <th className="text-left px-4 sm:px-6 py-4 font-semibold text-white">
                    Feature
                  </th>
                  <th className="text-center px-4 sm:px-6 py-4 font-semibold text-white bg-indigo-600/20">
                    Meridian
                  </th>
                  <th className="text-center px-4 sm:px-6 py-4 font-semibold text-zinc-400">
                    Copilot
                  </th>
                  <th className="text-center px-4 sm:px-6 py-4 font-semibold text-zinc-400">
                    Generic Tutoring
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-zinc-800 ${i % 2 === 1 ? "bg-zinc-900/30" : ""} last:border-b-0`}
                  >
                    <td className="text-left px-4 sm:px-6 py-3.5 font-medium text-white whitespace-nowrap">
                      {row.feature}
                    </td>
                    <td className="text-center px-4 sm:px-6 py-3.5 bg-indigo-600/10">
                      {row.meridian ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <X className="w-5 h-5 text-zinc-600 mx-auto" strokeWidth={2} aria-hidden />
                      )}
                    </td>
                    <td className="text-center px-4 sm:px-6 py-3.5">
                      {row.copilot ? (
                        <Check className="w-5 h-5 text-zinc-500 mx-auto" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <X className="w-5 h-5 text-zinc-700 mx-auto" strokeWidth={2} aria-hidden />
                      )}
                    </td>
                    <td className="text-center px-4 sm:px-6 py-3.5">
                      {row.genericTutoring ? (
                        <Check className="w-5 h-5 text-zinc-500 mx-auto" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <X className="w-5 h-5 text-zinc-700 mx-auto" strokeWidth={2} aria-hidden />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
