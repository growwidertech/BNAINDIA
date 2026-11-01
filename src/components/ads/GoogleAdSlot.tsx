"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, ExternalLink, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export type AdSlotType = "header" | "inArticle" | "sidebar" | "feed" | "footer";

interface GoogleAdSlotProps {
  slotType: AdSlotType;
  publisherId?: string;
  slotId?: string | null;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  fullWidthResponsive?: boolean;
  className?: string;
  testMode?: boolean;
  enabled?: boolean;
}

const SLOT_CONFIGS: Record<
  AdSlotType,
  {
    name: string;
    description: string;
    defaultSlotId: string;
    aspectRatio: string;
    minHeight: string;
  }
> = {
  header: {
    name: "Header Top Billboard",
    description: "High-impact 728x90 Leaderboard / Responsive Top Banner",
    defaultSlotId: "1010101010",
    aspectRatio: "aspect-[970/90] sm:aspect-[728/90]",
    minHeight: "min-h-[90px]",
  },
  inArticle: {
    name: "In-Article Native Banner",
    description: "In-feed responsive ad integrated inside news story text",
    defaultSlotId: "2020202020",
    aspectRatio: "aspect-[300/250] sm:aspect-[336/280]",
    minHeight: "min-h-[250px]",
  },
  sidebar: {
    name: "Article Sidebar Skyscraper",
    description: "Desktop Sticky 300x600 / 300x250 Sidebar Display Unit",
    defaultSlotId: "3030303030",
    aspectRatio: "aspect-[300/250] lg:aspect-[300/600]",
    minHeight: "min-h-[300px]",
  },
  feed: {
    name: "Homepage In-Feed Billboard",
    description: "Inter-sectional horizontal display ad between news beats",
    defaultSlotId: "4040404040",
    aspectRatio: "aspect-[970/90] sm:aspect-[728/90]",
    minHeight: "min-h-[90px]",
  },
  footer: {
    name: "Footer Anchor Banner",
    description: "Bottom sticky or full-width anchor placement",
    defaultSlotId: "5050505050",
    aspectRatio: "aspect-[728/90]",
    minHeight: "min-h-[90px]",
  },
};

export function GoogleAdSlot({
  slotType,
  publisherId: propPublisherId,
  slotId: propSlotId,
  format = "auto",
  fullWidthResponsive = true,
  className = "",
  testMode: propTestMode,
  enabled: propEnabled,
}: GoogleAdSlotProps) {
  const [adConfig, setAdConfig] = useState({
    publisherId: propPublisherId || "ca-pub-9876543210123456",
    slotId: propSlotId || SLOT_CONFIGS[slotType].defaultSlotId,
    testMode: propTestMode !== undefined ? propTestMode : false,
    enabled: propEnabled !== undefined ? propEnabled : true,
  });

  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // If not passed via props, pull from API
    if (propPublisherId === undefined || propEnabled === undefined) {
      fetch("/api/ads")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            let activeSlot = data[`${slotType}SlotId`] || SLOT_CONFIGS[slotType].defaultSlotId;
            setAdConfig({
              publisherId: data.publisherId || "ca-pub-9876543210123456",
              slotId: activeSlot,
              testMode: Boolean(data.testMode),
              enabled: Boolean(data.adsenseEnabled),
            });
          }
        })
        .catch(() => {});
    }
  }, [slotType, propPublisherId, propEnabled]);

  useEffect(() => {
    // Only execute Google Ad push in production mode when not in test mode
    if (
      adConfig.enabled &&
      !adConfig.testMode &&
      typeof window !== "undefined" &&
      adRef.current &&
      !pushedRef.current
    ) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (e) {
        console.debug("AdSense push:", e);
      }
    }
  }, [adConfig]);

  if (!adConfig.enabled) {
    return null;
  }

  const slotInfo = SLOT_CONFIGS[slotType] || SLOT_CONFIGS.header;

  // Render Test Mode / Preview Box when testMode is true or if local dummy publisher ID
  if (adConfig.testMode || adConfig.publisherId === "ca-pub-9876543210123456") {
    return (
      <div
        className={`w-full my-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 p-4 transition-all shadow-sm ${slotInfo.minHeight} flex flex-col justify-between items-center text-center ${className}`}
      >
        {/* AdSense Top Badge */}
        <div className="w-full flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase pb-2 border-b border-gray-200 dark:border-slate-800">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Google AdSense Slot</span>
          </span>
          <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[9px]">
            {adConfig.testMode ? "Test / Preview Mode" : "Ready for Ads"}
          </span>
        </div>

        {/* Ad Content Representation */}
        <div className="py-4 space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{slotInfo.name}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {slotInfo.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] text-slate-400 font-mono">
            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">
              client: {adConfig.publisherId}
            </span>
            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">
              slot: {adConfig.slotId}
            </span>
            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">
              format: {format}
            </span>
          </div>
        </div>

        {/* AdSense Bottom Disclaimer */}
        <div className="w-full flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-gray-200 dark:border-slate-800">
          <span>Advertisements by Google</span>
          <span className="text-[9px] text-blue-600 dark:text-blue-400 flex items-center space-x-1">
            <span>Ad Choices</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    );
  }

  // Production AdSense rendering with <ins class="adsbygoogle">
  return (
    <div className={`w-full my-4 overflow-hidden text-center ${className}`}>
      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adConfig.publisherId}
        data-ad-slot={adConfig.slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
