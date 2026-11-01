import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bookmark, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { getDictionary, DEFAULT_LANGUAGE } from "@/lib/languages";

export const dynamic = "force-dynamic";

interface BookmarksPageProps {
  params: Promise<{ lang: string }>;
}

export default async function BookmarksPage({ params }: BookmarksPageProps) {
  const { lang: langParam } = await params;
  const lang = langParam || DEFAULT_LANGUAGE;
  const dict = getDictionary(lang);
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${lang}/auth/signin`);
  }

  const savedBookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      article: {
        include: {
          category: true,
          author: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-2 pb-3 border-b-2 border-red-600">
        <Bookmark className="w-5 h-5 text-red-600 fill-red-600" />
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Saved Stories & Bookmarks
        </h1>
      </div>

      {savedBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {savedBookmarks.map(({ article }) => (
            <div
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group"
            >
              <Link
                href={`/${lang}/${article.category.slug}/${article.slug}`}
                className="block relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase">
                    {article.category.name}
                  </span>
                  <Link href={`/${lang}/${article.category.slug}/${article.slug}`}>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 transition mt-1 line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(article.publishedAt)}
                  </span>
                  <Link
                    href={`/${lang}/${article.category.slug}/${article.slug}`}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Read Story →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No saved stories yet
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any article to save it for reading later.
          </p>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center space-x-1 mt-4 px-4 py-2 bg-red-600 text-white rounded text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Browse News</span>
          </Link>
        </div>
      )}
    </div>
  );
}
