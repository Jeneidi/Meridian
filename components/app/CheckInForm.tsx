"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoachingResponse } from "./CoachingResponse";

interface CheckInFormProps {
  taskId: string;
  repoId: string;
  taskTitle: string;
}

export function CheckInForm({ taskId, repoId, taskTitle }: CheckInFormProps) {
  const [summary, setSummary] = useState("");
  const [diffSnippet, setDiffSnippet] = useState("");
  const [loading, setLoading] = useState(false);
  const [coaching, setCoaching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCoaching(null);

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          repoId,
          summary,
          diffSnippet: diffSnippet || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit check-in");
      }

      const data = await response.json();
      setCoaching(data.coaching);
      setSummary("");
      setDiffSnippet("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (coaching) {
    return (
      <div className="space-y-6">
        <CoachingResponse coaching={coaching} taskTitle={taskTitle} />
        <button
          onClick={() => {
            setCoaching(null);
            setSummary("");
            setDiffSnippet("");
          }}
          className="text-sm text-slate-400 hover:text-slate-300 transition"
        >
          ← Start another check-in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          What did you accomplish?
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="e.g., Implemented user authentication, fixed login bug, added dark mode toggle..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Git diff (optional)
        </label>
        <textarea
          value={diffSnippet}
          onChange={(e) => setDiffSnippet(e.target.value)}
          placeholder="Paste your git diff here (last 2000 chars will be used)..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono text-xs"
        />
        <p className="text-xs text-slate-500 mt-2">
          Paste output of: git diff HEAD~1 (optional — helps with context)
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!summary.trim() || loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Getting coaching..." : "Get Coaching →"}
      </Button>
    </form>
  );
}
