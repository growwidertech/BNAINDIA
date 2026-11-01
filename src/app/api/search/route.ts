import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category");
    const language = searchParams.get("language");
    const sortBy = searchParams.get("sortBy") || "latest"; // latest or views

    const where: any = {
      status: "PUBLISHED",
    };

    if (q.trim()) {
      where.OR = [
        { title: { contains: q.trim() } },
        { summary: { contains: q.trim() } },
        { content: { contains: q.trim() } },
      ];
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (language) {
      where.language = language;
    }

    const orderBy: any = sortBy === "views" ? { viewsCount: "desc" } : { publishedAt: "desc" };

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true, color: true } },
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy,
      take: 24,
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
