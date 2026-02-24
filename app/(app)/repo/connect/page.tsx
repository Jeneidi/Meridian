"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
}

export default function ConnectRepoPage() {
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGitHubRepos();
  }, []);

  async function fetchGitHubRepos() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/repos/search");
      if (!response.ok) {
        throw new Error("Failed to fetch your repositories");
      }

      const data = await response.json();
      setRepos(data.repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect(repo: GitHubRepo) {
    try {
      setConnecting(repo.id);
      setError(null);

      const response = await fetch("/api/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubRepoId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          url: repo.html_url,
          defaultBranch: repo.default_branch,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to connect repo");
      }

      // Redirect to repo detail page
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setConnecting(null);
    }
  }

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Connect a Repository</h1>
          <p className="text-slate-400 mt-2">
            Select a GitHub repository to generate your shipping roadmap
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchGitHubRepos}
              className="mt-2 text-red-300 underline hover:text-red-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Search Box */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search your repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-300">Fetching your repositories...</p>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-12 rounded-lg bg-white/5 border border-white/10">
            <p className="text-slate-300">
              {repos.length === 0
                ? "No repositories found. Make sure you have repos on GitHub."
                : "No repositories match your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-slate-400">{repo.full_name}</p>
                  </div>
                  <button
                    onClick={() => handleConnect(repo)}
                    disabled={connecting === repo.id}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {connecting === repo.id ? "Connecting..." : "Connect"}
                  </button>
                </div>
                {repo.description && (
                  <p className="text-sm text-slate-300">{repo.description}</p>
                )}
                <div className="mt-3 flex gap-4 text-xs text-slate-400">
                  <span>📌 {repo.default_branch}</span>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-200 underline"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
