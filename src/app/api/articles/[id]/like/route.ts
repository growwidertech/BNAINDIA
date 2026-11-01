import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.reaction.findUnique({
    where: {
      userId_articleId_type: {
        userId: user.id,
        articleId: params.id,
        type: "LIKE",
      },
    },
  });

  if (existing) {
    // Remove like
    await prisma.$transaction([
      prisma.reaction.delete({
        where: { id: existing.id },
      }),
      prisma.article.update({
        where: { id: params.id },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: false });
  } else {
    // Add like
    await prisma.$transaction([
      prisma.reaction.create({
        data: {
          userId: user.id,
          articleId: params.id,
          type: "LIKE",
        },
      }),
      prisma.article.update({
        where: { id: params.id },
        data: { likesCount: { increment: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: true });
  }
}
