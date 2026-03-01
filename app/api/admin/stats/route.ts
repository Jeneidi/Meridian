export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();

  // Only allow your own account
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const [totalUsers, recentUsers, planBreakdown] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { email: true, name: true, plan: true, createdAt: true },
      }),
      prisma.user.groupBy({
        by: ["plan"],
        _count: { plan: true },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      recentUsers,
      planBreakdown: planBreakdown.map((pb) => ({
        plan: pb.plan,
        count: pb._count.plan,
      })),
    });
  } catch (error) {
    console.error("❌ Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
