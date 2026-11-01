import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRequiredRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    // Editors and Admins see all submissions; regular contributors see only their own
    const isEditor = hasRequiredRole(user.role, "EDITOR");
    const whereClause: any = isEditor ? {} : { contributorId: user.id };

    if (statusParam && statusParam !== "ALL") {
      whereClause.status = statusParam;
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        category: { select: { id: true, name: true, slug: true, color: true } },
        contributor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            location: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Attach published article slugs for any approved submissions
    const approvedArticleIds = submissions
      .map((s) => s.publishedArticleId)
      .filter(Boolean) as string[];

    const publishedArticles =
      approvedArticleIds.length > 0
        ? await prisma.article.findMany({
            where: { id: { in: approvedArticleIds } },
            select: { id: true, slug: true },
          })
        : [];

    const articleSlugMap = new Map(publishedArticles.map((a) => [a.id, a.slug]));

    const enrichedSubmissions = submissions.map((sub) => ({
      ...sub,
      publishedArticleSlug: sub.publishedArticleId
        ? articleSlugMap.get(sub.publishedArticleId) || null
        : null,
    }));

    return NextResponse.json(enrichedSubmissions);
  } catch (error) {
    console.error("Submissions fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const {
      headline,
      summary,
      content,
      categoryId,
      language = "en",
      state,
      district,
      location,
      sourceAttribution,
      featuredImage,
      videoUrl,
      externalVideoUrl,
      videoProofPlatform,
      videoProofTitle,
      tags,
      declarationSigned,
    } = body;

    if (!headline || !summary || !content || !categoryId) {
      return NextResponse.json(
        { error: "Headline, summary, content, and category are mandatory." },
        { status: 400 }
      );
    }

    if (!declarationSigned) {
      return NextResponse.json(
        { error: "You must confirm that this is original reporting and does not violate copyright." },
        { status: 400 }
      );
    }

    // Resolve category by ID or by slug
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: categoryId }, { slug: categoryId }],
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category selected. Please choose a valid category." },
        { status: 400 }
      );
    }

    // Format location nicely: e.g. "Hazratganj, Lucknow, Uttar Pradesh"
    const locationParts = [
      location?.trim(),
      district?.trim(),
      state?.trim(),
    ].filter(Boolean);
    const formattedLocation = locationParts.join(", ") || null;

    const submission = await prisma.submission.create({
      data: {
        headline: headline.trim(),
        summary: summary.trim(),
        content: content.trim(),
        categoryId: category.id,
        contributorId: user.id,
        language,
        state: state?.trim() || null,
        district: district?.trim() || null,
        location: formattedLocation,
        sourceAttribution: sourceAttribution?.trim() || null,
        featuredImage:
          featuredImage ||
          "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80",
        videoUrl: videoUrl ? videoUrl.trim() : null,
        externalVideoUrl: externalVideoUrl ? externalVideoUrl.trim() : null,
        videoProofPlatform: videoProofPlatform ? videoProofPlatform.trim() : null,
        videoProofTitle: videoProofTitle ? videoProofTitle.trim() : null,
        tags: tags || null,
        declarationSigned: true,
        status: "PENDING",
      },
      include: {
        category: true,
        contributor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            location: true,
          },
        },
      },
    });

    // Create an audit log entry
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SUBMISSION_CREATED",
        entity: "Submission",
        entityId: submission.id,
        details: `News article submitted by ${user.name} (${user.role}) from ${formattedLocation || "Unspecified Location"}: "${submission.headline}"`,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Submission create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
