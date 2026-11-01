"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  MapPin,
  GraduationCap,
  Globe,
  Mail,
  Search,
  ShieldCheck,
  UserPlus,
  Filter,
  CheckCircle,
  X,
  Compass,
} from "lucide-react";
import { getDictionary } from "@/lib/languages";
import {
  INDIAN_STATES_DISTRICTS,
  POPULAR_DISTRICT_FILTERS,
  getAllStates,
  getDistrictsForState,
} from "@/lib/districts";

interface Reporter {
  id: string;
  name: string;
  email: string;
  // phone number removed to protect reporter privacy
  district?: string | null;
  state?: string | null;
  location: string;
  qualification: string;
  language: string;
  beat?: string | null;
  photoUrl?: string | null;
  isVerified: boolean;
  createdAt: string;
}

export default function ReportersDirectoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All Districts");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const allStates = ["All States", ...getAllStates()];

  // Districts available based on selected state
  const availableDistricts =
    selectedState === "All States"
      ? ["All Districts", ...POPULAR_DISTRICT_FILTERS.filter(d => d !== "All Districts")]
      : ["All Districts", ...getDistrictsForState(selectedState)];

  const fetchReporters = async (dist?: string, st?: string, query?: string) => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (dist && dist !== "All Districts") p.append("district", dist);
      if (st && st !== "All States") p.append("state", st);
      if (query && query.trim()) p.append("search", query.trim());

      const res = await fetch(`/api/reporters?${p.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReporters(data.reporters || []);
      }
    } catch (err) {
      console.error("Failed to load reporters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReporters(selectedDistrict, selectedState, searchQuery);
  }, [selectedDistrict, selectedState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReporters(selectedDistrict, selectedState, searchQuery);
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict("All Districts");
  };

  const handleResetFilters = () => {
    setSelectedState("All States");
    setSelectedDistrict("All Districts");
    setSearchQuery("");
    fetchReporters("All Districts", "All States", "");
  };

  const isFiltered =
    selectedState !== "All States" || selectedDistrict !== "All Districts" || searchQuery.trim() !== "";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b2545] via-[#103058] to-[#0b2545] text-white p-6 sm:p-10 shadow-xl border-t-4 border-[#ea580c]">
        {/* Tricolor accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#ea580c]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#15803d]" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4 text-orange-400" />
              <span>District & Bureau Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              BNA District Journalists & Reporters Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Find accredited correspondents and field journalists representing <b>BNA News (Bharat News Agency: True Democracy Voice)</b> filtered district-wise across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href={`/${lang}/reporter-signup`}
              className="px-5 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center space-x-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Join as New Reporter</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Interactive District & State Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search, State & District Filters */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by journalist name, beat, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
            />
          </div>

          {/* State Filter */}
          <div className="md:col-span-3 relative">
            <Compass className="w-4 h-4 text-[#ea580c] absolute left-3 top-3.5 pointer-events-none" />
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
            >
              {allStates.map((st) => (
                <option key={st} value={st}>
                  {st === "All States" ? "🏛️ All States" : st}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-[#15803d] absolute left-3 top-3.5 pointer-events-none" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#15803d]"
            >
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist === "All Districts" ? "📍 All Districts" : `📍 ${dist}`}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Submit Button */}
          <div className="md:col-span-1 flex">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0b2545] hover:bg-[#103058] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Popular District Quick-Pill Badges */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold flex items-center shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Districts:
          </span>
          {POPULAR_DISTRICT_FILTERS.map((dist) => {
            const isSelected = selectedDistrict === dist;
            return (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition shrink-0 ${
                  isSelected
                    ? "bg-[#ea580c] text-white shadow-sm font-bold"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                }`}
              >
                {dist}
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicators */}
        {isFiltered && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {selectedState !== "All States" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900">
                State: {selectedState}
                <button onClick={() => setSelectedState("All States")} className="ml-1 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDistrict !== "All Districts" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-900">
                District: {selectedDistrict}
                <button onClick={() => setSelectedDistrict("All Districts")} className="ml-1 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[#ea580c] font-bold hover:underline ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* 3. Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <div>
          Showing{" "}
          <span className="font-bold text-slate-900 dark:text-white">{reporters.length}</span>{" "}
          accredited journalists{" "}
          {selectedDistrict !== "All Districts"
            ? `in District: ${selectedDistrict}`
            : selectedState !== "All States"
            ? `in State: ${selectedState}`
            : "nationwide"}
        </div>
        <Link
          href={`/${lang}/reporter-signup`}
          className="text-[#ea580c] font-bold hover:underline hidden sm:inline"
        >
          + Submit Your Reporter Application
        </Link>
      </div>

      {/* 4. Reporter Cards Grid (Phone numbers removed) */}
      {loading ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading district correspondents...</p>
        </div>
      ) : reporters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reporters.map((reporter) => (
            <div
              key={reporter.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Profile Top Row */}
              <div className="flex items-start space-x-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-[#ea580c] shadow">
                    <img
                      src={
                        reporter.photoUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                      }
                      alt={reporter.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {reporter.isVerified && (
                    <span
                      title="BNA Accredited Press"
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#15803d] text-white rounded-full flex items-center justify-center text-[10px] shadow"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-950 dark:text-white truncate">
                    {reporter.name}
                  </h3>

                  {/* District & State Location Badges */}
                  <div className="inline-flex items-center space-x-1 text-[11px] text-[#ea580c] font-black uppercase tracking-wider mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {reporter.district || reporter.location.split(",")[0]}
                      {reporter.state ? ` (${reporter.state})` : ""}
                    </span>
                  </div>

                  <span className="block text-[10px] font-bold text-[#15803d] uppercase tracking-wider mt-0.5">
                    ● BNA Press Bureau
                  </span>
                </div>
              </div>

              {/* Details & Beat */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-start space-x-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] font-medium leading-snug line-clamp-2">
                    {reporter.qualification}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {reporter.language}
                  </span>
                </div>

                {reporter.beat && (
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[11px] text-orange-950 dark:text-orange-200">
                    <span className="font-bold">Beat:</span> {reporter.beat}
                  </div>
                )}
              </div>

              {/* Official Bureau Contact (Phone number removed for privacy) */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
                  <span className="text-[11px] font-semibold">Accredited Bureau</span>
                </div>

                <a
                  href={`mailto:${reporter.email}?subject=Story Lead / Bureau Inquiry for ${reporter.name}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#ea580c] hover:text-white text-slate-700 dark:text-slate-200 font-bold transition flex items-center space-x-1.5"
                  title="Contact verified correspondent via accredited email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Bureau</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-3">
          <p className="text-slate-500 text-sm">
            No accredited journalists found for the selected district or state.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
