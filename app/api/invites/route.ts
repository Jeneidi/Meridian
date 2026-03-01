export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/invites - Send an invite
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { repoId, email } = await req.json();

    if (!repoId || !email) {
      return NextResponse.json(
        { error: "Missing repoId or email" },
        { status: 400 }
      );
    }

    // Verify caller owns the repo
    const repo = await prisma.repo.findUnique({
      where: { id: repoId },
      select: { userId: true },
    });

    if (!repo || repo.userId !== userId) {
      return NextResponse.json(
        { error: "You don't own this repo" },
        { status: 403 }
      );
    }

    // Look up invitee by email
    const invitee = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    if (!invitee) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Guard: cannot invite yourself
    if (invitee.id === userId) {
      return NextResponse.json(
        { error: "Cannot invite yourself" },
        { status: 400 }
      );
    }

    // Check for existing PENDING invite
    const existing = await prisma.teamInvite.findUnique({
      where: {
        repoId_inviteeId: {
          repoId,
          inviteeId: invitee.id,
        },
      },
    });

    if (existing && existing.status === "PENDING") {
      return NextResponse.json(
        { error: "Invite already pending for this user" },
        { status: 409 }
      );
    }

    // If there was a declined/accepted invite, delete it and create a new one
    if (existing) {
      await prisma.teamInvite.delete({
        where: { id: existing.id },
      });
    }

    // Create invite
    const invite = await prisma.teamInvite.create({
      data: {
        repoId,
        inviterId: userId,
        inviteeId: invitee.id,
        status: "PENDING",
      },
    });

    // Create notification for invitee
    await prisma.notification.create({
      data: {
        userId: invitee.id,
        type: "INVITE_RECEIVED",
        inviteId: invite.id,
      },
    });

    return NextResponse.json(
      { success: true, invite },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/invites error:", error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}

// GET /api/invites - List pending invites for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const invites = await prisma.teamInvite.findMany({
      where: {
        inviteeId: userId,
        status: "PENDING",
      },
      include: {
        repo: {
          select: { id: true, name: true, fullName: true },
        },
        inviter: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("GET /api/invites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}
