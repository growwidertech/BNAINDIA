import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, hasRequiredRole } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  MessageSquare,
  Users,
  Settings,
  ArrowLeft,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || !hasRequiredRole(user.role, "EDITOR")) {
    redirect("/en/auth/signin");
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Brand header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2.5">
          <div className="bg-white p-1 rounded shrink-0">
            <img src="/images/bna-logo.jpg" alt="BNA" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white tracking-wider uppercase">
              BNA CMS
            </h1>
            <p className="text-[10px] text-orange-400 font-bold tracking-wide">
              True Democracy Voice
            </p>
          </div>
        </div>

        {/* User Badge */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <p className="text-xs font-bold text-white truncate">{user.name}</p>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Role: <span className="text-amber-400">{user.role}</span>
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1 flex-1 text-xs font-semibold">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Dashboard Overview</span>
          </Link>

          <Link
            href="/admin/articles"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Articles Management</span>
          </Link>

          <Link
            href="/admin/submissions"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            <Inbox className="w-4 h-4 text-amber-400" />
            <span>Submission Review Queue</span>
          </Link>

          <Link
            href="/admin/comments"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Comment Moderation</span>
          </Link>

          <Link
            href="/en/reporters"
            target="_blank"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-orange-300 hover:text-white transition"
          >
            <Users className="w-4 h-4 text-orange-400" />
            <span>Reporters Directory</span>
          </Link>

          {hasRequiredRole(user.role, "ADMIN") && (
            <>
              <Link
                href="/admin/users"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <Users className="w-4 h-4 text-rose-400" />
                <span>User & Role Governance</span>
              </Link>
              <Link
                href="/admin/ads"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Google Ads & Monetization</span>
              </Link>
            </>
          )}
        </nav>

        {/* Return to News Portal */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/en"
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to News Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
