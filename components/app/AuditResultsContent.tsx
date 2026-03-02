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

interface AIReportFinding {
  category: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  file?: string;
  line?: string;
  recommendation: string;
}

interface AIReport {
  projectType: string;
  projectContext: string;
  categoriesAudited: string[];
  categoriesSkipped: Array<{ name: string; reason: string }>;
  summary: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  findings: AIReportFinding[];
  recommendations: string[];
}

interface AuditData {
  tier: "free" | "pro" | "premium";
  scanResult: ScanResult;
  aiReport: AIReport | null;
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
      ) : data.aiReport ? (
        <div className="space-y-8">
          {/* Project Context */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Project Context</h2>
            <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6">
              <p className="text-sm font-semibold text-slate-400 mb-2 uppercase">Project Type</p>
              <p className="text-lg font-bold text-white mb-4 capitalize">{data.aiReport.projectType.replace("-", " ")}</p>
              <p className="text-slate-300">{data.aiReport.projectContext}</p>
            </div>
          </div>

          {/* Risk Summary */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Security Summary</h2>
            <div className={`rounded-lg backdrop-blur-md border p-6 ${
              data.aiReport.riskLevel === "critical" ? "bg-red-500/10 border-red-500/30" :
              data.aiReport.riskLevel === "high" ? "bg-orange-500/10 border-orange-500/30" :
              data.aiReport.riskLevel === "medium" ? "bg-yellow-500/10 border-yellow-500/30" :
              "bg-emerald-500/10 border-emerald-500/30"
            }`}>
              <p className="text-sm font-semibold text-slate-400 mb-2 uppercase">Overall Risk Level</p>
              <p className={`text-2xl font-bold mb-4 capitalize ${
                data.aiReport.riskLevel === "critical" ? "text-red-300" :
                data.aiReport.riskLevel === "high" ? "text-orange-300" :
                data.aiReport.riskLevel === "medium" ? "text-yellow-300" :
                "text-emerald-300"
              }`}>{data.aiReport.riskLevel}</p>
              <p className="text-slate-300">{data.aiReport.summary}</p>
            </div>
          </div>

          {/* Audit Scope */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Audit Scope</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 p-4">
                <p className="text-xs font-semibold text-emerald-400 mb-3 uppercase">Audit Coverage</p>
                <div className="flex flex-wrap gap-2">
                  {data.aiReport.categoriesAudited.map((cat) => (
                    <span key={cat} className="px-2 py-1 rounded text-xs bg-emerald-500/30 text-emerald-200">
                      ✓ {cat}
                    </span>
                  ))}
                </div>
              </div>
              {data.aiReport.categoriesSkipped.length > 0 && (
                <div className="rounded-lg backdrop-blur-md bg-slate-700/10 border border-slate-500/30 p-4">
                  <p className="text-xs font-semibold text-slate-400 mb-3 uppercase">Not Audited</p>
                  <div className="space-y-1">
                    {data.aiReport.categoriesSkipped.map((skip) => (
                      <div key={skip.name} className="text-xs text-slate-400">
                        <span className="font-semibold">○ {skip.name}</span>
                        <p className="text-slate-500 ml-4">{skip.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Findings */}
          {data.aiReport.findings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Detailed Findings ({data.aiReport.findings.length})</h2>
              <div className="space-y-4">
                {data.aiReport.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-6 ${getSeverityColor(finding.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-1">{finding.category}</h4>
                        <p className="text-sm opacity-90">{finding.description}</p>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded bg-white/10 ml-4 whitespace-nowrap">
                        {finding.severity}
                      </span>
                    </div>
                    {(finding.file || finding.line) && (
                      <div className="text-sm text-slate-300 mb-3 font-mono">
                        {finding.file && <span>{finding.file}</span>}
                        {finding.line && <span> : {finding.line}</span>}
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-sm font-semibold mb-1 text-slate-300">Recommendation:</p>
                      <p className="text-sm text-slate-200">{finding.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {data.aiReport.recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">High-Level Recommendations</h2>
              <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6">
                <ul className="space-y-2">
                  {data.aiReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300">
                      <span className="text-indigo-400 flex-shrink-0">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-slate-400">No AI report available.</p>
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
