import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FileText, Plus, Eye, Heart, MessageSquare, Radio, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: {
      category: true,
      author: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Articles Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage published news, breaking stories, and editorial syndication.
          </p>
        </div>

        <Link
          href="/en/submit-news"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-slate-800">
            <tr>
              <th className="p-3.5">Headline & Category</th>
              <th className="p-3.5">Author</th>
              <th className="p-3.5">Lang</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-center">Breaking</th>
              <th className="p-3.5 text-right">Engagement</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition">
                <td className="p-3.5 max-w-xs">
                  <span className="text-[10px] font-bold text-red-600 uppercase">
                    {art.category.name}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {art.title}
                  </p>
                </td>

                <td className="p-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                  {art.author.name}
                </td>

                <td className="p-3.5 whitespace-nowrap font-mono uppercase font-bold text-slate-500">
                  {art.language}
                </td>

                <td className="p-3.5 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {art.status}
                  </span>
                </td>

                <td className="p-3.5 text-center">
                  {art.isBreaking ? (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white animate-pulse">
                      ALERT
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">No</span>
                  )}
                </td>

                <td className="p-3.5 text-right whitespace-nowrap text-slate-500">
                  <span>{art.viewsCount.toLocaleString()} views</span>
                  <span className="text-[10px] text-slate-400 block">{art.likesCount} likes</span>
                </td>

                <td className="p-3.5 text-right whitespace-nowrap">
                  <Link
                    href={`/en/${art.category.slug}/${art.slug}`}
                    target="_blank"
                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                    title="View live article"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-0.5" />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
