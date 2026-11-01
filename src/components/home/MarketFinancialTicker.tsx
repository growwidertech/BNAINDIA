"use client";

import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export function MarketFinancialTicker() {
  const indices = [
    { name: "BSE SENSEX", value: "84,212.45", change: "+418.30", pct: "+0.50%", positive: true },
    { name: "NIFTY 50", value: "25,790.90", change: "+124.65", pct: "+0.49%", positive: true },
    { name: "GOLD (10g)", value: "₹78,450", change: "-120.00", pct: "-0.15%", positive: false },
    { name: "SILVER (1kg)", value: "₹94,200", change: "+350.00", pct: "+0.37%", positive: true },
    { name: "USD / INR", value: "₹84.06", change: "-0.04", pct: "-0.05%", positive: true },
    { name: "BRENT CRUDE", value: "$74.20", change: "-0.82", pct: "-1.09%", positive: false },
  ];

  return (
    <div className="w-full bg-slate-900 text-white rounded-xl overflow-hidden shadow-sm border border-slate-800">
      <div className="flex items-center">
        {/* Ticker Title Badge */}
        <div className="bg-[#ea580c] px-3.5 py-2 shrink-0 flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>MARKETS PULSE</span>
        </div>

        {/* Scrolling Items */}
        <div className="flex-1 overflow-x-auto py-2 px-3 no-scrollbar flex items-center space-x-6 text-xs font-mono">
          {indices.map((idx, i) => (
            <div key={i} className="flex items-center space-x-2 shrink-0 border-r border-slate-800 pr-5 last:border-r-0">
              <span className="font-sans font-bold text-[11px] text-slate-300">
                {idx.name}
              </span>
              <span className="font-bold text-white text-xs">
                {idx.value}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 ${
                  idx.positive
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                    : "bg-rose-950/80 text-rose-400 border border-rose-800/50"
                }`}
              >
                {idx.positive ? (
                  <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5 inline mr-0.5" />
                )}
                <span>{idx.pct}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
