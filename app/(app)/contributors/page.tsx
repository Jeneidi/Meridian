"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { UserPlus, Loader2, Send } from "lucide-react";

interface Repo {
  id: string;
  name: string;
  fullName: string;
}

export default function ContributorsPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRepos();
  }, []);

  async function fetchRepos() {
    try {
      setLoading(true);
      const response = await fetch("/api/repos");
      if (!response.ok) throw new Error("Failed to fetch repos");
      const data = await response.json();
      setRepos(data.repos || []);
      if (data.repos?.length > 0) {
        setSelectedRepoId(data.repos[0].id);
      }
    } catch (err) {
      console.error("Error fetching repos:", err);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRepoId || !email) return;

    setSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId: selectedRepoId, email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send invite");
      }

      setMessage("✓ Invite sent successfully!");
      setEmail("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-400" />
          <p className="text-zinc-400">Loading repos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title="Add Contributors" />

      <main className="max-w-2xl mx-auto px-8 py-12">
        {repos.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">
              No repos found
            </h2>
            <p className="text-zinc-500">
              Connect a GitHub repo first to invite contributors
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Invite a contributor to your repo
            </h2>

            <form onSubmit={handleInvite} className="space-y-6">
              {/* Repo Selection */}
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-2">
                  Select Repository
                </label>
                <select
                  value={selectedRepoId}
                  onChange={(e) => setSelectedRepoId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {repos.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.name} ({repo.fullName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Input */}
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-2">
                  Contributor Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage("");
                  }}
                  placeholder="colleague@company.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  disabled={sending}
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  The person must already have a Meridian account
                </p>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-3 rounded-lg ${
                    message.includes("successfully")
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                      : "bg-red-500/10 border border-red-500/20 text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending || !selectedRepoId || !email}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:opacity-50 text-white font-medium transition"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-sm text-slate-300">
                <span className="font-medium">How it works:</span> When you send
                an invite, the person will receive a notification to join this
                repo on their Invites page. They can accept or decline the
                invitation.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
