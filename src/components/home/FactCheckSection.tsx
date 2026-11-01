"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

interface FactCheckItem {
  id: string;
  claim: string;
  verdict: "TRUE" | "FALSE" | "MISLEADING";
  finding: string;
  category: string;
  date: string;
}

export function FactCheckSection({ lang }: { lang: string }) {
  const factChecks: FactCheckItem[] = [
    {
      id: "fc-1",
      claim: "Viral video claims heavy snowfall blanketed the Thar Desert in Rajasthan",
      verdict: "FALSE",
      finding: "Forensic analysis confirms the footage was filmed in northern Iran during 2021 and misattributed to Rajasthan.",
      category: "Viral Debunk",
      date: "3 hours ago",
    },
    {
      id: "fc-2",
      claim: "Autonomous medical drone supply transit corridor cleared for trials in Bengaluru",
      verdict: "TRUE",
      finding: "Verified with civil aviation authorities and municipal health department; trial flights officially launched this week.",
      category: "Aviation & Tech",
      date: "5 hours ago",
    },
    {
      id: "fc-3",
      claim: "Ministry mandates 4-day working week for all private sector IT enterprises",
      verdict: "MISLEADING",
      finding: "Draft regulatory framework permits 48-hour flexible week by mutual employee consent, not an enforced mandatory rule.",
      category: "Labor & Economy",
      date: "8 hours ago",
    },
  ];

  const getVerdictBadge = (verdict: "TRUE" | "FALSE" | "MISLEADING") => {
    switch (verdict) {
      case "TRUE":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>VERIFIED • TRUE</span>
          </span>
        );
      case "FALSE":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            <span>DEBUNKED • FALSE</span>
          </span>
        );
      case "MISLEADING":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>MISLEADING • CONTEXT</span>
          </span>
        );
    }
  };

  return (
    <section className="my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-lg space-y-5 border border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center space-x-2">
              <span>BNA Fact Check Desk</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Claims
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Forensic verification of viral claims, deepfakes, and digital misinformation
            </p>
          </div>
        </div>

        <Link
          href={`/${lang}/science`}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center transition"
        >
          <span>All Fact Checks</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      {/* Fact Check Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {factChecks.map((fc) => (
          <div
            key={fc.id}
            className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {fc.category}
                </span>
                <span className="text-[10px] text-slate-500">{fc.date}</span>
              </div>

              <div className="pt-0.5">{getVerdictBadge(fc.verdict)}</div>

              <h3 className="font-bold text-xs sm:text-sm text-slate-100 leading-snug">
                "{fc.claim}"
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-700/60 pt-2.5 italic">
              <b className="text-slate-300 not-italic">Finding: </b>
              {fc.finding}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
