import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="border-b-2 border-red-600 pb-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Terms & Conditions of Service
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Antigravity News Agency Terms of Use
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
            1. Intellectual Property & Syndication Rights
          </h2>
          <p>
            All articles, investigative reports, photographic assets, infographics, and audiovisual footage produced by Antigravity News Agency are proprietary assets protected under global copyright treaties. Non-commercial quoting with prominent hyperlink attribution is permitted under fair use.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
            2. Reader Comments & Discussion Rules
          </h2>
          <p>
            Readers participate in article comment forums under community standards. Defamatory statements, hate speech, unlawful harassment, spam promotions, and incitement to violence will result in immediate comment removal and permanent account termination.
          </p>
        </section>
      </div>
    </div>
  );
}
