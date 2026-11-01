import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRequiredRole } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasRequiredRole(user.role, "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [
    totalArticles,
    draftArticles,
    pendingSubmissions,
    pendingComments,
    totalUsers,
    totalViewsAgg,
    mostReadStories,
    recentLogs,
  ] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.submission.count({ where: { status: "PENDING" } }),
    prisma.comment.count({ where: { status: "FLAGGED" } }),
    prisma.user.count(),
    prisma.article.aggregate({ _sum: { viewsCount: true } }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewsCount: "desc" },
      take: 5,
      select: { id: true, title: true, viewsCount: true, likesCount: true, slug: true, category: { select: { slug: true } } },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { name: true, role: true } } },
    }),
  ]);

  return NextResponse.json({
    metrics: {
      totalArticles,
      draftArticles,
      pendingSubmissions,
      pendingComments,
      totalUsers,
      totalViews: totalViewsAgg._sum.viewsCount || 0,
    },
    mostReadStories,
    recentLogs,
  });
}
