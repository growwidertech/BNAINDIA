import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, language: true, updatedAt: true, category: { select: { slug: true } } },
    take: 100,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://antigravitynews.com";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>`;

  for (const a of articles) {
    xml += `
  <url>
    <loc>${baseUrl}/${a.language}/${a.category.slug}/${a.slug}</loc>
    <lastmod>${new Date(a.updatedAt).toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += "\n</urlset>";

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
