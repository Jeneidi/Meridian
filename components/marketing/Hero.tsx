"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Tagline */}
        <div className="space-y-3">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">
            The Shipping Coach for Builders
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Stop planning.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              Start shipping.
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Connect your GitHub repo. Let AI break it into 30-minute tasks. Ship with
          daily accountability and diff-aware coaching.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/login">
            <Button className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white text-lg px-8 py-6 rounded-lg font-semibold transition">
              Start Free with GitHub →
            </Button>
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-6 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition"
          >
            Learn How It Works
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="pt-8 flex flex-col sm:flex-row gap-8 justify-center text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Free GitHub OAuth login
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            AI-powered roadmaps
          </div>
        </div>
      </div>
    </div>
  );
}
