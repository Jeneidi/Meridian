"use client";

import { signOut } from "next-auth/react";
import { CheckCircle2, LogOut, Save } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  email: string;
  name: string | null;
  plan: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setUser(data);
        setDisplayName(data.name || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSaveDisplayName = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName }),
      });

      if (!response.ok) {
        throw new Error("Failed to save display name");
      }

      setSaveMessage("✓ Display name saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving display name:", error);
      setSaveMessage("Error saving display name");
    } finally {
      setIsSaving(false);
    }
  };

  const planInfo: Record<string, { name: string; price: string; color: string }> = {
    FREE: { name: "Free", price: "", color: "text-slate-400" },
    PRO: { name: "Pro", price: "$7.99/month", color: "text-indigo-400" },
    PREMIUM: { name: "Premium", price: "$17.99/month", color: "text-amber-400" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <PageHeader title="My Account" />
        <main className="max-w-4xl mx-auto px-8 py-12">
          <div className="text-slate-400">Loading profile...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <PageHeader title="My Account" />
        <main className="max-w-4xl mx-auto px-8 py-12">
          <div className="text-red-400">Failed to load profile</div>
        </main>
      </div>
    );
  }

  const info = planInfo[user.plan];
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title="My Account" />

      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-8">
          {/* Profile Information */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>

            <div className="space-y-6">
              {/* Email Address */}
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                  />
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Your email is verified and cannot be changed.
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-2">
                  Display Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setSaveMessage("");
                    }}
                    placeholder="Add your display name"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSaveDisplayName}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
                {saveMessage && (
                  <p className={`text-xs mt-2 ${saveMessage.includes("successfully") ? "text-emerald-400" : "text-red-400"}`}>
                    {saveMessage}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  This name appears on your account profile.
                </p>
              </div>

              {/* Member Since */}
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-2">
                  Member Since
                </label>
                <input
                  type="text"
                  value={memberSince}
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          </section>

          {/* Subscription */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Subscription</h2>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Current Plan</p>
                  <h3 className={`text-3xl font-bold ${info.color}`}>
                    {info.name} Plan
                  </h3>
                  {info.price && <p className="text-slate-400 text-sm mt-2">{info.price}</p>}
                </div>
              </div>

              {user.plan === "FREE" && (
                <Link href="/pricing">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition">
                    Upgrade to Pro
                  </button>
                </Link>
              )}
            </div>
          </section>

          {/* Account Actions */}
          <section className="space-y-6 border-t border-slate-700 pt-8">
            <h2 className="text-2xl font-bold text-white">Account Actions</h2>

            <div className="space-y-3">
              {/* Sign Out */}
              <button
                onClick={() => signOut({ redirectTo: "/" })}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
