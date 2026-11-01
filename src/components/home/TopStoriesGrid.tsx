import React from "react";
import Link from "next/link";
import { Clock, MessageSquare, ArrowRight } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { getDictionary } from "@/lib/languages";

interface StoryItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  featuredImage: string;
  category: { slug: string; name: string; color?: string | null };
  publishedAt: string | Date;
  commentsCount?: number;
}

interface TopStoriesGridProps {
  lang: string;
  stories: StoryItem[];
}

export function TopStoriesGrid({ lang, stories }: TopStoriesGridProps) {
  const dict = getDictionary(lang);

  return (
    <section className="my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#ea580c] pb-2 mb-6">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-6 bg-[#ea580c] rounded-sm" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-sans">
            {dict.topStories}
          </h2>
        </div>
        <Link
          href={`/${lang}/world`}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center transition"
        >
          <span>{dict.viewAll}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stories.slice(0, 4).map((story) => (
          <article
            key={story.id}
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <Link
              href={`/${lang}/${story.category.slug}/${story.slug}`}
              className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800"
            >
              <img
                src={story.featuredImage}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <span
                  className="inline-block text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white mb-2"
                  style={{ backgroundColor: story.category.color || "#2563eb" }}
                >
                  {story.category.name}
                </span>

                <Link href={`/${lang}/${story.category.slug}/${story.slug}`}>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition leading-snug line-clamp-2">
                    {story.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>
              </div>

              {/* Card Footer: Timestamp & Comment Count */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeAgo(story.publishedAt)}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {story.commentsCount ?? 12}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
