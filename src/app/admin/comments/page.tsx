import React from "react";
import { prisma } from "@/lib/prisma";
import { MessageSquare, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      article: { select: { title: true, slug: true, category: { select: { slug: true } } } },
      reports: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Comment Moderation Desk
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review reader discussions, triage reported content, and uphold civil discourse standards.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {comment.user.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({comment.user.email})
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-400">
                  {formatTimeAgo(comment.createdAt)}
                </span>

                {comment.status === "FLAGGED" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    FLAGGED ({comment.reports.length} reports)
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-gray-50 dark:bg-slate-800/60 p-2.5 rounded border border-gray-100 dark:border-slate-800">
                "{comment.content}"
              </p>

              <p className="text-[11px] text-slate-400">
                On story: <b className="text-slate-700 dark:text-slate-300">{comment.article.title}</b>
              </p>

              {comment.reports.length > 0 && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium pt-1">
                  Reported reason: {comment.reports.map((r) => r.reason).join(", ")}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 shrink-0 sm:self-center">
              <span className="text-[10px] font-bold text-slate-400">
                {comment.likesCount} likes
              </span>
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {comment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
