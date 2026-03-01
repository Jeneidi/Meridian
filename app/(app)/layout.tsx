import Link from "next/link";
import { LayoutDashboard, CreditCard, FileText, Zap, Bell, UserPlus } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SidebarNotificationBadge } from "@/components/app/SidebarNotificationBadge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userPlan = "FREE";
  let displayName = "My Account";

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { plan: true, name: true },
    });
    if (user) {
      userPlan = user.plan;
      if (user.name) {
        displayName = user.name;
      }
    }
  }

  const planDisplay = {
    FREE: { label: "Free", showUpgrade: true },
    PRO: { label: "Pro", showUpgrade: false },
    PREMIUM: { label: "Premium", showUpgrade: false },
  };

  const plan = planDisplay[userPlan as keyof typeof planDisplay];

  return (
    <div className="min-h-screen bg-[#09090b]">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-800 bg-[#09090b]">
        {/* Header */}
        <div className="border-b border-zinc-800 h-16 flex items-center px-8">
          <Link href="/" className="[&_span]:text-2xl">
            <Logo size={28} withWordmark />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-0 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-400 hover:bg-zinc-800 transition"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-400 hover:bg-zinc-800 transition"
          >
            <CreditCard className="h-5 w-5" />
            Subscription
          </Link>
          <Link
            href="/terms"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-400 hover:bg-zinc-800 transition"
          >
            <FileText className="h-5 w-5" />
            Terms of Service
          </Link>
          <Link
            href="/invites"
            className="relative flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-400 hover:bg-zinc-800 transition"
          >
            <Bell className="h-5 w-5" />
            Invites
            <SidebarNotificationBadge />
          </Link>
          <Link
            href="/contributors"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-400 hover:bg-zinc-800 transition"
          >
            <UserPlus className="h-5 w-5" />
            Add Contributors
          </Link>
        </nav>

        {/* Bottom Account Section */}
        <div className="absolute bottom-6 left-4 right-4 space-y-3">
          {plan.showUpgrade && (
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white p-3 transition font-medium text-sm w-full"
            >
              <Zap className="h-4 w-4" />
              Upgrade Plan
            </Link>
          )}

          <Link
            href="/profile"
            className="flex items-center justify-between rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 p-4 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-zinc-200 truncate">
                  {displayName}
                </span>
                <span className="text-xs text-zinc-500">{plan.label} Plan</span>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex flex-col">
        {children}
      </main>
    </div>
  );
}
