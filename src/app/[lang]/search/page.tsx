import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search, Clock, ArrowRight } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { getDictionary, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/lib/languages";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { lang: langParam } = await params;
  const resolvedSearch = await searchParams;
  const lang = langParam || DEFAULT_LANGUAGE;
  const dict = getDictionary(lang);
  const query = resolvedSearch.q || "";
  const selectedCategory = resolvedSearch.category || "";
  const sortBy = resolvedSearch.sort || "latest";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const where: any = {
    status: "PUBLISHED",
  };

  if (query.trim()) {
    where.OR = [
      { title: { contains: query.trim() } },
      { summary: { contains: query.trim() } },
      { content: { contains: query.trim() } },
    ];
  }

  if (selectedCategory) {
    where.category = { slug: selectedCategory };
  }

  const articles = await prisma.article.findMany({
    where,
    include: {
      category: true,
      author: { select: { name: true } },
    },
    orderBy: sortBy === "views" ? { viewsCount: "desc" } : { publishedAt: "desc" },
    take: 30,
  });

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b-2 border-red-600">
        <Search className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Search Antigravity News
        </h1>
      </div>

      {/* Filter / Search Form */}
      <form
        method="GET"
        className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3"
      >
        <div className="sm:col-span-6">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search keywords, events, leaders..."
            className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            name="category"
            defaultValue={selectedCategory}
            className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            name="sort"
            defaultValue={sortBy}
            className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="latest">Latest First</option>
            <option value="views">Most Read</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full h-full min-h-[38px] bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center font-bold text-xs"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Results Header */}
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-900 dark:text-white">{articles.length}</span> results
        {query ? ` for "${query}"` : ""}
      </div>

      {/* Results List */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-md transition"
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
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 transition mt-1 line-clamp-2">
                      {article.title}
                    </h2>
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
                  <span>{article.viewsCount} views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            No news articles matched your search query. Try broadening your keywords or clearing category filters.
          </p>
        </div>
      )}
    </div>
  );
}
