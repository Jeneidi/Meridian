import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TodaysTaskSection } from "@/components/app/TodaysTaskSection";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const repos = await prisma.repo.findMany({
    where: {
      userId: session.user.id as string,
    },
    include: {
      tasks: { select: { id: true } },
    },
    orderBy: { connectedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome, {session.user.name}</p>
          </div>
          <Link href="/repo/connect">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              + Connect Repo
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {repos.length === 0 ? (
          <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-12 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">No Repos Yet</h2>
            <p className="text-slate-300 mb-8">
              Connect a GitHub repo to generate a shipping roadmap.
            </p>
            <Link href="/repo/connect">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3">
                Connect Your First Repo
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Today's Task */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Today's Task</h2>
              {repos.length > 0 && repos[0].tasks.length > 0 ? (
                <TodaysTaskSection repoId={repos[0].id} />
              ) : (
                <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8 text-center text-slate-400">
                  Generate a roadmap to see today's task
                </div>
              )}
            </div>

            {/* Connected Repos */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Your Repos ({repos.length})</h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {repos.map((repo) => (
                  <Link key={repo.id} href={`/repo/${repo.id}`}>
                    <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition cursor-pointer group h-full">
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition mb-2 line-clamp-2">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-6 line-clamp-1">{repo.fullName}</p>

                      <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tasks:</span>
                          <span className="text-white font-semibold">{repo.tasks.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Roadmap:</span>
                          <span className={repo.roadmapGenAt ? "text-emerald-400" : "text-slate-400"}>
                            {repo.roadmapGenAt ? "✓ Generated" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
