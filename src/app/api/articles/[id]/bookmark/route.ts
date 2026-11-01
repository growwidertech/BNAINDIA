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

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId: user.id,
        articleId: params.id,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ bookmarked: false });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        articleId: params.id,
      },
    });
    return NextResponse.json({ bookmarked: true });
  }
}
