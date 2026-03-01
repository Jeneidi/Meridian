"use client";

import { motion } from "framer-motion";
import { Link2, Map, Rocket, Users } from "lucide-react";

const stepIcons = [
  { Icon: Link2, className: "text-indigo-400" },
  { Icon: Map, className: "text-emerald-400" },
  { Icon: Users, className: "text-indigo-400" },
];

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Connect Your Repos",
      description:
        "Authenticate with GitHub. Your team connects repos—one to many. Meridian reads structure, README, and open issues (never stores code).",
    },
    {
      number: "2",
      title: "AI Analyzes Together",
      description:
        "Claude analyzes your codebase. Generates up to 20 priority-ordered tasks or gives you a green light. Your team reviews the roadmap together.",
    },
    {
      number: "3",
      title: "Check In & Get Coached",
      description:
        "Commit your work. Meridian reads your diff and gives you honest AI coaching on what you shipped. Stay accountable, keep the streak.",
    },
  ];

  const easeOutExpo = [0.16, 1, 0.3, 1] as const;
  const fromBelow = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
  };

  const fromLeft = {
    hidden: { opacity: 0, x: -32, y: 4 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
  };

  const fromRight = {
    hidden: { opacity: 0, x: 32, y: 4 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
  };

  const iconPop = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
  };

  return (
    <section
      id="how-it-works"
      className="py-20 px-4"
    >
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
            The Process
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white"
            variants={fromBelow}
          >
            How Teams Ship With Meridian
          </motion.h2>
          <motion.p
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
            variants={fromBelow}
          >
            Three simple steps from planning to shipping together
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        >
          {steps.map((step, index) => {
            const variants = index === 0 ? fromLeft : index === 3 ? fromRight : fromBelow;
            const { Icon, className } = stepIcons[index];
            return (
              <motion.div
                key={step.number}
                className="rounded-md bg-zinc-900 border border-zinc-800 p-8 space-y-4"
                variants={variants}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } }}
              >
                {/* Icon & Number */}
                <div className="space-y-3">
                  <motion.div className={`${className}`} variants={iconPop}>
                    <Icon className="w-12 h-12" strokeWidth={1.5} />
                  </motion.div>
                  <motion.div
                    className="inline-block rounded-full bg-indigo-600/20 border border-indigo-500/30 px-4 py-2"
                    variants={iconPop}
                  >
                    <span className="text-indigo-400 font-bold text-lg">
                      Step {step.number}
                    </span>
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Visual Flow */}
        <motion.div
          className="mt-12 hidden md:flex items-center justify-center gap-4 text-slate-600"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}
        >
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-indigo-600/50 to-transparent origin-left"
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.5 } }
            }}
          />
          <motion.span className="text-xl" variants={fromBelow}>
            →
          </motion.span>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent via-emerald-600/50 to-transparent origin-center"
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.5 } }
            }}
          />
          <motion.span className="text-xl" variants={fromBelow}>
            →
          </motion.span>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-transparent to-indigo-600/50 origin-right"
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.5 } }
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
