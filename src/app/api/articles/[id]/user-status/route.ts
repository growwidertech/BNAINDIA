import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ hasLiked: false, isBookmarked: false });
  }

  const [like, bookmark] = await Promise.all([
    prisma.reaction.findUnique({
      where: {
        userId_articleId_type: {
          userId: user.id,
          articleId: params.id,
          type: "LIKE",
        },
      },
    }),
    prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId: params.id,
        },
      },
    }),
  ]);

  return NextResponse.json({
    hasLiked: !!like,
    isBookmarked: !!bookmark,
  });
}
