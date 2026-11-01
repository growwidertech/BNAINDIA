import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, author: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://antigravitynews.com";

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Antigravity News - Trusted News. A Connected World.</title>
    <link>${baseUrl}</link>
    <description>Latest breaking international, Indian, business, technology, and sports news updates.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`;

  for (const a of articles) {
    rss += `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${baseUrl}/${a.language}/${a.category.slug}/${a.slug}</link>
      <guid>${baseUrl}/${a.language}/${a.category.slug}/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${a.summary}]]></description>
      <category>${a.category.name}</category>
    </item>`;
  }

  rss += `
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
