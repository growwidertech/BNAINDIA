import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="border-b-2 border-red-600 pb-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Privacy Policy & Data Protection
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Compliant with Digital Personal Data Protection (DPDP) Act 2023 & International Standards
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
            1. Information We Collect
          </h2>
          <p>
            When you register an account, subscribe to our newsletters, save bookmarks, or submit comments and citizen reports, we collect your name, email address, IP address, and voluntary profile information. We do not sell or monetize personal subscriber data with third-party data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
            2. Cookies and Tracking Technologies
          </h2>
          <p>
            We use secure HTTP-only session cookies solely to preserve your login session, saved preferences, language selection, and reading mode. We do not track your activity across unrelated third-party websites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
            3. Data Retention and Deletion Rights
          </h2>
          <p>
            You retain full sovereignty over your personal data. You may request complete export or deletion of your account, submissions, and comment logs at any time by contacting privacy@antigravitynews.com.
          </p>
        </section>
      </div>
    </div>
  );
}
