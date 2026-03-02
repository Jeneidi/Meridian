"use client";

import { useState } from "react";
import { Zap, Loader2, Crown } from "lucide-react";

export function RateLimitTestPanel() {
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [tierLoading, setTierLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddRoadmap = async () => {
    setRoadmapLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/dev/add-roadmap-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add roadmap generation");
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: `✓ Added roadmap gen. Remaining: ${data.remaining}`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleAddAudit = async () => {
    setAuditLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/dev/add-security-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add security audit");
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: `✓ Added security audit. Remaining: ${data.remaining}`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setAuditLoading(false);
    }
  };

  const handleUpgradeTier = async () => {
    setTierLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/dev/upgrade-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upgrade tier");
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: `✓ Upgraded to ${data.currentPlan}. Refresh to see changes.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setTierLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-6 mb-8">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        Dev Testing Tools
      </h3>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleAddRoadmap}
          disabled={roadmapLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
        >
          {roadmapLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              +1 Roadmap Gen
            </>
          )}
        </button>

        <button
          onClick={handleAddAudit}
          disabled={auditLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
        >
          {auditLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              +1 Security Audit
            </>
          )}
        </button>

        <button
          onClick={handleUpgradeTier}
          disabled={tierLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
        >
          {tierLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Upgrading...
            </>
          ) : (
            <>
              <Crown className="w-4 h-4" />
              Upgrade to PRO
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 p-2 rounded text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
