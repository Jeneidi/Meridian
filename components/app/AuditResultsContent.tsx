"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ScanResult {
  issues: Array<{
    file: string;
    type: string;
    severity: string;
    description: string;
  }>;
  totalIssuesFound: number;
}

interface AuditData {
  tier: "free" | "pro" | "premium";
  scanResult: ScanResult;
  aiReport: string | null;
  upgrade?: {
    message: string;
    url: string;
  };
}

interface AuditResultsContentProps {
  repoId: string;
}

export function AuditResultsContent({ repoId }: AuditResultsContentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditData | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

  useEffect(() => {
    const runAudit = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/repos/${repoId}/audit`, {
          method: "POST",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to run audit");
        }

        const auditData = await response.json();
        setData(auditData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    runAudit();
  }, [repoId]);

  if (loading) {
    return (
      <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-4" />
        <p className="text-slate-300">Running security audit...</p>
        <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg backdrop-blur-md bg-red-500/10 border border-red-500/30 p-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-300 mb-2">Audit Failed</h3>
            <p className="text-red-200">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const toggleIssue = (index: number) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIssues(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 border-red-500/50 text-red-300";
      case "high":
        return "bg-orange-500/20 border-orange-500/50 text-orange-300";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      case "low":
        return "bg-blue-500/20 border-blue-500/50 text-blue-300";
      default:
        return "bg-slate-500/20 border-slate-500/50 text-slate-300";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6">
          <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Scan Tier</p>
          <p className="text-2xl font-bold text-white capitalize">{data.tier} Plan</p>
        </div>
        <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6">
          <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Issues Found</p>
          <p className="text-2xl font-bold text-white">{data.scanResult.totalIssuesFound}</p>
        </div>
        <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6">
          <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Analysis Type</p>
          <p className="text-lg font-bold text-white">
            {data.aiReport ? "Deep + Surface" : "Surface Only"}
          </p>
        </div>
      </div>

      {/* Surface-Level Scan Results */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Surface-Level Scan</h2>
        <p className="text-slate-400 mb-6">
          Pattern-based detection in configuration files, dependencies, and issue descriptions.
        </p>

        {data.scanResult.totalIssuesFound === 0 ? (
          <div className="rounded-lg backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 p-8 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-emerald-300 font-semibold">No issues detected in surface scan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.scanResult.issues.map((issue, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 transition cursor-pointer hover:bg-white/10 ${getSeverityColor(
                  issue.severity
                )}`}
              >
                <div
                  onClick={() => toggleIssue(index)}
                  className="flex items-start justify-between"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(issue.severity)}
                    <div>
                      <h4 className="font-semibold mb-1">{issue.type}</h4>
                      <p className="text-sm opacity-90">{issue.file}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-white/10">
                      {issue.severity}
                    </span>
                    {expandedIssues.has(index) ? (
                      <ChevronUp className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {expandedIssues.has(index) && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-sm">{issue.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Deep Analysis */}
      {data.upgrade ? (
        <div className="rounded-lg backdrop-blur-md bg-indigo-500/10 border border-indigo-500/30 p-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">Deep Code Analysis</h3>
              <p className="text-indigo-200 mb-4">
                {data.upgrade.message}
              </p>
              <Link href={data.upgrade.url}>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Upgrade to {data.tier === "free" ? "Pro" : "Premium"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Deep Code Analysis (Claude AI)</h2>
          <p className="text-slate-400 mb-6">
            Advanced analysis of your source code for security patterns and vulnerabilities.
          </p>

          <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 prose prose-invert max-w-none">
            {data.aiReport ? (
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {data.aiReport}
              </div>
            ) : (
              <p className="text-slate-400">No AI report available.</p>
            )}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="rounded-lg backdrop-blur-md bg-slate-900/50 border border-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📋 Next Steps</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex gap-3">
            <span className="text-indigo-400 flex-shrink-0">1.</span>
            <span>Review the issues above and prioritize by severity</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 flex-shrink-0">2.</span>
            <span>Create tasks in your roadmap to address each issue</span>
          </li>
          {!data.upgrade && (
            <li className="flex gap-3">
              <span className="text-indigo-400 flex-shrink-0">3.</span>
              <span>Track fixes in your task check-ins for accountability</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
