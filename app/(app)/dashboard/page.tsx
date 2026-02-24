import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Meridian Dashboard</h1>
          <div className="text-sm text-slate-300">
            Signed in as <span className="font-semibold">{session.user?.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Connected Repos</h2>
          <p className="text-slate-300 mb-6">
            No repos connected yet. Click the button below to get started.
          </p>
          <Link href="/repo/connect">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Connect Your First Repo
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Today's Task</h3>
            <p className="text-slate-400">No task for today. Connect a repo to get started.</p>
          </div>

          <div className="rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Progress</h3>
            <div className="space-y-2">
              <div>
                <span className="text-slate-300">Tasks Completed:</span>
                <span className="ml-2 text-white font-semibold">0</span>
              </div>
              <div>
                <span className="text-slate-300">Current Streak:</span>
                <span className="ml-2 text-emerald-400 font-semibold">0 days</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
