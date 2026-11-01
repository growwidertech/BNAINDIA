import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: {
        articleId: id,
        parentId: null,
        status: "APPROVED",
      },
      include: {
        user: { select: { id: true, name: true, role: true, avatarUrl: true } },
        replies: {
          where: { status: "APPROVED" },
          include: {
            user: { select: { id: true, name: true, role: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, parentId } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }

    // Basic anti-spam validation
    if (content.length > 2000) {
      return NextResponse.json({ error: "Comment exceeds maximum limit of 2000 characters" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        articleId: id,
        userId: user.id,
        content: content.trim(),
        parentId: parentId || null,
        status: "APPROVED",
      },
      include: {
        user: { select: { id: true, name: true, role: true, avatarUrl: true } },
      },
    });

    // Increment article comment count
    await prisma.article.update({
      where: { id: id },
      data: { commentsCount: { increment: 1 } },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
