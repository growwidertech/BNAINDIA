import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { Clock, Eye, User as UserIcon, ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import { ArticleInteractions } from "@/components/articles/ArticleInteractions";
import { ArticleComments } from "@/components/articles/ArticleComments";
import { GoogleAdSlot } from "@/components/ads/GoogleAdSlot";
import { ExternalVideoProof } from "@/components/articles/ExternalVideoProof";
import { getDictionary, DEFAULT_LANGUAGE } from "@/lib/languages";

export const dynamic = "force-dynamic";

interface ArticleDetailsPageProps {
  params: {
    lang: string;
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailsPageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    select: { title: true, summary: true, featuredImage: true },
  });

  if (!article) return { title: "Article Not Found | Antigravity News" };

  return {
    title: `${article.title} | Antigravity News`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [{ url: article.featuredImage }],
      type: "article",
    },
  };
}

export default async function ArticleDetailsPage({ params }: ArticleDetailsPageProps) {
  const lang = params.lang || DEFAULT_LANGUAGE;
  const dict = getDictionary(lang);

  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: { select: { id: true, name: true, role: true, avatarUrl: true, bio: true } },
      translations: { where: { language: lang } },
      comments: {
        where: { parentId: null, status: "APPROVED" },
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
      },
    },
  });

  if (!article) {
    notFound();
  }

  // Check localized translation
  const trans = article.translations[0];
  const title = trans ? trans.title : article.title;
  const summary = trans ? trans.summary : article.summary;
  const content = trans ? trans.content : article.content;

  // Increment view counter asynchronously
  await prisma.article.update({
    where: { id: article.id },
    data: { viewsCount: { increment: 1 } },
  }).catch(() => {});

  // Related articles in same category
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
      status: "PUBLISHED",
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <article className="max-w-4xl mx-auto py-6">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
        <Link href={`/${lang}`} className="hover:text-red-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${lang}/${article.category.slug}`}
          className="hover:text-red-600 transition uppercase font-semibold"
        >
          {article.category.name}
        </Link>
        <span>/</span>
        <span className="truncate max-w-[200px] text-slate-400">{title}</span>
      </nav>

      {/* 2. Category Capsule */}
      <div className="mb-3">
        <Link
          href={`/${lang}/${article.category.slug}`}
          className="inline-block text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded text-white"
          style={{ backgroundColor: article.category.color || "#b91c1c" }}
        >
          {article.category.name}
        </Link>
      </div>

      {/* 3. Headline */}
      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight tracking-tight mb-4 font-sans">
        {title}
      </h1>

      {/* 4. Short Summary / Excerpt */}
      <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6 border-l-4 border-red-600 pl-4">
        {summary}
      </p>

      {/* 5. Author, Date, Reading Time, and Views Info */}
      <div className="flex flex-wrap items-center justify-between py-3 border-y border-gray-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 mb-6 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200">
            {article.author.name[0]}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              By {article.author.name}
            </p>
            <p className="text-[10px] text-slate-400">
              Antigravity News Bureau {article.location ? `• ${article.location}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {formatDate(article.publishedAt)}
          </span>
          <span>•</span>
          <span>{article.readingTimeMin} {dict.minRead}</span>
          <span>•</span>
          <span className="flex items-center">
            <Eye className="w-3.5 h-3.5 mr-1" />
            {article.viewsCount + 1} views
          </span>
        </div>
      </div>

      {/* 6. Media Asset: Video Player if available, or Featured Image */}
      <div className="mb-6 rounded-lg overflow-hidden bg-black shadow-md">
        {article.videoUrl ? (
          <div className="aspect-video w-full">
            <video
              src={article.videoUrl}
              poster={article.featuredImage}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full">
            <img
              src={article.featuredImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {article.caption && (
          <p className="p-2.5 text-[11px] text-slate-400 bg-slate-950 text-center italic">
            Photo/Video: {article.caption}
          </p>
        )}
      </div>

      {/* 7. Interactive Action Bar: Like, Bookmark, Share, Audio Reader */}
      <ArticleInteractions
        articleId={article.id}
        initialLikes={article.likesCount}
        title={title}
        url={typeof window !== "undefined" ? window.location.href : ""}
        content={content}
      />

      {/* External Video Proof & Social Media Source Evidence (Times Now feature) */}
      {article.externalVideoUrl && (
        <ExternalVideoProof
          url={article.externalVideoUrl}
          platform={article.videoProofPlatform}
          title={article.videoProofTitle}
          headline={title}
        />
      )}

      {/* 8. Rich Article Body */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 my-8 font-serif">
        {content.split("\n\n").map((para, i) => (
          <React.Fragment key={i}>
            <p>{para}</p>
            {/* Native In-Article Google AdSense Unit */}
            {i === 1 && (
              <div className="my-6 not-prose">
                <GoogleAdSlot slotType="inArticle" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Google AdSense Responsive Unit */}
      <div className="my-6">
        <GoogleAdSlot slotType="sidebar" />
      </div>

      {/* Source Attribution Note */}
      {article.sourceAttribution && (
        <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded border border-gray-200 dark:border-slate-800 text-xs text-slate-500 mb-8">
          <span className="font-bold text-slate-700 dark:text-slate-300">Sources & Attribution: </span>
          {article.sourceAttribution}
        </div>
      )}

      {/* Author Bio Card */}
      <div className="p-4 sm:p-5 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-start space-x-4 my-8">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-base text-slate-700 dark:text-slate-300 shrink-0">
          {article.author.name[0]}
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {article.author.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {article.author.bio || "Senior Staff Journalist covering international affairs, governance, and public policy for Antigravity News Agency."}
          </p>
        </div>
      </div>

      {/* 9. Related Articles Shelf */}
      {relatedArticles.length > 0 && (
        <section className="my-10 pt-6 border-t border-gray-200 dark:border-slate-800">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
            {dict.moreInThisCategory}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/${lang}/${article.category.slug}/${rel.slug}`}
                className="group block bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-red-600 transition line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {formatTimeAgo(rel.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 10. Threaded Comments Section */}
      <ArticleComments
        articleId={article.id}
        initialComments={article.comments as any}
        lang={lang}
      />
    </article>
  );
}
