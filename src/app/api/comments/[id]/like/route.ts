import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await prisma.comment.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
    });
    return NextResponse.json({ success: true, likesCount: updated.likesCount });
  } catch {
    return NextResponse.json({ error: "Failed to like comment" }, { status: 400 });
  }
}
