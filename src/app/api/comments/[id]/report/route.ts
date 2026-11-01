import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const { reason } = await req.json();

    if (!reason) {
      return NextResponse.json({ error: "Reason required" }, { status: 400 });
    }

    const report = await prisma.commentReport.create({
      data: {
        commentId: params.id,
        userId: user ? user.id : "anonymous",
        reason,
      },
    });

    // Mark comment as FLAGGED
    await prisma.comment.update({
      where: { id: params.id },
      data: { status: "FLAGGED" },
    });

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
