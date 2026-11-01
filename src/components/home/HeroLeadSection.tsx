"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Maximize2, Radio } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface HeroArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  featuredImage: string;
  videoUrl?: string | null;
  videoDuration?: string | null;
  category: { slug: string; name: string };
  publishedAt: string | Date;
}

interface HeroLeadSectionProps {
  lang: string;
  leadArticle: HeroArticle;
  sidebarArticles: HeroArticle[];
}

export function HeroLeadSection({ lang, leadArticle, sidebarArticles }: HeroLeadSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = Math.floor(videoRef.current.currentTime);
    const m = Math.floor(cur / 60);
    const s = cur % 60;
    setCurrentTime(`${m}:${s < 10 ? "0" : ""}${s}`);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
      {/* 1. Large Lead Video / Story (8 cols) */}
      <div className="lg:col-span-8 flex flex-col bg-black rounded-lg overflow-hidden shadow-md relative group">
        {/* Live Indicator Tag */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-1.5 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <Radio className="w-3.5 h-3.5" />
          <span>LIVE</span>
        </div>

        {/* Video / Poster Canvas */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
          {leadArticle.videoUrl ? (
            <video
              ref={videoRef}
              src={leadArticle.videoUrl}
              poster={leadArticle.featuredImage}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
              playsInline
            />
          ) : (
            <img
              src={leadArticle.featuredImage}
              alt={leadArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}

          {/* Central Play Button Overlay (when paused) */}
          {!isPlaying && leadArticle.videoUrl && (
            <button
              onClick={togglePlay}
              className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 hover:bg-red-600/90 text-white flex items-center justify-center backdrop-blur-sm transition-all transform hover:scale-110 shadow-2xl"
              aria-label="Play Video"
            >
              <Play className="w-8 h-8 ml-1 fill-white" />
            </button>
          )}

          {/* Bottom Gradient Overlay for Headline */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Headline & Excerpt in bottom area */}
          <div className="absolute bottom-12 left-0 right-0 p-4 sm:p-6 z-10 text-white">
            <div className="inline-block bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-2">
              BREAKING NEWS
            </div>
            <Link
              href={`/${lang}/${leadArticle.category.slug}/${leadArticle.slug}`}
              className="block group-hover:text-red-300 transition"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                {leadArticle.title}
              </h1>
            </Link>
            <p className="hidden sm:block text-xs sm:text-sm text-slate-200 mt-2 line-clamp-2 drop-shadow">
              {leadArticle.summary}
            </p>
          </div>

          {/* Bottom Custom Video Player Bar (if video present) */}
          {leadArticle.videoUrl && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-md px-4 flex items-center justify-between text-xs text-white z-20 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <button onClick={togglePlay} className="hover:text-red-400">
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <span className="text-[11px] font-mono text-slate-300">
                  {currentTime} / {leadArticle.videoDuration || "2:36"}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <button onClick={toggleMute} className="hover:text-white">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">HD</span>
                <button onClick={handleFullscreen} className="hover:text-white">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Secondary Vertical News List (4 cols) */}
      <div className="lg:col-span-4 flex flex-col divide-y divide-gray-200 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-slate-800 shadow-sm justify-between">
        {sidebarArticles.slice(0, 4).map((story) => (
          <Link
            key={story.id}
            href={`/${lang}/${story.category.slug}/${story.slug}`}
            className="flex items-start space-x-3 py-3 group hover:bg-gray-50 dark:hover:bg-slate-800/60 p-2 rounded transition"
          >
            {/* Thumbnail */}
            <div className="w-24 sm:w-28 h-18 sm:h-20 shrink-0 rounded overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
              <img
                src={story.featuredImage}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 leading-snug">
                {story.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {story.summary}
              </p>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                <span>{formatTimeAgo(story.publishedAt)}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {story.category.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
