"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Globe,
  Sun,
  Moon,
  User as UserIcon,
  Menu,
  X,
  Tv,
  Video,
  FilePlus,
  Bookmark,
  Shield,
  ChevronDown,
  Users,
  UserCheck,
} from "lucide-react";
import { SUPPORTED_LANGUAGES, getDictionary, getLanguageConfig } from "@/lib/languages";
import { useAuth } from "@/components/common/AuthProvider";
import { useTheme } from "@/components/common/ThemeProvider";

interface HeaderProps {
  lang: string;
  categories?: { id: string; name: string; slug: string }[];
}

export function Header({ lang, categories = [] }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dict = getDictionary(lang);
  const currentLangConfig = getLanguageConfig(lang);

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Live ticking clock in IST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLanguageChange = (newLang: string) => {
    setLangDropdownOpen(false);
    // Replace current lang in URL path
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && SUPPORTED_LANGUAGES.some((l) => l.code === segments[0])) {
      segments[0] = newLang;
      router.push("/" + segments.join("/"));
    } else {
      router.push(`/${newLang}`);
    }
  };

  const defaultNavCategories = [
    { name: "Home", slug: "" },
    { name: "World", slug: "world" },
    { name: "Business", slug: "business" },
    { name: "Technology", slug: "technology" },
    { name: "Sports", slug: "sports" },
    { name: "Entertainment", slug: "entertainment" },
    { name: "Health", slug: "health" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Science", slug: "science" },
    { name: "Opinion", slug: "opinion" },
  ];

  const navItems = categories.length > 0
    ? [{ name: "Home", slug: "" }, ...categories.slice(0, 9).map(c => ({ name: c.name, slug: c.slug }))]
    : defaultNavCategories;

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
      {/* 1. Top Utility Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 py-1.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Clock & Weather */}
          <div className="flex items-center space-x-4">
            <span className="font-medium tracking-wide">
              {currentTime ? `${currentTime} (IST)` : "Loading..."}
            </span>
            <span className="hidden md:inline-block text-slate-400 dark:text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
              <span>⛅ New Delhi 26°C</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">• SENSEX: 84,920 (+412)</span>
            </span>
          </div>

          {/* Right: Language, Theme & Auth Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 py-1 px-2.5 rounded bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentLangConfig.nativeName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-slate-900 rounded-md shadow-xl border border-gray-200 dark:border-slate-800 py-2 z-50 grid grid-cols-2 gap-1 px-2">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageChange(l.code)}
                      className={`text-left px-2.5 py-1.5 rounded text-xs transition flex flex-col ${
                        l.code === lang
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold"
                          : "hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition"
              title="Toggle reading theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 py-1 px-2.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-900 font-semibold"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-md shadow-xl border border-gray-200 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={`/${lang}/profile`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <UserIcon className="w-3.5 h-3.5 mr-2" />
                      {dict.profile}
                    </Link>

                    <Link
                      href={`/${lang}/bookmarks`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <Bookmark className="w-3.5 h-3.5 mr-2" />
                      {dict.bookmarks}
                    </Link>

                    <Link
                      href={`/${lang}/submit-news`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <FilePlus className="w-3.5 h-3.5 mr-2" />
                      {dict.submitNews}
                    </Link>

                    {["ADMIN", "EDITOR"].includes(user.role) && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold"
                      >
                        <Shield className="w-3.5 h-3.5 mr-2" />
                        {dict.adminDashboard}
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        {dict.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/${lang}/auth/signin`}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {dict.signIn}
                </Link>
                <Link
                  href={`/${lang}/auth/signup`}
                  className="px-3 py-1 text-xs font-semibold rounded bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
                >
                  {dict.signUp}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Brand Row with BNA Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href={`/${lang}`} className="flex items-center space-x-3 group">
          <div className="h-12 sm:h-14 w-auto flex items-center justify-center shrink-0">
            <img
              src="/images/bna-logo.jpg"
              alt="BNA True Democracy Voice"
              className="h-12 sm:h-14 w-auto object-contain rounded"
            />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-baseline space-x-1.5">
              <span className="font-black text-2xl tracking-tight text-[#ea580c] uppercase font-sans">
                BNA
              </span>
              <span className="font-extrabold text-2xl tracking-tight text-[#0b2545] dark:text-white uppercase font-sans">
                NEWS
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#15803d] tracking-wider uppercase">
              = True Democracy Voice =
            </p>
          </div>
        </Link>

        {/* Live Search Bar & Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <form onSubmit={handleSearch} className="hidden sm:flex relative w-64 md:w-80">
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-1.5 text-xs rounded-full border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:bg-white dark:focus:bg-slate-900 transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#0b2545] dark:bg-orange-600 hover:bg-[#ea580c] text-white rounded-full flex items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Shortcuts: Reporters Directory, Video News & Live TV */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href={`/${lang}/reporters`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:text-[#ea580c] text-slate-800 dark:text-slate-200 transition border border-slate-200 dark:border-slate-700"
            >
              <Users className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Reporters</span>
            </Link>

            <Link
              href={`/${lang}/video`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
            >
              <Video className="w-3.5 h-3.5 text-red-600" />
              <span>{dict.videoNews}</span>
            </Link>

            <Link
              href={`/${lang}/live-tv`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm transition"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping mr-0.5" />
              <Tv className="w-3.5 h-3.5" />
              <span>{dict.liveTv}</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Open Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Category Navigation Bar (Deep Navy with Saffron & Green Highlights) */}
      <nav className="bg-[#0b2545] text-white shadow-md overflow-x-auto scrollbar-none hidden lg:block border-t-2 border-[#ea580c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1 font-medium text-xs sm:text-sm">
            {navItems.map((cat) => {
              const href = cat.slug === "" ? `/${lang}` : `/${lang}/${cat.slug}`;
              const isActive = cat.slug === "" ? pathname === `/${lang}` : pathname.startsWith(`/${lang}/${cat.slug}`);

              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`px-3 py-2.5 transition whitespace-nowrap uppercase tracking-wider text-xs font-bold ${
                    isActive
                      ? "bg-[#ea580c] text-white shadow-inner"
                      : "hover:bg-white/10 text-slate-200 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}

            <Link
              href={`/${lang}/reporters`}
              className={`px-3 py-2.5 transition whitespace-nowrap uppercase tracking-wider text-xs font-bold ${
                pathname.includes("/reporters")
                  ? "bg-[#ea580c] text-white shadow-inner"
                  : "hover:bg-white/10 text-orange-300 hover:text-white"
              }`}
            >
              Reporters
            </Link>
          </div>

          <div className="flex items-center space-x-2 py-1">
            <Link
              href={`/${lang}/reporter-signup`}
              className="px-3 py-1.5 bg-[#15803d] hover:bg-[#166534] text-white font-black tracking-wider uppercase text-xs rounded shadow flex items-center space-x-1 transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Join as Reporter</span>
            </Link>

            <Link
              href={`/${lang}/submit-news`}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold tracking-wider uppercase text-xs rounded shadow flex items-center space-x-1 transition"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>{dict.submitNews}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex relative w-full">
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#ea580c] text-white rounded-lg flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {navItems.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "" ? `/${lang}` : `/${lang}/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-gray-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href={`/${lang}/reporters`}
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded bg-orange-50 dark:bg-slate-800 text-orange-700 dark:text-orange-400 font-bold flex items-center space-x-1"
            >
              <Users className="w-4 h-4" />
              <span>Reporters</span>
            </Link>
            <Link
              href={`/${lang}/reporter-signup`}
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-bold flex items-center space-x-1"
            >
              <UserCheck className="w-4 h-4" />
              <span>Join as Reporter</span>
            </Link>
            <Link
              href={`/${lang}/video`}
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium flex items-center space-x-1"
            >
              <Video className="w-4 h-4 text-red-600" />
              <span>{dict.videoNews}</span>
            </Link>
            <Link
              href={`/${lang}/live-tv`}
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded bg-[#ea580c] text-white font-bold flex items-center space-x-1"
            >
              <Tv className="w-4 h-4" />
              <span>{dict.liveTv}</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              href={`/${lang}/submit-news`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center"
            >
              <FilePlus className="w-4 h-4 mr-1" />
              {dict.submitNews}
            </Link>
            {user && ["ADMIN", "EDITOR"].includes(user.role) && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400"
              >
                {dict.adminDashboard}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
