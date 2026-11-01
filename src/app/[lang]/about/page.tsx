import React from "react";
import Link from "next/link";
import { Shield, Award, Users, Globe2, Building2 } from "lucide-react";

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  await params;
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      {/* Title */}
      <div className="border-b-2 border-red-600 pb-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          About Antigravity News
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Trusted News. A Connected World. • Established 2024
        </p>
      </div>

      {/* Mission Statement */}
      <section className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
        <p className="text-lg font-semibold text-slate-900 dark:text-white not-italic">
          Antigravity News Agency is a next-generation independent digital news organization dedicated to principled, fact-checked, high-impact journalism spanning 11 languages across the Indian subcontinent and global capitals.
        </p>
        <p>
          Founded on the unshakeable premise that an informed public is the cornerstone of democracy, our newsroom operates free from commercial, political, or algorithmic biases. We investigate the critical issues of our time—from geopolitics and economic transformation to climate resilience, scientific breakthroughs, and cultural histories.
        </p>
      </section>

      {/* Core Values 3-Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
          <Shield className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Uncompromising Truth
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every story undergoes rigorous multi-tier fact-checking. We cross-verify with primary sources, forensic data, and eyewitness accounts.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
          <Globe2 className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Multilingual Equality
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            News shouldn&apos;t be confined to a single lingua franca. We publish simultaneously across English, Hindi, Kannada, Tamil, Urdu, Telugu, and more.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
          <Award className="w-8 h-8 text-amber-500 mb-2" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Ethical Transparency
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clear separation between opinion and reporting. We publicly log all corrections with timestamped editorial revision trails.
          </p>
        </div>
      </section>

      {/* Global Bureaus */}
      <section className="p-6 rounded-xl bg-slate-900 text-white space-y-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold uppercase tracking-wider">
            Our News Bureaus & Coverage Desks
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-red-400">New Delhi Bureau</h4>
            <p className="text-slate-400 mt-1">National Politics, Parliament & Supreme Court</p>
          </div>
          <div>
            <h4 className="font-bold text-blue-400">Bengaluru Bureau</h4>
            <p className="text-slate-400 mt-1">Technology, Deep Tech, Startups & Aerospace</p>
          </div>
          <div>
            <h4 className="font-bold text-emerald-400">Mumbai Bureau</h4>
            <p className="text-slate-400 mt-1">Financial Markets, Economy & Entertainment</p>
          </div>
          <div>
            <h4 className="font-bold text-purple-400">Global Correspondents</h4>
            <p className="text-slate-400 mt-1">Washington, London, Singapore & Tokyo</p>
          </div>
        </div>
      </section>
    </div>
  );
}
