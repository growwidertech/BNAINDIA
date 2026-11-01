"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FilePlus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  MapPin,
  Radio,
  ExternalLink,
  Sparkles,
  Camera,
  Video,
  Eye,
} from "lucide-react";
import { useAuth } from "@/components/common/AuthProvider";
import { SUPPORTED_LANGUAGES, getDictionary } from "@/lib/languages";
import { INDIAN_STATES_DATA } from "@/lib/districts";
import { detectVideoProofPlatform } from "@/lib/videoProof";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SubmissionItem {
  id: string;
  headline: string;
  status: string;
  createdAt: string;
  language: string;
  location?: string | null;
  category: { name: string; slug: string };
  editorialNotes?: string | null;
  publishedArticleSlug?: string | null;
}

export default function SubmitNewsPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const dict = getDictionary(params.lang);

  const [categories, setCategories] = useState<Category[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Location States
  const [selectedState, setSelectedState] = useState("Delhi (NCT)");
  const [availableDistricts, setAvailableDistricts] = useState<string[]>(
    INDIAN_STATES_DATA.find((s) => s.state === "Delhi (NCT)")?.districts || []
  );

  const [formData, setFormData] = useState({
    headline: "",
    summary: "",
    content: "",
    categoryId: "",
    language: params.lang || "en",
    state: "Delhi (NCT)",
    district: "New Delhi",
    location: "",
    sourceAttribution: "",
    featuredImage: "",
    videoUrl: "",
    externalVideoUrl: "",
    videoProofPlatform: "OTHER",
    videoProofTitle: "",
    tags: "",
    declarationSigned: false,
  });

  // Update districts when state changes
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateObj = INDIAN_STATES_DATA.find((s) => s.state === stateName);
    const districts = stateObj ? stateObj.districts : [];
    setAvailableDistricts(districts);
    setFormData((prev) => ({
      ...prev,
      state: stateName,
      district: districts[0] || "",
    }));
  };

  useEffect(() => {
    // 1. Fetch live categories from database
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories?.length) {
          setCategories(data.categories);
          if (!formData.categoryId) {
            setFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      })
      .catch(() => {});

    // 2. Load user's previous submissions if logged in
    if (user) {
      fetch("/api/submissions")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setSubmissions(data))
        .catch(() => {});
    }
  }, [user]);

  // Handle local image upload via /api/upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "featuredImage" | "videoUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      } else {
        const err = await res.json();
        alert(err.error || "File upload failed");
      }
    } catch {
      alert("Network error during upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!user) {
      setErrorMsg("Please sign in with your reporter or reader account to file news.");
      return;
    }

    if (!formData.declarationSigned) {
      setErrorMsg("You must confirm that this is original reporting and does not infringe copyright.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const created = await res.json();
        setSuccessMsg(
          "News report filed successfully! It is now with the Editorial Review Desk. Once approved by the editor, it will be published live across the website."
        );
        setSubmissions([created, ...submissions]);
        setFormData({
          headline: "",
          summary: "",
          content: "",
          categoryId: categories[0]?.id || "",
          language: params.lang || "en",
          state: selectedState,
          district: availableDistricts[0] || "",
          location: "",
          sourceAttribution: "",
          featuredImage: "",
          videoUrl: "",
          externalVideoUrl: "",
          videoProofPlatform: "OTHER",
          videoProofTitle: "",
          tags: "",
          declarationSigned: false,
        });
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to submit article");
      }
    } catch {
      setErrorMsg("Network error submitting story");
    } finally {
      setSubmitting(false);
    }
  };

  const isReporter = user?.role === "REPORTER" || user?.role === "EDITOR" || user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-700 via-rose-800 to-red-950 text-white shadow-xl">
        <div className="flex items-center space-x-2 text-red-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Antigravity News Agency • Bureau Reporting Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          File Ground News Report
        </h1>
        <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl leading-relaxed">
          Reporters and verified contributors file ground stories based on district and state locations. Once reviewed and approved by the Editorial Desk, articles go live instantly across the portal.
        </p>

        {/* Reporter Active Session Pill */}
        {user && (
          <div className="mt-4 pt-4 border-t border-red-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold">
                Logged in as: <span className="text-white underline">{user.name}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-900 text-red-200 border border-red-400/40">
                {user.role}
              </span>
            </div>
            {isReporter && (
              <span className="text-[11px] text-red-200 bg-red-900/60 px-3 py-1 rounded-full font-semibold">
                🎙️ Fast-Track Editorial Verification Enabled
              </span>
            )}
          </div>
        )}
      </div>

      {/* Auth Guard Banner if not signed in */}
      {!authLoading && !user && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>You need to be signed in to submit news reports and track your editorial approvals.</span>
          </div>
          <Link
            href={`/${params.lang}/auth/signin?redirect=/${params.lang}/submit-news`}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shrink-0 transition text-center shadow"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {/* Feedback Messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6"
      >
        <div className="space-y-5">
          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
              Story Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Rail Extension Inaugurated in East Bengaluru by State Leadership"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full p-3 text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Short Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
              Executive Summary / Lead Deck *
            </label>
            <input
              type="text"
              required
              placeholder="A concise 1-2 sentence overview highlighting key facts and implications..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full p-3 text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Location Selection: State & District Cascading Dropdowns */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Reporter Ground Location Details (State &amp; District Wise)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* State Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">
                  State / Union Territory *
                </label>
                <select
                  required
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  {INDIAN_STATES_DATA.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">
                  District *
                </label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Dateline / Spot */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">
                  Dateline / Spot Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Connaught Place, Vidhana Soudha, High Court"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category & Language Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                Beat / Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="india">India</option>
                    <option value="world">World</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="science">Science</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                Publishing Language *
              </label>
              <select
                required
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Story Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
              Full News Report Content *
            </label>
            <textarea
              required
              rows={8}
              placeholder="Enter the detailed news report. Include ground observations, verified eyewitness quotes, official press briefings, and context..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-3 text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none font-serif"
            />
          </div>

          {/* Media Attachments: Featured Image & Video URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide flex items-center space-x-1">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>Featured Image (URL or Upload)</span>
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "featuredImage")}
                    />
                  </label>
                  {uploadingImage && <span className="text-[10px] text-slate-400">Uploading...</span>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide flex items-center space-x-1">
                <Video className="w-3.5 h-3.5 text-slate-500" />
                <span>Video Clip URL (MP4 / WebM)</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/video.mp4"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Optional: playable video will automatically activate the interactive player on the live article page.
              </p>
            </div>
          </div>

          {/* External Video Proof & Social Media Link (Times Now Style) */}
          <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>External Video Proof &amp; Social Media Source Link (Times Now Feature)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                YouTube • X (Twitter) • Instagram • Facebook
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Link external social media broadcasts or wire video footage as verified source proof. Readers will be able to play the video or click through directly to the publisher's broadcast on the external platform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* URL */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  External Video Proof URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... or https://x.com/... or https://instagram.com/reel/..."
                  value={formData.externalVideoUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    const detected = detectVideoProofPlatform(url);
                    setFormData((prev) => ({
                      ...prev,
                      externalVideoUrl: url,
                      videoProofPlatform: detected !== "OTHER" ? detected : prev.videoProofPlatform,
                    }));
                  }}
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono"
                />
              </div>

              {/* Platform Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                  Platform / Source
                </label>
                <select
                  value={formData.videoProofPlatform}
                  onChange={(e) => setFormData({ ...formData, videoProofPlatform: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="TWITTER_X">X (Twitter)</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="FACEBOOK">Facebook Video</option>
                  <option value="OTHER">Other External Media Site</option>
                </select>
              </div>
            </div>

            {/* Proof Title / Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">
                Video Proof Context / Caption
              </label>
              <input
                type="text"
                placeholder="e.g. Eyewitness cell phone video recording the breakthrough event"
                value={formData.videoProofTitle}
                onChange={(e) => setFormData({ ...formData, videoProofTitle: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Source Attribution & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                Source Attribution / Witnesses
              </label>
              <input
                type="text"
                placeholder="e.g. Ground eyewitness interview, Press Release, PTI"
                value={formData.sourceAttribution}
                onChange={(e) => setFormData({ ...formData, sourceAttribution: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                Tags / Keywords (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Infrastructure, Transport, Bengaluru, Metro"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 flex items-start space-x-3">
            <input
              type="checkbox"
              id="declaration"
              required
              checked={formData.declarationSigned}
              onChange={(e) => setFormData({ ...formData, declarationSigned: e.target.checked })}
              className="mt-1 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label htmlFor="declaration" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Journalistic Integrity Declaration:</strong> I confirm this news report reflects factual ground reporting conducted without copyright infringement, fabricated claims, or defamation. I understand it will be scrutinized by the editorial board prior to live syndication.
            </label>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={submitting || !user}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <FilePlus className="w-4 h-4" />
            <span>{submitting ? "Filing News Report..." : "Submit to Editorial Review Desk"}</span>
          </button>
        </div>
      </form>

      {/* Reporter Submission History & Live Status */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
            My Filed News Reports &amp; Live Status
          </h2>
          <span className="text-xs text-slate-400">Total filed: {submissions.length}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {submissions.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-slate-800">
              {submissions.map((item) => {
                const liveUrl = item.publishedArticleSlug
                  ? `/${item.language || "en"}/${item.category.slug}/${item.publishedArticleSlug}`
                  : null;

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.category?.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {item.location && (
                          <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-red-500" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.headline}
                      </h3>
                      {item.editorialNotes && (
                        <p className="text-xs text-slate-500 italic">
                          Editorial Feedback: "{item.editorialNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : item.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse"
                        }`}
                      >
                        {item.status.replace(/_/g, " ")}
                      </span>

                      {liveUrl && (
                        <Link
                          href={liveUrl}
                          target="_blank"
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                        >
                          <span>View Live on Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              You haven't filed any news reports yet. Use the form above to file your first report!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
