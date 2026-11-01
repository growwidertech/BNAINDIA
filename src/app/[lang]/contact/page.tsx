"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="border-b-2 border-red-600 pb-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Contact Antigravity Newsroom
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Editorial Inquiries, Whistleblower Tips, Syndication & Advertising
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Newsroom Head Office
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  Antigravity Media Towers, Central Geopolitics Plaza, New Delhi 110001, India
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>+91 (11) 4890-2026 (News Desk 24/7)</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>editorial@antigravitynews.com</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-900 dark:text-red-200 space-y-1">
            <p className="font-bold">Encrypted Whistleblower Tips:</p>
            <p className="text-[11px] text-red-800 dark:text-red-300">
              Have confidential information or documents? Contact our investigative unit securely via tips@antigravitynews.com or Signal.
            </p>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Message Received
              </h3>
              <p className="text-xs text-slate-500">
                Thank you for reaching out. The relevant desk will review your inquiry shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Mahindra"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Inquiry Department
                </label>
                <select
                  required
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  <option value="editorial">Editorial & Corrections Desk</option>
                  <option value="advertising">Advertising & Brand Partnerships</option>
                  <option value="syndication">Content Syndication & Licensing</option>
                  <option value="general">General Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center space-x-1"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                <span>Send Message to Desk</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
