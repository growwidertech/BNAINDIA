"use client";

import React, { useState } from "react";
import { Vote, CheckCircle2, BarChart2 } from "lucide-react";

export function DailyPollWidget() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState([
    { text: "Yes, essential to fight deepfakes and viral rumors", pct: 64, count: 1840 },
    { text: "Only for sensitive political and breaking stories", pct: 24, count: 690 },
    { text: "No, readers can evaluate sources independently", pct: 12, count: 345 },
  ]);

  const handleVote = () => {
    if (selected === null) return;
    setHasVoted(true);
    setVotes((prev) =>
      prev.map((opt, i) =>
        i === selected
          ? { ...opt, count: opt.count + 1, pct: Math.round(((opt.count + 1) / 2876) * 100) }
          : opt
      )
    );
  };

  const totalVotes = votes.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/70 flex items-center justify-center text-red-600 dark:text-red-400">
          <Vote className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">
            Daily Citizen Poll
          </h3>
          <p className="text-[10px] text-slate-400">Cast your vote &amp; see live results</p>
        </div>
      </div>

      {/* Question */}
      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
        Should digital news platforms mandate independent forensic fact-check badges for viral social media videos?
      </p>

      {/* Poll Options */}
      <div className="space-y-2.5">
        {votes.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => !hasVoted && setSelected(idx)}
            className={`p-3 rounded-xl border text-xs cursor-pointer transition relative overflow-hidden ${
              selected === idx
                ? "border-red-600 bg-red-50/50 dark:bg-red-950/30"
                : "border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 hover:bg-gray-100/70 dark:hover:bg-slate-800"
            }`}
          >
            {hasVoted ? (
              /* Results bar */
              <div>
                <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                  <span className="text-slate-800 dark:text-slate-200">{opt.text}</span>
                  <span className="text-red-600 font-mono">{opt.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-700"
                    style={{ width: `${opt.pct}%` }}
                  />
                </div>
              </div>
            ) : (
              /* Radio vote option */
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selected === idx
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                >
                  {selected === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {opt.text}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
        <span>{totalVotes.toLocaleString()} votes recorded</span>
        {!hasVoted ? (
          <button
            onClick={handleVote}
            disabled={selected === null}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-lg font-bold text-xs transition shadow-sm"
          >
            Vote Now
          </button>
        ) : (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Vote Recorded</span>
          </span>
        )}
      </div>
    </div>
  );
}
