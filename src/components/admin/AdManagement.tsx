"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Info,
  HelpCircle,
  Code,
} from "lucide-react";
import { AdSettingData } from "@/lib/ads";

interface AdManagementProps {
  initialSettings: AdSettingData;
}

export function AdManagement({ initialSettings }: AdManagementProps) {
  const [settings, setSettings] = useState<AdSettingData>(initialSettings);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update Google AdSense configuration.");
      }

      setSettings(data.settings);
      setSuccessMsg("Google AdSense settings updated successfully! Changes are live across the portal.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save settings.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Revenue & Digital Monetization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Google AdSense Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage your Google AdSense Publisher account, auto-ads triggers, and dedicated responsive ad units across header, in-article, sidebar, feed, and footer slots.
          </p>
        </div>

        <div className="shrink-0 flex items-center space-x-2">
          <a
            href="https://adsense.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5 border border-white/20"
          >
            <span>Open AdSense Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Feedback Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Master Account Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Master AdSense Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Core credentials and global delivery parameters for your portal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Publisher ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                Google AdSense Publisher ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="ca-pub-1234567890123456"
                  value={settings.publisherId}
                  onChange={(e) => setSettings({ ...settings, publisherId: e.target.value })}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Found in your Google AdSense Account &gt; Account Information. Format: ca-pub-XXXXXXXXXXXXXXXX</span>
              </p>
            </div>

            {/* Quick Switch Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* AdSense Master Enable Switch */}
              <div
                onClick={() => setSettings({ ...settings, adsenseEnabled: !settings.adsenseEnabled })}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  settings.adsenseEnabled
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                    : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    AdSense Delivery
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {settings.adsenseEnabled ? "Active & Serving Ads" : "Paused / Disabled"}
                  </span>
                </div>
                {settings.adsenseEnabled ? (
                  <ToggleRight className="w-7 h-7 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </div>

              {/* Auto Ads Switch */}
              <div
                onClick={() => setSettings({ ...settings, autoAdsEnabled: !settings.autoAdsEnabled })}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  settings.autoAdsEnabled
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800"
                    : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Page Auto Ads
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {settings.autoAdsEnabled ? "Google Machine Learning" : "Manual Slots Only"}
                  </span>
                </div>
                {settings.autoAdsEnabled ? (
                  <ToggleRight className="w-7 h-7 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </div>

              {/* Test / Sandbox Mode Switch */}
              <div
                onClick={() => setSettings({ ...settings, testMode: !settings.testMode })}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between sm:col-span-2 ${
                  settings.testMode
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                    : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Test &amp; Preview Placeholders
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {settings.testMode
                      ? "Showing labelled mock units for layout testing & design QA"
                      : "Live Google ad rendering"}
                  </span>
                </div>
                {settings.testMode ? (
                  <ToggleRight className="w-7 h-7 text-amber-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Editorial Ad Slots */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Editorial Ad Placement Slots (data-ad-slot)
              </h2>
              <p className="text-xs text-slate-500">
                Configure specific ad slot IDs created in your Google AdSense console under "Ads &gt; By ad unit"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Header Billboard */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  1. Header Top Billboard Slot
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono rounded">
                  728x90 / Responsive
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Displayed at the top of the Homepage and Category pages beneath the ticker.
              </p>
              <input
                type="text"
                placeholder="1010101010"
                value={settings.headerSlotId || ""}
                onChange={(e) => setSettings({ ...settings, headerSlotId: e.target.value })}
                className="w-full p-2.5 font-mono text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* 2. In-Article Native Banner */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  2. In-Article Native Story Unit
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono rounded">
                  In-Article Native
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Embedded natively inside news articles after paragraph 2 for maximum engagement.
              </p>
              <input
                type="text"
                placeholder="2020202020"
                value={settings.inArticleSlotId || ""}
                onChange={(e) => setSettings({ ...settings, inArticleSlotId: e.target.value })}
                className="w-full p-2.5 font-mono text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* 3. Sidebar Skyscraper */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  3. Article Sidebar Skyscraper
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono rounded">
                  300x600 / 300x250
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                High-converting sticky right rail unit beside the news story on desktop screens.
              </p>
              <input
                type="text"
                placeholder="3030303030"
                value={settings.sidebarSlotId || ""}
                onChange={(e) => setSettings({ ...settings, sidebarSlotId: e.target.value })}
                className="w-full p-2.5 font-mono text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* 4. Homepage In-Feed Banner */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  4. Homepage In-Feed Banner
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-mono rounded">
                  Responsive Grid
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Interspersed between Top Stories and Category sections on the editorial homepage.
              </p>
              <input
                type="text"
                placeholder="4040404040"
                value={settings.feedSlotId || ""}
                onChange={(e) => setSettings({ ...settings, feedSlotId: e.target.value })}
                className="w-full p-2.5 font-mono text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* 5. Footer Anchor Banner */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  5. Bottom / Footer Anchor Unit
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono rounded">
                  728x90 Anchor
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Positioned directly above the comprehensive news portal footer.
              </p>
              <input
                type="text"
                placeholder="5050505050"
                value={settings.footerSlotId || ""}
                onChange={(e) => setSettings({ ...settings, footerSlotId: e.target.value })}
                className="w-full p-2.5 font-mono text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* AdSense Best Practices Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white block">
              Google AdSense Compliance Guidelines
            </span>
            <p>
              1. Ensure your domain is listed as an <strong>Authorized Site</strong> in your Google AdSense dashboard under "Sites".
            </p>
            <p>
              2. For production, add your <code>ads.txt</code> record: <code>google.com, {settings.publisherId}, DIRECT, f08c47fec0942fa0</code>.
            </p>
            <p>
              3. The slots above automatically load with responsive layouts to prevent Cumulative Layout Shift (CLS) and adhere to Google Publisher Policies.
            </p>
          </div>
        </div>

        {/* Save Actions Bar */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? "Saving Configuration..." : "Save AdSense Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
