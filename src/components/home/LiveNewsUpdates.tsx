import React from "react";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { getDictionary } from "@/lib/languages";

interface LiveNewsUpdatesProps {
  lang: string;
}

export function LiveNewsUpdates({ lang }: LiveNewsUpdatesProps) {
  const dict = getDictionary(lang);

  const updates = [
    {
      time: "15:32",
      text: "UN calls for immediate humanitarian de-escalation and ceasefire safeguards in regional flashpoints",
      category: "World",
    },
    {
      time: "14:47",
      text: "Brent crude moderates below $76 after OPEC+ affirms steady output targets",
      category: "Business",
    },
    {
      time: "13:20",
      text: "Union Ministry unveils streamlined incentive package for semiconductor fab research clusters",
      category: "Technology",
    },
    {
      time: "12:05",
      text: "Southwest monsoon advances with moderate to heavy showers recorded across coastal districts",
      category: "India",
    },
    {
      time: "10:38",
      text: "Botanists catalog two previously unrecorded bio-luminescent flora varieties in Western Ghats",
      category: "Science",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-ping" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
            <Radio className="w-4 h-4 mr-1 text-[#ea580c]" />
            {dict.liveUpdates}
          </h3>
        </div>
        <Link
          href={`/${lang}/world`}
          className="text-[11px] font-bold text-slate-500 hover:text-red-600 dark:hover:text-red-400 flex items-center transition"
        >
          <span>{dict.viewAll}</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {updates.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 text-xs group">
            <span className="font-mono font-bold text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">
              {item.time}
            </span>
            <div className="flex-1">
              <p className="text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition leading-snug font-medium cursor-pointer">
                {item.text}
              </p>
              <span className="inline-block text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                #{item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
