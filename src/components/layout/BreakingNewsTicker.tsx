"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Volume2, ChevronRight, Pause, Play } from "lucide-react";
import { getDictionary } from "@/lib/languages";

interface BreakingItem {
  id: string;
  title: string;
  slug: string;
  category: { slug: string };
}

interface BreakingNewsTickerProps {
  lang: string;
  items?: BreakingItem[];
}

export function BreakingNewsTicker({ lang, items = [] }: BreakingNewsTickerProps) {
  const dict = getDictionary(lang);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const fallbackItems: BreakingItem[] = [
    {
      id: "1",
      title: "Global leaders meet at climate summit to accelerate green energy transition",
      slug: "global-leaders-unite-for-greener-tomorrow-climate-summit",
      category: { slug: "world" },
    },
    {
      id: "2",
      title: "Stock markets show strong gains amid positive economic data and earnings rally",
      slug: "stock-markets-record-highs-positive-economic-indicators",
      category: { slug: "business" },
    },
    {
      id: "3",
      title: "India clinch T20 series in thrilling final over spectacle before capacity crowd",
      slug: "india-clinch-t20-series-thrilling-final-over-finish",
      category: { slug: "sports" },
    },
  ];

  const displayList = items.length > 0 ? items : fallbackItems;

  useEffect(() => {
    if (!isPlaying || displayList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, displayList.length]);

  const currentItem = displayList[currentIndex];

  return (
    <div className="bg-[#0b2545] text-white border-y border-slate-800 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10 text-xs sm:text-sm font-medium">
        {/* Badge & Icon */}
        <div className="flex items-center space-x-2 shrink-0 bg-[#ea580c] text-white px-3 py-1 rounded-sm mr-3 font-black tracking-wide uppercase shadow">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <Volume2 className="w-4 h-4" />
          <span>{dict.breakingNews}</span>
        </div>

        {/* Ticker Text */}
        <div className="flex-1 overflow-hidden relative h-6 flex items-center">
          <Link
            href={`/${lang}/${currentItem.category.slug}/${currentItem.slug}`}
            className="hover:text-orange-300 truncate block w-full transition-all duration-300 transform opacity-100"
          >
            {currentItem.title}
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 shrink-0 ml-3 text-orange-200">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Ticker" : "Play Ticker"}
            className="p-1 hover:text-white rounded"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % displayList.length)}
            title="Next Story"
            className="p-1 hover:text-white rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
