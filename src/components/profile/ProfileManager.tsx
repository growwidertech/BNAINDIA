"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  MapPin,
  Shield,
  FileText,
  MessageSquare,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Clock,
} from "lucide-react";
import { useAuth } from "@/components/common/AuthProvider";

interface ProfileSubmission {
  id: string;
  headline: string;
  status: string;
  createdAt: string;
  category: {
    name: string;
  };
}

interface ProfileComment {
  id: string;
  content: string;
  createdAt: string;
  article: {
    title: string;
    slug: string;
    category: {
      slug: string;
    };
  };
}

interface ProfileManagerProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    location?: string | null;
    bio?: string | null;
  };
  submissions: ProfileSubmission[];
  comments: ProfileComment[];
  lang: string;
}

export function ProfileManager({
  initialUser,
  submissions,
  comments,
  lang,
}: ProfileManagerProps) {
  const { refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [location, setLocation] = useState(initialUser.location || "");
  const [bio, setBio] = useState(initialUser.bio || "");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          location: location.trim(),
          bio: bio.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile information.");
      }

      setSuccessMsg("Contact Name and Email ID updated successfully!");
      setIsEditing(false);
      // Refresh AuthProvider so header immediately updates
      await refreshUser();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 font-sans px-4">
      {/* 1. Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative overflow-hidden">
        {/* Top saffron accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ea580c] via-white to-[#15803d]" />

        {/* User Avatar Initial */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0b2545] to-[#ea580c] text-white flex items-center justify-center font-black text-3xl shadow-lg shrink-0">
          {name[0]?.toUpperCase() || "U"}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {name}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Accredited Member ID: <span className="font-mono text-slate-700 dark:text-slate-300">#{initialUser.id.slice(0, 8)}</span>
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-[#ea580c] dark:bg-orange-950/60 dark:text-orange-300">
                {initialUser.role}
              </span>

              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setSuccessMsg("");
                  setErrorMsg("");
                }}
                className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-1 transition"
              >
                {isEditing ? (
                  <>
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center font-medium">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-[#ea580c]" />
              {email}
            </span>
            {location && (
              <span className="flex items-center font-medium">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#15803d]" />
                {location}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
            {bio || "Active reader & verified news contributor at BNA News (Bharat News Agency)."}
          </p>

          {["ADMIN", "EDITOR"].includes(initialUser.role) && (
            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0b2545] hover:bg-[#103058] text-white rounded-xl text-xs font-bold transition shadow"
              >
                <Shield className="w-4 h-4 text-[#ea580c]" />
                <span>Open CMS Admin Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      {/* 2. Edit Login Details Form Card */}
      {isEditing && (
        <form
          onSubmit={handleUpdateProfile}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-[#ea580c] shadow-lg space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-[#ea580c]" />
                <span>Change Contact Name & Login Email ID</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your login credentials and personal information. Changes apply immediately across all sessions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Field 1: Contact Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Contact Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none font-medium"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                This name appears on your authored articles, reports, and comments.
              </span>
            </div>

            {/* Field 2: Login Email ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Login Email ID *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none font-medium"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Your primary login ID and destination for news notifications.
              </span>
            </div>

            {/* Field 3: Location / District */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Location / District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. New Delhi, Mumbai, Lucknow"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                />
              </div>
            </div>

            {/* Field 4: Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Short Bio / Reporter Desk
              </label>
              <input
                type="text"
                placeholder="Brief summary of your beat or interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Login Information</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 3. Submissions Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#ea580c]" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-tight">
              My News Submissions ({submissions.length})
            </h2>
          </div>
          <Link
            href={`/${lang}/submit-news`}
            className="text-xs text-[#ea580c] font-bold hover:underline"
          >
            + Submit New Story
          </Link>
        </div>

        {submissions.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {submissions.map((sub) => (
              <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white sm:text-sm">
                    {sub.headline}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Category: {sub.category.name} • {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    sub.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : sub.status === "REJECTED"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {sub.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            <p>You have not submitted any citizen news stories yet.</p>
            <Link
              href={`/${lang}/submit-news`}
              className="inline-block mt-2 text-xs font-bold text-[#ea580c] hover:underline"
            >
              Start contributing news reports →
            </Link>
          </div>
        )}
      </div>

      {/* 4. Recent Comments Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 dark:border-slate-800">
          <MessageSquare className="w-4 h-4 text-[#15803d]" />
          <h2 className="font-bold text-base text-slate-900 dark:text-white uppercase tracking-tight">
            Recent Reader Comments & Discussions
          </h2>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[70%]">
                    Story: {c.article.title}
                  </span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{c.content}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            You haven't posted any comments yet. Join the conversation on any story!
          </p>
        )}
      </div>
    </div>
  );
}
