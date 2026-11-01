import React from "react";
import { CheckCircle2, ShieldAlert, FileCheck, Scale } from "lucide-react";

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="border-b-2 border-red-600 pb-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Editorial Code of Ethics & Fact-Checking Policy
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Antigravity News Agency Standards of Practice
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center">
            <CheckCircle2 className="w-5 h-5 text-red-600 mr-2 shrink-0" />
            1. Accuracy, Verification & Sourcing
          </h2>
          <p>
            Every assertion of fact published by Antigravity News must be verified by at least two independent credible sources or backed by official public documentation, telemetry records, or peer-reviewed findings. Anonymous sources are permitted only when disclosure places the source in physical or legal peril, and requires approval from the Editor-in-Chief.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center">
            <Scale className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
            2. Impartiality and Conflict of Interest
          </h2>
          <p>
            Antigravity journalists and editorial contributors are strictly barred from accepting gifts, hospitality, or honorariums from individuals, political entities, or corporate groups covered in their reporting. Any personal or financial interest in a subject must be disclosed immediately to the editorial board.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center">
            <ShieldAlert className="w-5 h-5 text-amber-600 mr-2 shrink-0" />
            3. Corrections and Revisions Policy
          </h2>
          <p>
            When factual errors occur, Antigravity News corrects them promptly and transparently. Substantive corrections are noted at the head or foot of the article with a clear explanation of what was altered, the date and time of the modification, and an apology if warranted. We do not stealth-edit stories.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center">
            <FileCheck className="w-5 h-5 text-emerald-600 mr-2 shrink-0" />
            4. User-Submitted and Citizen Journalism Moderation
          </h2>
          <p>
            Articles, photographs, and video materials submitted through our public Contributor Desk are subjected to strict pre-publication review. No citizen report goes live automatically. Our desks verify identity, location metadata, potential copyright infringement, and digital manipulation before syndication.
          </p>
        </section>
      </div>
    </div>
  );
}
