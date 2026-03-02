import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// DEV ONLY: Upgrade user to PRO tier for testing multi-repo functionality
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Upgrade user to PRO tier
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan: "PRO" },
      select: { plan: true, email: true },
    });

    return NextResponse.json({
      success: true,
      message: "Tier upgraded to PRO for testing",
      currentPlan: updatedUser.plan,
    });
  } catch (error) {
    console.error("DEV upgrade-tier error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upgrade tier" },
      { status: 500 }
    );
  }
}
