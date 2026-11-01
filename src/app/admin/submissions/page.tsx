"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Eye,
  User,
  MapPin,
  ExternalLink,
  Sparkles,
  Radio,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

interface Submission {
  id: string;
  headline: string;
  summary: string;
  content: string;
  categoryId: string;
  category: { id: string; name: string; slug: string; color?: string | null };
  contributor: {
    id: string;
    name: string;
    email: string;
    role: string;
    location?: string | null;
  };
  language: string;
  location?: string | null;
  state?: string | null;
  district?: string | null;
  sourceAttribution?: string | null;
  featuredImage?: string | null;
  videoUrl?: string | null;
  externalVideoUrl?: string | null;
  videoProofPlatform?: string | null;
  videoProofTitle?: string | null;
  status: string;
  editorialNotes?: string | null;
  publishedArticleId?: string | null;
  publishedArticleSlug?: string | null;
  createdAt: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [editorialNotes, setEditorialNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [approvedResult, setApprovedResult] = useState<{
    headline: string;
    liveUrl: string;
  } | null>(null);

  const loadSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleReviewAction = async (action: "APPROVE" | "REJECT" | "RETURN_FOR_REVISION") => {
    if (!selectedSub) return;
    setProcessing(true);

    try {
      const res = await fetch(`/api/admin/submissions/${selectedSub.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, editorialNotes }),
      });

      const data = await res.json();
      if (res.ok) {
        if (action === "APPROVE" && data.liveUrl) {
          setApprovedResult({
            headline: selectedSub.headline,
            liveUrl: data.liveUrl,
          });
        }
        setSelectedSub(null);
        setEditorialNotes("");
        loadSubmissions();
      } else {
        alert(data.error || "Review operation failed");
      }
    } catch {
      alert("Network error processing review");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Editorial Gatekeeper &amp; Bureau Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Submission Review Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate filed stories from bureau reporters and citizen contributors. Once approved, stories are instantly syndicated live across the digital news portal.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300">
            Total Filed Stories: {submissions.length}
          </span>
        </div>
      </div>

      {/* Live Approval Celebration Banner */}
      {approvedResult && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-wide">
                Story Approved &amp; Published Live!
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5 line-clamp-1">
                "{approvedResult.headline}" is now live on the homepage and category feed.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href={approvedResult.liveUrl}
              target="_blank"
              className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black uppercase tracking-wider rounded-xl transition shadow flex items-center space-x-1.5"
            >
              <span>View Live on Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setApprovedResult(null)}
              className="text-emerald-200 hover:text-white p-2 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Submissions List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading incoming submissions...</div>
        ) : submissions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-slate-800">
            {submissions.map((sub) => {
              const liveUrl = sub.publishedArticleSlug
                ? `/${sub.language || "en"}/${sub.category.slug}/${sub.publishedArticleSlug}`
                : null;

              return (
                <div
                  key={sub.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="space-y-2 flex-1">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: sub.category.color || "#dc2626" }}
                      >
                        {sub.category.name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        Language: <span className="uppercase text-slate-800 dark:text-white">{sub.language}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • Filed on {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-extrabold text-base sm:text-lg text-slate-950 dark:text-white leading-snug">
                      {sub.headline}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {sub.summary}
                    </p>

                    {/* Contributor & Location Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center space-x-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Filed by:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {sub.contributor?.name}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          sub.contributor?.role === "REPORTER"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}>
                          {sub.contributor?.role}
                        </span>
                      </div>

                      {sub.location && (
                        <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="font-medium text-[11px]">{sub.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-slate-800">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        sub.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : sub.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse"
                      }`}
                    >
                      {sub.status.replace(/_/g, " ")}
                    </span>

                    <div className="flex items-center space-x-2">
                      {liveUrl && (
                        <Link
                          href={liveUrl}
                          target="_blank"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                        >
                          <span>Live Story</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setEditorialNotes(sub.editorialNotes || "");
                        }}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review Desk</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-slate-500">
            No filed stories in the review queue. All reporter submissions are up to date!
          </div>
        )}
      </div>

      {/* Review Modal Dialog */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-red-600" />
                <span className="text-xs font-black uppercase tracking-wider text-red-600">
                  Editorial Verification Desk
                </span>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Reporter Profile Pill */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                  {selectedSub.contributor?.name[0]}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {selectedSub.contributor?.name} ({selectedSub.contributor?.email})
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Role: {selectedSub.contributor?.role}
                  </span>
                </div>
              </div>

              {selectedSub.location && (
                <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-200 font-medium">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Dateline: <b>{selectedSub.location}</b></span>
                </div>
              )}
            </div>

            {/* Headline & Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold uppercase text-[10px]">
                  {selectedSub.category.name}
                </span>
                <span className="text-slate-400">Language: <b className="uppercase">{selectedSub.language}</b></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                {selectedSub.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-red-600 pl-3">
                {selectedSub.summary}
              </p>
            </div>

            {/* Media Asset Preview */}
            {selectedSub.featuredImage && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                {selectedSub.videoUrl ? (
                  <video
                    src={selectedSub.videoUrl}
                    poster={selectedSub.featuredImage}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedSub.featuredImage}
                    alt="Filed submission photo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* External Video Proof Block (Times Now Style Verification) */}
            {selectedSub.externalVideoUrl && (
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>External Video Proof: {selectedSub.videoProofTitle || "Ground Footage Evidence"}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                    {selectedSub.videoProofPlatform || "Social Media"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate max-w-sm">
                    {selectedSub.externalVideoUrl}
                  </span>
                  <a
                    href={selectedSub.externalVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shrink-0 shadow-sm"
                  >
                    <span>Verify Footage on {selectedSub.videoProofPlatform || "Platform"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Full Story Content */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Article Body
              </label>
              <div className="p-4 bg-gray-50 dark:bg-slate-800/80 rounded-xl text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-serif max-h-64 overflow-y-auto space-y-3 border border-gray-200 dark:border-slate-700">
                {selectedSub.content.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Source Attribution */}
            {selectedSub.sourceAttribution && (
              <p className="text-xs text-slate-500">
                <b>Sources &amp; Field Attribution:</b> {selectedSub.sourceAttribution}
              </p>
            )}

            {/* Editorial Notes Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                Editorial Feedback Notes (Published to Reporter Audit History)
              </label>
              <textarea
                rows={2}
                placeholder="Approved for publishing, or state required corrections..."
                value={editorialNotes}
                onChange={(e) => setEditorialNotes(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
              >
                Close Desk
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleReviewAction("REJECT")}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Report</span>
                </button>

                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleReviewAction("RETURN_FOR_REVISION")}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Revision</span>
                </button>

                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleReviewAction("APPROVE")}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center space-x-2 shadow-lg disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{processing ? "Publishing Live..." : "Approve & Make Live on Website"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
