"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Circle, Package, MapPin } from "lucide-react";

export function ScrollParallaxSides() {
  const { scrollYProgress } = useScroll();
  const p = scrollYProgress;

  // Funky: multi-keyframe y, x sway, wobbly rotation, slight scale
  const progressSteps = [0, 0.2, 0.4, 0.5, 0.65, 0.8, 0.92, 1];

  // Left card — sway right then left, wobble rotate, curve y
  const leftCardY = useTransform(p, progressSteps, [0, -80, -200, -280, -380, -450, -510, -540]);
  const leftCardX = useTransform(p, progressSteps, [0, 12, -8, 18, -12, 10, -5, 0]);
  const leftCardRotate = useTransform(p, progressSteps, [0, 4, -3, 7, -4, 5, -6, -8]);
  const leftCardScale = useTransform(p, [0, 0.5, 0.85, 1], [1, 1.02, 0.98, 0.96]);
  const leftCardOpacity = useTransform(p, [0, 0.82, 1], [1, 0.5, 0]);

  const leftBadgeY = useTransform(p, progressSteps, [0, -100, -240, -320, -420, -500, -560, -600]);
  const leftBadgeX = useTransform(p, progressSteps, [0, -10, 14, -6, 16, -14, 8, 0]);
  const leftBadgeRotate = useTransform(p, progressSteps, [0, -5, 6, -8, 4, -3, 5, 6]);
  const leftBadgeOpacity = useTransform(p, [0, 0.85, 1], [1, 0.4, 0]);

  // Right card — opposite sway, wobbly rotate
  const rightCardY = useTransform(p, progressSteps, [0, -70, -190, -270, -370, -460, -520, -560]);
  const rightCardX = useTransform(p, progressSteps, [0, -14, 10, -16, 12, -8, 6, 0]);
  const rightCardRotate = useTransform(p, progressSteps, [0, -4, 5, -7, 6, -5, 8, 10]);
  const rightCardScale = useTransform(p, [0, 0.45, 0.88, 1], [1, 1.03, 0.97, 0.94]);
  const rightCardOpacity = useTransform(p, [0, 0.84, 1], [1, 0.45, 0]);

  const rightCrateY = useTransform(p, progressSteps, [0, -90, -220, -310, -410, -490, -540, -590]);
  const rightCrateX = useTransform(p, progressSteps, [0, 8, -12, 6, -14, 10, -8, 0]);
  const rightCrateRotate = useTransform(p, progressSteps, [0, 6, -7, 9, -5, 7, -9, -11]);
  const rightCrateScale = useTransform(p, [0, 0.6, 0.9, 1], [1, 1.02, 0.98, 0.95]);
  const rightCrateOpacity = useTransform(p, [0, 0.86, 1], [1, 0.4, 0]);

  return (
    <>
      {/* Left: Task card + Done badge — overlay hero */}
      <div
        className="fixed left-[4%] top-0 bottom-0 w-[280px] max-w-[26vw] pointer-events-none z-20 hidden lg:block"
        aria-hidden
      >
        <motion.div
          className="absolute left-0 top-[22vh] w-[240px]"
          style={{
            y: leftCardY,
            x: leftCardX,
            rotate: leftCardRotate,
            scale: leftCardScale,
            opacity: leftCardOpacity,
          }}
        >
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400/90 mb-3">
              Today&apos;s task
            </p>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-300" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/95 truncate">
                  Add GitHub OAuth
                </p>
                <p className="text-xs text-slate-400 mt-0.5">30 min</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute left-0 top-[52vh] w-[200px]"
          style={{
            y: leftBadgeY,
            x: leftBadgeX,
            rotate: leftBadgeRotate,
            opacity: leftBadgeOpacity,
          }}
        >
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md shadow-xl shadow-emerald-500/10 px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-300" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300/95">3 done</p>
              <p className="text-[10px] text-emerald-400/70">this week</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Roadmap card + shipping crate — overlay hero */}
      <div
        className="fixed right-[4%] top-0 bottom-0 w-[280px] max-w-[26vw] pointer-events-none z-20 hidden lg:block"
        aria-hidden
      >
        <motion.div
          className="absolute right-0 top-[18vh] w-[240px]"
          style={{
            y: rightCardY,
            x: rightCardX,
            rotate: rightCardRotate,
            scale: rightCardScale,
            opacity: rightCardOpacity,
          }}
        >
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Roadmap
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Connect repo", done: true },
                { label: "Generate tasks", done: true },
                { label: "Ship daily", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {step.done ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />
                  ) : (
                    <Circle className="w-4 h-4 text-indigo-400/60 shrink-0" strokeWidth={2} />
                  )}
                  <span className="text-sm text-white/90">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute right-0 top-[50vh]"
          style={{
            y: rightCrateY,
            x: rightCrateX,
            rotate: rightCrateRotate,
            scale: rightCrateScale,
            opacity: rightCrateOpacity,
          }}
        >
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-5 flex flex-col items-center justify-center w-[140px] h-[120px]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/30 to-emerald-500/30 border border-white/10 flex items-center justify-center">
              <Package className="w-7 h-7 text-indigo-300/90" strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-3">
              Ship it
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
