"use client";

import React from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/languages";

interface FooterProps {
  lang: string;
}

export function Footer({ lang }: FooterProps) {
  const dict = getDictionary(lang);

  return (
    <footer className="bg-[#0b1528] text-slate-300 pt-12 pb-8 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={`/${lang}`} className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-md shrink-0">
                <img
                  src="/images/bna-logo.jpg"
                  alt="BNA News Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-black text-xl tracking-tight text-[#ea580c] uppercase font-sans">
                    BNA
                  </span>
                  <span className="font-black text-xl tracking-tight text-white uppercase font-sans">
                    NEWS
                  </span>
                </div>
                <p className="text-[10px] text-[#15803d] tracking-wider uppercase font-bold">
                  = True Democracy Voice =
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Bharat News Agency (BNA) — True Democracy Voice. Delivering fearless, verified, independent journalism from every district across India in 11 languages.
            </p>

            <div className="pt-2 text-xs text-slate-400">
              <p className="font-medium text-slate-300">Headquarters & National Bureau:</p>
              <p>BNA Media Towers, Central Press Enclave, New Delhi 110001, India</p>
              <p className="mt-1">Regional Desks: Mumbai • Bengaluru • Kolkata • Chennai • Hyderabad • Lucknow</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {dict.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}`} className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/reporters`} className="hover:text-white text-orange-400 font-bold transition">
                  Journalists Directory
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/reporter-signup`} className="hover:text-white text-emerald-400 font-bold transition">
                  Join as Reporter
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/submit-news`} className="hover:text-white text-amber-300 transition font-medium">
                  Submit News Report
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/video`} className="hover:text-white transition">
                  Video News
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/live-tv`} className="hover:text-white transition">
                  Live TV Stream
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/editorial-policy`} className="hover:text-white transition">
                  Editorial Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {dict.categories}
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              <li>
                <Link href={`/${lang}/world`} className="hover:text-white transition">
                  World
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/business`} className="hover:text-white transition">
                  Business
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/technology`} className="hover:text-white transition">
                  Technology
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/sports`} className="hover:text-white transition">
                  Sports
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/entertainment`} className="hover:text-white transition">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/health`} className="hover:text-white transition">
                  Health
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lifestyle`} className="hover:text-white transition">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/science`} className="hover:text-white transition">
                  Science
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/india`} className="hover:text-white transition">
                  India
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/opinion`} className="hover:text-white transition">
                  Opinion
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Channels & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {dict.followUs}
            </h3>
            <div className="flex items-center space-x-2.5">
              {/* Facebook */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition text-xs font-bold shadow"
                aria-label="Facebook"
              >
                f
              </a>
              {/* X */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition text-xs font-bold shadow"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
              {/* Instagram */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 flex items-center justify-center text-white transition text-xs font-bold shadow"
                aria-label="Instagram"
              >
                ig
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition text-xs font-bold shadow"
                aria-label="YouTube"
              >
                ▶
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white transition text-xs font-bold shadow"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                Subscribe to Daily Briefing:
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to Antigravity News Daily!");
                }}
                className="flex"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-l text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-r transition"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} BNA News Agency — True Democracy Voice. {dict.allRightsReserved}
          </div>
          <div className="flex flex-wrap items-center space-x-4">
            <Link href={`/${lang}/privacy`} className="hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href={`/${lang}/terms`} className="hover:text-slate-400 transition">
              Terms of Use
            </Link>
            <span>•</span>
            <Link href="/api/sitemap" className="hover:text-slate-400 transition">
              Sitemap
            </Link>
            <span>•</span>
            <Link href="/api/rss" className="hover:text-slate-400 transition">
              RSS Feed
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
