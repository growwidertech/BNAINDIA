"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Radio,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Video,
  FileText,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface DistrictArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  featuredImage: string;
  location?: string | null;
  district?: string | null;
  state?: string | null;
  publishedAt: string | Date;
  readingTimeMin: number;
  externalVideoUrl?: string | null;
  videoProofPlatform?: string | null;
  author: { name: string; role?: string };
  category: { name: string; slug: string; color?: string | null };
}

interface StateDistrictNewsHubProps {
  lang: string;
  articles: DistrictArticle[];
}

export function StateDistrictNewsHub({ lang, articles }: StateDistrictNewsHubProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const regions = [
    { key: "ALL", label: "All Bureau Reports" },
    { key: "Delhi", label: "Delhi NCR" },
    { key: "Maharashtra", label: "Mumbai & Maharashtra" },
    { key: "Karnataka", label: "Bengaluru & Karnataka" },
    { key: "Uttar Pradesh", label: "Uttar Pradesh" },
    { key: "Tamil Nadu", label: "Tamil Nadu" },
  ];

  const filteredArticles =
    activeFilter === "ALL"
      ? articles
      : articles.filter(
          (a) =>
            (a.state && a.state.toLowerCase().includes(activeFilter.toLowerCase())) ||
            (a.location && a.location.toLowerCase().includes(activeFilter.toLowerCase())) ||
            (a.district && a.district.toLowerCase().includes(activeFilter.toLowerCase()))
        );

  return (
    <section className="my-8 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-[#ea580c] gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="w-1.5 h-6 bg-[#ea580c] rounded-sm" />
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-sans flex items-center space-x-2">
              <span>Ground Bureau Wire</span>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/70 px-2 py-0.5 rounded-full lowercase">
                district dispatch
              </span>
            </h2>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {regions.map((reg) => (
            <button
              key={reg.key}
              onClick={() => setActiveFilter(reg.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
                activeFilter === reg.key
                  ? "bg-[#ea580c] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of District News Stories */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.slice(0, 4).map((art) => (
            <article
              key={art.id}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <Link
                href={`/${lang}/${art.category.slug}/${art.slug}`}
                className="block relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Location Capsule Overlay */}
                {art.location && (
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center space-x-1 shadow">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span className="truncate max-w-[180px]">{art.location}</span>
                  </div>
                )}

                {/* Video Proof Badge */}
                {art.externalVideoUrl && (
                  <div className="absolute bottom-2.5 right-2.5 bg-red-600/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow flex items-center space-x-1">
                    <Video className="w-3 h-3" />
                    <span>Video Proof</span>
                  </div>
                )}
              </Link>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span
                      className="font-bold uppercase px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: art.category.color || "#b91c1c" }}
                    >
                      {art.category.name}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {formatTimeAgo(art.publishedAt)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-2">
                    <Link href={`/${lang}/${art.category.slug}/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                {/* Reporter Byline Footer */}
                <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    By {art.author.name}
                  </span>
                  <span className="flex items-center text-red-600 dark:text-red-400 font-bold group-hover:translate-x-1 transition text-[11px]">
                    Read Story
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-850 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
          No filed reports found for the selected region. Check back soon or view all reports.
        </div>
      )}
    </section>
  );
}
