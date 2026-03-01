"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Hero() {
  const easeOutExpo = [0.16, 1, 0.3, 1] as const;
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const fromBelow = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutExpo } },
  };

  const fromBelowLarge = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutExpo } },
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]">
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Tagline */}
        <motion.div className="space-y-3" variants={containerVariants}>
          <motion.p
            className="text-indigo-400 text-xs font-medium flex items-center gap-2 justify-center"
            variants={fromBelow}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
            The Shipping Coach for Teams
          </motion.p>
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white leading-tight tracking-tighter"
            variants={fromBelowLarge}
          >
            Stop planning.<br />
            <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent animate-gradient">
              Start shipping.
            </span>
          </motion.h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          variants={fadeUp}
        >
          Connect your GitHub repos. Claude analyzes them. Your team ships with shared accountability—every single day.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center pt-4" variants={fadeUp}>
          <Link href="/login">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/40 text-white text-lg px-8 py-6 rounded-lg font-semibold">
                Start Free with GitHub →
              </Button>
            </motion.div>
          </Link>
          <motion.a
            href="#how-it-works"
            className="px-8 py-6 rounded-lg border border-zinc-700 text-white font-semibold hover:bg-zinc-900"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn How It Works
          </motion.a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="pt-8 flex flex-col sm:flex-row gap-8 justify-center text-zinc-500 text-sm"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } }}
        >
          <motion.div className="flex items-center gap-2" variants={fromBelow}>
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
            No credit card required
          </motion.div>
          <motion.div className="flex items-center gap-2" variants={fromBelow}>
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
            AI-powered roadmaps included
          </motion.div>
          <motion.div className="flex items-center gap-2" variants={fromBelow}>
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
            Works with GitHub OAuth
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
