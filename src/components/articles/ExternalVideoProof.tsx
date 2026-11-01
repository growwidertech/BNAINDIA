"use client";

import React from "react";
import {
  ExternalLink,
  ShieldCheck,
  Play,
  Film,
  AlertTriangle,
  Info,
} from "lucide-react";
import { getVideoPlatformMeta, VideoPlatform } from "@/lib/videoProof";

interface ExternalVideoProofProps {
  url?: string | null;
  platform?: string | null;
  title?: string | null;
  headline?: string;
  className?: string;
}

export function ExternalVideoProof({
  url,
  platform,
  title,
  headline,
  className = "",
}: ExternalVideoProofProps) {
  if (!url) return null;

  const meta = getVideoPlatformMeta(url, platform);
  const proofHeading =
    title || "Verified Ground Video Proof & Source Evidence";

  return (
    <div
      className={`my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all ${className}`}
    >
      {/* Proof Header Bar (Times Now Style) */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Verified Video Proof
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-300">
              Source Evidence Linked from {meta.name}
            </p>
          </div>
        </div>

        {/* Platform Badge */}
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${meta.badgeBg} ${meta.badgeBorder} ${meta.badgeText} flex items-center space-x-1.5`}
        >
          <Film className="w-3 h-3" />
          <span>{meta.badgeLabel}</span>
        </span>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-snug">
            {proofHeading}
          </h3>
          {headline && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              Referenced in: {headline}
            </p>
          )}
        </div>

        {/* If YouTube Embed is Available */}
        {meta.embedUrl ? (
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-gray-200 dark:border-slate-800">
            <iframe
              src={meta.embedUrl}
              title={proofHeading}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          /* Social Media Proof Preview Card for X, Instagram, Facebook */
          <div className="p-4 sm:p-5 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Broadcast Proof Hosted on {meta.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {meta.domainNotice}. Click below to view the original uncompressed video with full comments and timestamps.
              </p>
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-md pt-1">
                Source: {url}
              </p>
            </div>
          </div>
        )}

        {/* Action Button: Direct Redirect to Social Media / External Host */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2 ${meta.btnBg} ${meta.btnHover} ${meta.btnText}`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{meta.actionText}</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>

          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Opens official third-party social media broadcast</span>
          </div>
        </div>

        {/* Times Now Style Editorial Fact-Check Disclaimer */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-[10px] text-slate-400 leading-relaxed flex items-start space-x-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>Times Now / BNA Proof Verification:</strong> This external video proof was filmed on-location and submitted as evidence. Readers are redirected directly to the publisher's broadcast on {meta.name}. Antigravity News / BNA is not affiliated with external third-party social media hosts.
          </span>
        </div>
      </div>
    </div>
  );
}
