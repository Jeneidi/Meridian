"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

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

      const response = await fetch(`/api/repos/${repoId}/roadmap`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate roadmap");
      }

      const data = await response.json();
      setTasks(data.tasks || []);

      // Refresh repo data to show updated timestamp
      await fetchRepo();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-300">Loading repo...</p>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">Repo not found</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0">
        <div className="px-8 py-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-indigo-400 hover:text-indigo-300 text-sm mb-3"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">{repo.name}</h1>
          <p className="text-slate-400 mt-1">{repo.fullName}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Repo Info */}
        <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-slate-400 text-sm">Connected</p>
              <p className="text-white">
                {new Date(repo.connectedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Roadmap Generated</p>
              <p className="text-white">
                {repo.roadmapGenAt
                  ? new Date(repo.roadmapGenAt).toLocaleDateString()
                  : "Not yet"}
              </p>
            </div>
          </div>

          {tasks.length === 0 ? (
            <>
              <p className="text-slate-300 mb-6">
                No roadmap generated yet. Click the button below to generate a
                shipping roadmap from your repo.
              </p>
              <button
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? "Generating Roadmap..." : "Generate Roadmap"}
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-300 mb-6">
                {tasks.length} tasks in your roadmap
              </p>
              <button
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600"
              >
                {generating ? "Regenerating..." : "Regenerate Roadmap"}
              </button>
            </>
          )}
        </div>

        {/* Tasks List */}
        {tasks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Tasks</h2>
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {task.title}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                      {task.estimate}m
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>
                      Difficulty:{" "}
                      <span className="text-white">{task.difficulty}/5</span>
                    </span>
                    <span>
                      Priority:{" "}
                      <span className="text-white">{task.priority}/10</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
