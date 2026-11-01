import React from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { getDictionary } from "@/lib/languages";

interface NewsWithoutBordersBannerProps {
  lang: string;
}

export function NewsWithoutBordersBanner({ lang }: NewsWithoutBordersBannerProps) {
  const dict = getDictionary(lang);

  const greetings = [
    { text: "Hello", lang: "English" },
    { text: "नमस्ते", lang: "Hindi" },
    { text: "வணக்கம்", lang: "Tamil" },
    { text: "తెలుగు", lang: "Telugu" },
    { text: "নমস্কার", lang: "Bengali" },
    { text: "ಹಲೋ", lang: "Kannada" },
    { text: "مرحبا", lang: "Urdu" },
    { text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", lang: "Punjabi" },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0a1128] via-[#102a43] to-[#1e3a8a] text-white p-6 sm:p-8 my-10 shadow-lg border border-blue-900/40">
      {/* Decorative Globe Background SVG */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center overflow-hidden">
        <svg className="w-96 h-96 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="1" />
          <path strokeWidth="1" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Headline & Action */}
        <div className="lg:col-span-5 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-[11px] font-bold tracking-wider uppercase border border-blue-400/20">
            <Globe className="w-3.5 h-3.5" />
            <span>Multilingual Journalism</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {dict.newsWithoutBorders}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {dict.exploreGlobalNews}
          </p>

          <div className="pt-2">
            <Link
              href={`/${lang}/reporters`}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <span>Explore BNA Reporters Network</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Multilingual Greeting Tiles */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {greetings.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center transition"
            >
              <span className="block font-bold text-sm sm:text-base text-white">
                {item.text}
              </span>
              <span className="block text-[10px] text-blue-200 mt-0.5">
                {item.lang}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
