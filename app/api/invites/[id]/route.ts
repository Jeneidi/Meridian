export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH /api/invites/[id] - Accept or decline an invite
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { id } = await params;
    const { action } = await req.json();

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'accept' or 'decline'" },
        { status: 400 }
      );
    }

    // Find the invite
    const invite = await prisma.teamInvite.findUnique({
      where: { id },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Verify the current user is the invitee
    if (invite.inviteeId !== userId) {
      return NextResponse.json(
        { error: "You cannot respond to this invite" },
        { status: 403 }
      );
    }

    // Verify invite is still PENDING
    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: "This invite has already been responded to" },
        { status: 400 }
      );
    }

    const newStatus = action === "accept" ? "ACCEPTED" : "DECLINED";

    // Update the invite
    const updatedInvite = await prisma.teamInvite.update({
      where: { id },
      data: {
        status: newStatus,
        respondedAt: new Date(),
      },
    });

    // Mark the notification as read
    await prisma.notification.updateMany({
      where: {
        inviteId: id,
        userId,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ success: true, invite: updatedInvite });
  } catch (error) {
    console.error("PATCH /api/invites/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to respond to invite" },
      { status: 500 }
    );
  }
}
