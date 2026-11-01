import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  Clock,
  Inbox,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalPublished,
    totalDrafts,
    pendingSubmissions,
    flaggedComments,
    totalUsers,
    totalViewsAgg,
    mostReadStories,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.submission.count({ where: { status: "PENDING" } }),
    prisma.comment.count({ where: { status: "FLAGGED" } }),
    prisma.user.count(),
    prisma.article.aggregate({ _sum: { viewsCount: true } }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewsCount: "desc" },
      take: 5,
      include: { category: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { name: true, role: true } } },
    }),
  ]);

  const totalViews = totalViewsAgg._sum.viewsCount || 0;

  const metricCards = [
    {
      title: "Published Articles",
      value: totalPublished,
      icon: FileText,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
      link: "/admin/articles",
    },
    {
      title: "Pending Submissions",
      value: pendingSubmissions,
      icon: Inbox,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
      link: "/admin/submissions",
      alert: pendingSubmissions > 0,
    },
    {
      title: "Total Article Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Registered Users",
      value: totalUsers,
      icon: Users,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
      link: "/admin/users",
    },
    {
      title: "Draft Articles",
      value: totalDrafts,
      icon: Clock,
      color: "text-slate-600 bg-slate-100 dark:bg-slate-800",
      link: "/admin/articles",
    },
    {
      title: "Flagged Comments",
      value: flaggedComments,
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
      link: "/admin/comments",
      alert: flaggedComments > 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Editorial Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics, active queues, and platform health telemetry.
        </p>
      </div>

      {/* Metrics 6-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {card.value}
                </p>
                {card.link && (
                  <Link
                    href={card.link}
                    className="text-[11px] font-bold text-red-600 hover:underline mt-2 inline-flex items-center"
                  >
                    <span>Manage Queue</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Most Read & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Read Stories (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-slate-800">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Most Read Editorial Stories
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {mostReadStories.map((story) => (
              <div key={story.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <span className="text-[10px] font-bold text-red-600 uppercase">
                    {story.category.name}
                  </span>
                  <Link
                    href={`/en/${story.category.slug}/${story.slug}`}
                    target="_blank"
                    className="block font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-red-600 truncate"
                  >
                    {story.title}
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {story.viewsCount.toLocaleString()} views
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {story.likesCount} likes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-slate-800">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Editorial Audit Activity
            </h2>
          </div>

          <div className="space-y-3">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="text-xs p-2.5 rounded bg-gray-50 dark:bg-slate-800/60 space-y-1">
                <div className="flex items-center justify-between font-medium">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatTimeAgo(log.createdAt)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {log.details || `Modified ${log.entity}`}
                </p>
                {log.user && (
                  <span className="text-[10px] text-indigo-500 font-semibold block">
                    By {log.user.name} ({log.user.role})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
