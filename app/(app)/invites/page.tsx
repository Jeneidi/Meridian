"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { Bell, Loader2, Check, X } from "lucide-react";

interface Invite {
  id: string;
  repo: {
    id: string;
    name: string;
    fullName: string;
  };
  inviter: {
    name: string | null;
    email: string;
  };
  createdAt: string;
  status: string;
}

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchInvites();
  }, []);

  async function fetchInvites() {
    try {
      setLoading(true);
      const response = await fetch("/api/invites");
      if (!response.ok) throw new Error("Failed to fetch invites");
      const data = await response.json();
      setInvites(data.invites || []);
    } catch (err) {
      // Silently fail and show empty state
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(inviteId: string, action: "accept" | "decline") {
    setActionLoading((prev) => ({ ...prev, [inviteId]: true }));
    try {
      const response = await fetch(`/api/invites/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error("Failed to respond to invite");

      // Remove from list optimistically
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      // Error handled silently
      console.error("Invite action error:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [inviteId]: false }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-400" />
          <p className="text-zinc-400">Loading invites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title="Invites" />

      <main className="max-w-3xl mx-auto px-8 py-12">
        {invites.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">
              No pending invites
            </h2>
            <p className="text-zinc-500">
              You'll see invitations to collaborate on repos here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="rounded-lg bg-zinc-900 border border-zinc-800 p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {invite.repo.name}
                  </h3>
                  <p className="text-sm text-zinc-400">{invite.repo.fullName}</p>
                  <p className="text-sm text-zinc-500 mt-2">
                    Invited by{" "}
                    <span className="text-zinc-300 font-medium">
                      {invite.inviter.name || invite.inviter.email}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(invite.id, "accept")}
                    disabled={actionLoading[invite.id]}
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium transition flex items-center justify-center gap-2"
                  >
                    {actionLoading[invite.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {actionLoading[invite.id] ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    onClick={() => handleAction(invite.id, "decline")}
                    disabled={actionLoading[invite.id]}
                    className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white font-medium transition flex items-center justify-center gap-2"
                  >
                    {actionLoading[invite.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {actionLoading[invite.id] ? "Declining..." : "Decline"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
