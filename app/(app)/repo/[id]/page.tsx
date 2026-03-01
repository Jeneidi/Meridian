"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { Shield, Loader2 } from "lucide-react";
import { formatEstimate } from "@/lib/format";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddCustomTaskDialog } from "@/components/app/AddCustomTaskDialog";
import { InviteContributorPanel } from "@/components/app/InviteContributorPanel";

interface RepoDetail {
  id: string;
  name: string;
  fullName: string;
  url: string;
  taskCount: number;
  connectedAt: string;
  roadmapGenAt: string | null;
}

interface Task {
  id: string;
  title: string;
  estimate: 30 | 60;
  difficulty: 1 | 2 | 3 | 4 | 5;
  priority: number;
}

export default function RepoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const repoId = params.id as string;

  const [repo, setRepo] = useState<RepoDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRepo();
  }, [repoId]);

  async function fetchRepo() {
    try {
      setLoading(true);
      const response = await fetch(`/api/repos/${repoId}`);
      if (!response.ok) throw new Error("Failed to fetch repo");

      const data = await response.json();
      setRepo(data.repo);
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateRoadmap() {
    try {
      setGenerating(true);
      setError(null);
      setMessage(null);

      const response = await fetch(`/api/repos/${repoId}/roadmap`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate roadmap");
      }

      const data = await response.json();
      setTasks(data.tasks || []);
      if (data.message) {
        setMessage(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-400" />
          <p className="text-zinc-400">Loading repository...</p>
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Repository Not Found</h1>
          <p className="text-zinc-400 mb-6">The repository you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title={repo.name} backHref="/dashboard" />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <p className="text-zinc-500 text-sm mb-8">{repo.fullName}</p>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-900">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-950/50 border border-emerald-900">
            <p className="text-emerald-400">{message}</p>
          </div>
        )}

        {/* Repo Info */}
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-zinc-500 text-sm">Connected</p>
              <p className="text-white">
                {new Date(repo.connectedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm">Roadmap Generated</p>
              <p className="text-white">
                {repo.roadmapGenAt
                  ? new Date(repo.roadmapGenAt).toLocaleDateString()
                  : "Not yet"}
              </p>
            </div>
          </div>

          {tasks.length === 0 ? (
            <>
              <p className="text-zinc-300 mb-6">
                No roadmap generated yet. Click the button below to generate a
                shipping roadmap from your repo.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={generating}
                  className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  {generating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {generating ? "Generating Roadmap..." : "Generate Roadmap"}
                </button>
                <Link href={`/repo/${repoId}/audit`} className="px-6 py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 flex items-center gap-2 transition inline-flex">
                  <Shield className="w-4 h-4" />
                  Security Audit
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-zinc-300 mb-6">
                {tasks.length} tasks in your roadmap
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={generating}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  {generating && <Loader2 className="w-3 h-3 animate-spin" />}
                  {generating ? "Regenerating..." : "Regenerate Roadmap"}
                </button>
                <Link href={`/repo/${repoId}/checkin`} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 flex items-center gap-2 transition inline-flex">
                  📝 Check-in Session
                </Link>
                <Link href={`/repo/${repoId}/audit`} className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm hover:bg-amber-700 flex items-center gap-2 transition inline-flex">
                  <Shield className="w-3 h-3" />
                  Security Audit
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Invite Contributors */}
        <InviteContributorPanel repoId={repoId} />

        {/* Tasks List */}
        {tasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Tasks</h2>
              <AddCustomTaskDialog repoId={repoId} onTaskAdded={fetchRepo} />
            </div>
            <motion.div
              className="grid gap-4"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={`/repo/${repoId}/task/${task.id}`}
                    className="border-b border-zinc-800 py-3.5 px-4 hover:bg-zinc-900/60 flex items-center justify-between group cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white group-hover:text-indigo-400 transition truncate">
                        {task.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                      <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">
                        {formatEstimate(task.estimate)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
