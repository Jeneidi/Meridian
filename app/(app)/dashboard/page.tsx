import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { TodaysTaskSection } from "@/components/app/TodaysTaskSection";
import { AnimatedRepoGrid } from "@/components/app/AnimatedRepoGrid";
import { RateLimitTestPanel } from "@/components/app/RateLimitTestPanel";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { Suspense } from "react";
import { Crown } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user plan
  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { plan: true },
  });

  const userPlan = user?.plan || "FREE";

  // Optimized query: only count tasks, don't fetch them all
  const repos = await prisma.repo.findMany({
    where: {
      userId: session.user.id as string,
    },
    select: {
      id: true,
      name: true,
      fullName: true,
      roadmapGenAt: true,
      connectedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { connectedAt: "desc" },
  });

  // Transform the data to match the component interface
  const reposForGrid = repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.fullName,
    roadmapGenAt: repo.roadmapGenAt,
    tasks: Array(repo._count.tasks).fill(null).map((_, i) => ({ id: String(i) })),
  }));

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader
        title="Dashboard"
        middleContent={
          userPlan === "FREE" && (
            <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm transition">
              <Crown className="h-4 w-4" />
              Get Premium
            </Link>
          )
        }
        rightContent={
          <Link href="/repo/connect" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center">
            + Connect Repo
          </Link>
        }
      />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <p className="text-zinc-500 mb-8">Welcome, {session.user.name}</p>
        <RateLimitTestPanel />
        {repos.length === 0 ? (
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">No Repos Yet</h2>
            <p className="text-slate-300 mb-8">
              Connect a GitHub repo to generate a shipping roadmap.
            </p>
            <Link href="/repo/connect" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center">
              Connect Your First Repo
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Today's Task - Non-blocking with Suspense */}
            {repos.length > 0 && repos[0]._count.tasks > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Today's Task</h2>
                <Suspense
                  fallback={
                    <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 text-center text-slate-400 animate-pulse">
                      Loading today's task...
                    </div>
                  }
                >
                  <TodaysTaskSection repoId={repos[0].id} />
                </Suspense>
              </div>
            )}

            {/* Connected Repos */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Your Repos ({repos.length})</h2>
              <AnimatedRepoGrid repos={reposForGrid} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
