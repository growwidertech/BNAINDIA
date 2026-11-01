import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasRequiredRole } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !hasRequiredRole(user.role, "EDITOR")) {
      return NextResponse.json({ error: "Forbidden: Editor privileges required." }, { status: 403 });
    }

    const { action, editorialNotes } = await req.json();

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { category: true, contributor: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      let baseSlug = slugify(submission.headline);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Convert to published Article - makes it live immediately across homepage, category pages, and article URLs
      const article = await prisma.article.create({
        data: {
          slug: uniqueSlug,
          title: submission.headline,
          summary: submission.summary,
          content: submission.content,
          featuredImage:
            submission.featuredImage ||
            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80",
          videoUrl: submission.videoUrl,
          categoryId: submission.categoryId,
          authorId: submission.contributorId,
          language: submission.language,
          location: submission.location,
          district: submission.district,
          state: submission.state,
          externalVideoUrl: submission.externalVideoUrl,
          videoProofPlatform: submission.videoProofPlatform,
          videoProofTitle: submission.videoProofTitle,
          sourceAttribution: submission.sourceAttribution,
          readingTimeMin: calculateReadingTime(submission.content),
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      // Update submission status
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: "APPROVED",
          editorialNotes: editorialNotes || "Approved and published live on the portal.",
          reviewedById: user.id,
          reviewedAt: new Date(),
          publishedArticleId: article.id,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SUBMISSION_APPROVED",
          entity: "Article",
          entityId: article.id,
          details: `Approved news report "${submission.headline}" by ${submission.contributor?.name || "Reporter"} from ${submission.location || "Bureau"} — published live by editor ${user.name}`,
        },
      });

      const liveUrl = `/${submission.language || "en"}/${submission.category.slug}/${article.slug}`;

      return NextResponse.json({
        success: true,
        articleId: article.id,
        articleSlug: article.slug,
        categorySlug: submission.category.slug,
        liveUrl,
        status: "APPROVED",
      });
    } else if (action === "REJECT") {
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: "REJECTED",
          editorialNotes: editorialNotes || "Submission does not meet current editorial criteria.",
          reviewedById: user.id,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, status: "REJECTED" });
    } else if (action === "RETURN_FOR_REVISION") {
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: "RETURNED_FOR_REVISION",
          editorialNotes: editorialNotes || "Please review and revise the highlighted sections.",
          reviewedById: user.id,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, status: "RETURNED_FOR_REVISION" });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Submission review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
