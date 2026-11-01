"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, CornerDownRight, Flag, Send } from "lucide-react";
import { useAuth } from "@/components/common/AuthProvider";
import { formatTimeAgo } from "@/lib/utils";
import { getDictionary } from "@/lib/languages";

interface CommentItem {
  id: string;
  content: string;
  likesCount: number;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    role: string;
  };
  replies?: CommentItem[];
}

interface ArticleCommentsProps {
  articleId: string;
  initialComments: CommentItem[];
  lang: string;
}

export function ArticleComments({ articleId, initialComments, lang }: ArticleCommentsProps) {
  const { user } = useAuth();
  const dict = getDictionary(lang);

  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reportModalCommentId, setReportModalCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to post a comment.");
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (res.ok) {
        const created = await res.json();
        setComments([created, ...comments]);
        setNewComment("");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to post comment");
      }
    } catch {
      alert("Network error posting comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!user) {
      alert("Please sign in to reply.");
      return;
    }
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim(), parentId }),
      });

      if (res.ok) {
        const created = await res.json();
        setComments(
          comments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), created],
              };
            }
            return c;
          })
        );
        setReplyToId(null);
        setReplyText("");
      }
    } catch {
      alert("Error posting reply");
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      alert("Please sign in to like comments.");
      return;
    }

    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, likesCount: c.likesCount + 1 };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, likesCount: r.likesCount + 1 } : r
            ),
          };
        }
        return c;
      })
    );

    await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
  };

  const handleReportComment = async () => {
    if (!reportModalCommentId || !reportReason.trim()) return;
    try {
      await fetch(`/api/comments/${reportModalCommentId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason.trim() }),
      });
      alert("Thank you. The editorial team has been notified.");
      setReportModalCommentId(null);
      setReportReason("");
    } catch {
      alert("Error reporting comment");
    }
  };

  return (
    <section className="my-10 pt-8 border-t border-gray-200 dark:border-slate-800">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-5 h-5 text-red-600" />
        <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
          {dict.comments} ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* Post Comment Box */}
      {user ? (
        <form onSubmit={handlePostComment} className="mb-8 space-y-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Commenting as</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
          </div>
          <textarea
            rows={3}
            placeholder={dict.writeComment}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900"
            required
          />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400">
              Please adhere to Antigravity News Community Guidelines. Be respectful.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Posting..." : dict.postComment}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-lg border border-gray-200 dark:border-slate-700 text-center mb-8">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Sign in to join the conversation and reply to reader comments.
          </p>
          <div className="mt-2 space-x-3">
            <Link
              href={`/${lang}/auth/signin`}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold inline-block"
            >
              {dict.signIn}
            </Link>
            <Link
              href={`/${lang}/auth/signup`}
              className="px-4 py-1.5 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-semibold inline-block"
            >
              {dict.signUp}
            </Link>
          </div>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  {comment.user.name[0]}
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {comment.user.name}
                  </span>
                  {comment.user.role !== "READER" && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {comment.user.role}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 ml-2">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
              </div>

              {/* Report button */}
              <button
                onClick={() => setReportModalCommentId(comment.id)}
                className="text-[11px] text-slate-400 hover:text-red-500 flex items-center space-x-1"
                title="Report inappropriate comment"
              >
                <Flag className="w-3 h-3" />
                <span>Report</span>
              </button>
            </div>

            {/* Comment Body */}
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {comment.content}
            </p>

            {/* Actions: Like & Reply */}
            <div className="flex items-center space-x-4 pt-1 text-xs text-slate-500">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center space-x-1 hover:text-red-600"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{comment.likesCount}</span>
              </button>
              <button
                onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 hover:text-blue-600 font-medium"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>{dict.reply}</span>
              </button>
            </div>

            {/* Reply Input Box */}
            {replyToId === comment.id && (
              <div className="mt-3 pl-4 border-l-2 border-red-500 space-y-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setReplyToId(null)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePostReply(comment.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}

            {/* Threaded Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-slate-800 space-y-3 pt-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {reply.user.name}
                        </span>
                        {reply.user.role !== "READER" && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {reply.user.role}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {formatTimeAgo(reply.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleLikeComment(reply.id)}
                        className="flex items-center space-x-1 text-slate-400 hover:text-red-500"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{reply.likesCount}</span>
                      </button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Modal Dialog */}
      {reportModalCommentId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Report Inappropriate Comment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select reason for reporting this comment to editorial moderators:
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2 text-xs rounded border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-4"
            >
              <option value="">Select violation...</option>
              <option value="Hate speech or harassment">Hate speech or harassment</option>
              <option value="Misinformation / False news">Misinformation / False news</option>
              <option value="Spam or promotional link">Spam or promotional link</option>
              <option value="Abusive or profane language">Abusive or profane language</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setReportModalCommentId(null)}
                className="px-3 py-1.5 text-xs text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleReportComment}
                disabled={!reportReason}
                className="px-4 py-1.5 bg-red-600 text-white rounded text-xs font-bold disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
