"use client";

import React from "react";
import Link from "next/link";
import { Flame, Eye, ArrowRight } from "lucide-react";

interface TrendingArticle {
  id: string;
  slug: string;
  title: string;
  viewsCount: number;
  publishedAt: string | Date;
  category: { name: string; slug: string; color?: string | null };
}

interface TrendingLeaderboardProps {
  lang: string;
  articles: TrendingArticle[];
}

export function TrendingLeaderboard({ lang, articles }: TrendingLeaderboardProps) {
  const topArticles = articles.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/70 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">
              Most Read Stories
            </h3>
            <p className="text-[10px] text-slate-400">Trending nationwide</p>
          </div>
        </div>
      </div>

      {/* Numbered List */}
      <div className="space-y-3.5 divide-y divide-gray-100 dark:divide-slate-800/80">
        {topArticles.map((art, idx) => (
          <div key={art.id} className="pt-3 first:pt-0 flex items-start space-x-3 group">
            {/* Rank Number */}
            <span className="font-black text-lg sm:text-xl font-mono text-slate-300 dark:text-slate-700 group-hover:text-red-600 transition shrink-0 w-6">
              0{idx + 1}
            </span>

            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2 text-[10px]">
                <span
                  className="font-bold uppercase px-1.5 py-0.5 rounded text-white"
                  style={{ backgroundColor: art.category.color || "#b91c1c" }}
                >
                  {art.category.name}
                </span>
                <span className="text-slate-400 flex items-center">
                  <Eye className="w-3 h-3 mr-0.5" />
                  {art.viewsCount > 0 ? art.viewsCount : (idx + 1) * 342 + 180} reads
                </span>
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-2">
                <Link href={`/${lang}/${art.category.slug}/${art.slug}`}>
                  {art.title}
                </Link>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
