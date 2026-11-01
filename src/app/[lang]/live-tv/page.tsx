"use client";

import React, { useState } from "react";
import { Tv, Radio, Calendar, Volume2, ShieldCheck, Share2 } from "lucide-react";
import { getDictionary } from "@/lib/languages";

interface LiveTvPageProps {
  params: { lang: string };
}

export default function LiveTvPage({ params }: LiveTvPageProps) {
  const dict = getDictionary(params.lang);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sample broadcast video stream URL
  const broadcastUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  const schedule = [
    { time: "18:00 - 19:00", show: "Global Prime with Vikramaditya Sharma", live: true },
    { time: "19:00 - 20:00", show: "The India Geopolitical Report", live: false },
    { time: "20:00 - 20:30", show: "Markets & Tech Horizon", live: false },
    { time: "20:30 - 21:30", show: "World 360: Diplomatic Roundtable", live: false },
    { time: "21:30 - 22:00", show: "Science & Climate Special", live: false },
  ];

  return (
    <div className="space-y-6 my-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-red-600">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded shadow">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <Radio className="w-4 h-4" />
            <span>LIVE BROADCAST</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Antigravity 24/7 Live Stream
          </h1>
        </div>
      </div>

      {/* Main Broadcast Player & Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live TV Video Player (8 cols) */}
        <div className="lg:col-span-8 bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="relative aspect-video w-full bg-slate-950">
            <video
              src={broadcastUrl}
              autoPlay
              muted
              controls
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>ON AIR</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-slate-950 text-white border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
                CURRENT BROADCAST
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                Global Prime with Vikramaditya Sharma: Climate & Markets Consensus
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Live from Antigravity News Studios, New Delhi
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-emerald-400 font-bold flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1" />
                HD 1080p
              </span>
            </div>
          </div>
        </div>

        {/* Broadcast Program Schedule (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-slate-800">
            <Calendar className="w-4 h-4 text-red-600" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Today's Broadcast Lineup
            </h3>
          </div>

          <div className="space-y-3">
            {schedule.map((prog, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs transition ${
                  prog.live
                    ? "bg-red-50 border-red-200 text-red-950 dark:bg-red-950/40 dark:border-red-900 dark:text-red-100 font-semibold"
                    : "bg-gray-50 border-gray-100 text-slate-700 dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] text-slate-400">
                    {prog.time}
                  </span>
                  {prog.live && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-bold uppercase animate-pulse">
                      NOW AIRING
                    </span>
                  )}
                </div>
                <p className="leading-snug">{prog.show}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-900 dark:text-blue-200">
            <p className="font-bold">Satellite & Cable Telecast Frequency:</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
              INSAT-4B: 11470 MHz • Transponder 12 • Polarization: Horizontal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
