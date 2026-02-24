import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-6">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Meridian
            </h1>
          </Link>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 transition"
          >
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="ml-64">{children}</main>
    </div>
  );
}
