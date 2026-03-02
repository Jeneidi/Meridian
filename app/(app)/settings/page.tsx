import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StripePortalButton } from "@/components/app/StripePortalButton";
import { PageHeader } from "@/components/app/PageHeader";
import { CheckCircle2 } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const upgraded = params.upgraded === "true";

  const planInfo = {
    FREE: {
      name: "Free",
      color: "text-slate-400",
      bgColor: "bg-slate-700/30",
      borderColor: "border-slate-600",
      badge: "Free",
    },
    PRO: {
      name: "Pro",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      badge: "$7.99/month",
    },
    PREMIUM: {
      name: "Premium",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      badge: "$17.99/month",
    },
  };

  const info = planInfo[user.plan];

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title="Settings" backHref="/dashboard" />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <p className="text-slate-400 text-sm mb-8">{user.email}</p>
        {/* Success Banner */}
        {upgraded && (
          <div className="mb-8 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 font-semibold">
                Upgrade successful!
              </p>
              <p className="text-emerald-400 text-sm">
                Your account has been upgraded. You now have access to all {info.name} features.
              </p>
            </div>
          </div>
        )}

        {/* Current Plan Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Current Plan
            </h2>

            <div
              className={`rounded-lg ${info.bgColor} border ${info.borderColor} p-8`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-3xl font-bold ${info.color}`}>
                    {info.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    {info.badge}
                  </p>
                </div>
              </div>

              {user.plan === "FREE" ? (
                <div className="space-y-3">
                  <Link href="/pricing">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition">
                      Upgrade to Pro — $7.99/month
                    </button>
                  </Link>
                  <Link href="/pricing">
                    <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition">
                      Upgrade to Premium — $17.99/month
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <StripePortalButton />
                  <p className="text-slate-400 text-xs text-center">
                    Manage your subscription, update billing, or cancel anytime
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Plan Features */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Your Features
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {user.plan === "FREE" && (
                <>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm">
                      <span className="font-semibold">1</span> connected repo
                    </p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm">
                      <span className="font-semibold">1</span> roadmap/month
                    </p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm">
                      <span className="font-semibold">2</span> check-ins/day
                    </p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm">
                      Surface security scans
                    </p>
                  </div>
                </>
              )}

              {user.plan === "PRO" && (
                <>
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <p className="text-indigo-300 text-sm">
                      <span className="font-semibold">3</span> connected repos
                    </p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <p className="text-indigo-300 text-sm">
                      <span className="font-semibold">10</span> roadmaps/day
                    </p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <p className="text-indigo-300 text-sm">
                      <span className="font-semibold">10</span> check-ins/day
                    </p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <p className="text-indigo-300 text-sm">
                      <span className="font-semibold">3</span> deep audits/day
                    </p>
                  </div>
                  <div className="col-span-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <p className="text-indigo-300 text-sm">
                      Sonnet AI for smarter coaching
                    </p>
                  </div>
                </>
              )}

              {user.plan === "PREMIUM" && (
                <>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm">
                      <span className="font-semibold">10</span> connected repos
                    </p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm">
                      <span className="font-semibold">50</span> roadmaps/day
                    </p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm">
                      <span className="font-semibold">30</span> check-ins/day
                    </p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm">
                      <span className="font-semibold">10</span> deep audits/day
                    </p>
                  </div>
                  <div className="col-span-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-300 text-sm">
                      First access to new features
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
