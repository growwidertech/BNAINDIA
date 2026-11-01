import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Video, Play, Clock, ArrowRight } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { getDictionary, DEFAULT_LANGUAGE } from "@/lib/languages";

export const dynamic = "force-dynamic";

interface VideoPageProps {
  params: { lang: string };
}

export default async function VideoNewsPage({ params }: VideoPageProps) {
  const lang = params.lang || DEFAULT_LANGUAGE;
  const dict = getDictionary(lang);

  const videoArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      videoUrl: { not: null },
    },
    include: {
      category: true,
      author: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  const featured = videoArticles[0];
  const others = videoArticles.slice(1);

  return (
    <div className="space-y-8 my-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b-2 border-red-600">
        <Video className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          {dict.videoNews}
        </h1>
      </div>

      {/* Main Featured Video Player */}
      {featured ? (
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
          <div className="aspect-video w-full">
            <video
              src={featured.videoUrl!}
              poster={featured.featuredImage}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 bg-slate-950 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                FEATURED VIDEO
              </span>
              <span className="text-xs text-blue-400 font-semibold">
                {featured.category.name}
              </span>
              <span className="text-xs text-slate-400">
                {formatTimeAgo(featured.publishedAt)}
              </span>
            </div>
            <Link
              href={`/${lang}/${featured.category.slug}/${featured.slug}`}
              className="hover:text-red-400 transition"
            >
              <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                {featured.title}
              </h2>
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">
              {featured.summary}
            </p>
          </div>
        </div>
      ) : null}

      {/* More Video Stories */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 uppercase">
          Latest Video Bulletins
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoArticles.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col group"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <video
                  src={item.videoUrl!}
                  poster={item.featuredImage}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  {item.videoDuration || "02:30"}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase">
                    {item.category.name}
                  </span>
                  <Link href={`/${lang}/${item.category.slug}/${item.slug}`}>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 transition mt-1 line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(item.publishedAt)}
                  </span>
                  <span>{item.viewsCount} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
