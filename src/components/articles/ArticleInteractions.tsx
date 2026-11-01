"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Type,
  Check,
  Copy,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/components/common/AuthProvider";
import { useTheme } from "@/components/common/ThemeProvider";

interface ArticleInteractionsProps {
  articleId: string;
  initialLikes: number;
  title: string;
  url: string;
  content: string;
}

export function ArticleInteractions({
  articleId,
  initialLikes,
  title,
  url,
  content,
}: ArticleInteractionsProps) {
  const { user } = useAuth();
  const { fontSize, increaseFontSize, decreaseFontSize } = useTheme();

  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check initial like/bookmark state
  useEffect(() => {
    if (!user) return;
    fetch(`/api/articles/${articleId}/user-status`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setHasLiked(data.hasLiked);
          setIsBookmarked(data.isBookmarked);
        }
      })
      .catch(() => {});
  }, [user, articleId]);

  const toggleLike = async () => {
    if (!user) {
      alert("Please sign in to like articles.");
      return;
    }
    const nextState = !hasLiked;
    setHasLiked(nextState);
    setLikes((prev) => (nextState ? prev + 1 : prev - 1));

    try {
      await fetch(`/api/articles/${articleId}/like`, { method: "POST" });
    } catch {
      // rollback
      setHasLiked(!nextState);
      setLikes((prev) => (!nextState ? prev + 1 : prev - 1));
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      alert("Please sign in to save stories.");
      return;
    }
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      await fetch(`/api/articles/${articleId}/bookmark`, { method: "POST" });
    } catch {
      setIsBookmarked(!nextState);
    }
  };

  // Text to speech
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(`${title}. ${content.slice(0, 1000)}`);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between py-3 my-4 border-y border-gray-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
      {/* Left Action Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Like */}
        <button
          onClick={toggleLike}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition ${
            hasLiked
              ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-400 font-bold"
              : "border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-600" : ""}`} />
          <span>{likes}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={toggleBookmark}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition ${
            isBookmarked
              ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-400 font-bold"
              : "border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600" : ""}`} />
          <span>{isBookmarked ? "Saved" : "Save"}</span>
        </button>

        {/* Listen / TTS */}
        <button
          onClick={toggleSpeech}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition ${
            isSpeaking
              ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-300 font-bold animate-pulse"
              : "border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
          }`}
          title="Listen to this article"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          <span>{isSpeaking ? "Pause Audio" : "Listen"}</span>
        </button>

        {/* Share */}
        <button
          onClick={() => setShareModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Right Font Size Controls */}
      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
        <span className="text-[11px] text-slate-400 font-medium">Font size:</span>
        <button
          onClick={decreaseFontSize}
          className="px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold"
          title="Decrease font size"
        >
          A-
        </button>
        <button
          onClick={increaseFontSize}
          className="px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold"
          title="Increase font size"
        >
          A+
        </button>
      </div>

      {/* Share Modal Dialog */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Share this story
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate">{title}</p>

            <div className="flex items-center space-x-2 p-2 rounded bg-gray-100 dark:bg-slate-800 mb-4">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="w-full bg-transparent text-xs text-slate-700 dark:text-slate-300 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-semibold shrink-0 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:opacity-90"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:opacity-90"
              >
                X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:opacity-90"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:opacity-90"
              >
                LinkedIn
              </a>
            </div>

            <button
              onClick={() => setShareModalOpen(false)}
              className="mt-6 w-full py-2 bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
