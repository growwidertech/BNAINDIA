import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatTimeAgo } from "@/lib/utils";
import { Clock, MessageSquare, ArrowLeft } from "lucide-react";
import { GoogleAdSlot } from "@/components/ads/GoogleAdSlot";
import { getDictionary, DEFAULT_LANGUAGE } from "@/lib/languages";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    lang: string;
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const lang = params.lang || DEFAULT_LANGUAGE;
  const dict = getDictionary(lang);

  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) {
    notFound();
  }

  const articles = await prisma.article.findMany({
    where: {
      categoryId: category.id,
      status: "PUBLISHED",
    },
    include: {
      author: { select: { name: true } },
      translations: { where: { language: lang } },
    },
    orderBy: { publishedAt: "desc" },
  });

  const localizedArticles = articles.map((art) => {
    const trans = art.translations[0];
    if (trans) {
      return {
        ...art,
        title: trans.title,
        summary: trans.summary,
      };
    }
    return art;
  });

  return (
    <div className="space-y-6 my-6">
      {/* Google AdSense Category Billboard */}
      <GoogleAdSlot slotType="header" />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href={`/${lang}`} className="hover:text-red-600 transition">
          Home
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
          {category.name}
        </span>
      </nav>

      {/* Category Header */}
      <div
        className="p-6 rounded-lg text-white shadow-md relative overflow-hidden"
        style={{ backgroundColor: category.color || "#b91c1c" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          {category.name} News
        </h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Articles Grid */}
      {localizedArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {localizedArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <Link
                href={`/${lang}/${category.slug}/${article.slug}`}
                className="block relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {article.videoUrl && (
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    ▶ Video
                  </span>
                )}
              </Link>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <Link href={`/${lang}/${category.slug}/${article.slug}`}>
                    <h2 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition leading-snug line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(article.publishedAt)}
                  </span>
                  <span>By {article.author.name}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">{dict.noArticles}</p>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center space-x-1 mt-4 px-4 py-2 bg-red-600 text-white rounded text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      )}
    </div>
  );
}
