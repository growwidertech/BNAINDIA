import React from "react";
import { prisma } from "@/lib/prisma";
import { HeroLeadSection } from "@/components/home/HeroLeadSection";
import { TopStoriesGrid } from "@/components/home/TopStoriesGrid";
import { LiveNewsUpdates } from "@/components/home/LiveNewsUpdates";
import { ReporterNetworkCard } from "@/components/home/ReporterNetworkCard";
import { NewsWithoutBordersBanner } from "@/components/home/NewsWithoutBordersBanner";
import { CategoryNewsSection } from "@/components/home/CategoryNewsSection";
import { StateDistrictNewsHub } from "@/components/home/StateDistrictNewsHub";
import { FactCheckSection } from "@/components/home/FactCheckSection";
import { TrendingLeaderboard } from "@/components/home/TrendingLeaderboard";
import { DailyPollWidget } from "@/components/home/DailyPollWidget";
import { PhotoGallerySection } from "@/components/home/PhotoGallerySection";
import { MarketFinancialTicker } from "@/components/home/MarketFinancialTicker";
import { GoogleAdSlot } from "@/components/ads/GoogleAdSlot";
import { DEFAULT_LANGUAGE } from "@/lib/languages";

export const dynamic = "force-dynamic";

interface HomePageProps {
  params: { lang: string };
}

export default async function HomePage({ params }: HomePageProps) {
  const lang = params.lang || DEFAULT_LANGUAGE;

  // 1. Fetch all published articles with category, author, and translations
  const rawArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: { select: { id: true, name: true, slug: true, color: true } },
      author: { select: { name: true, role: true } },
      translations: { where: { language: lang } },
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  // Map translations if present for requested language
  const localizedArticles = rawArticles.map((art) => {
    const trans = art.translations[0];
    if (trans) {
      return {
        ...art,
        title: trans.title,
        summary: trans.summary,
        content: trans.content,
      };
    }
    return art;
  });

  // Hero article (lead video)
  const leadArticle =
    localizedArticles.find((a) => a.isHeroVideo || a.isBreaking) || localizedArticles[0];

  // Secondary sidebar articles
  const sidebarArticles = localizedArticles.filter((a) => a.id !== leadArticle?.id).slice(0, 4);

  // Top stories for the 4-grid
  const topStories = localizedArticles.filter((a) => a.id !== leadArticle?.id).slice(0, 4);

  // District Ground Articles (filtered by location/district, or rich fallback)
  const explicitDistrictArticles = localizedArticles.filter(
    (a) => Boolean(a.location || a.district || a.state) && a.id !== leadArticle?.id
  );
  const districtArticles =
    explicitDistrictArticles.length >= 4
      ? explicitDistrictArticles
      : [
          ...explicitDistrictArticles,
          ...localizedArticles.filter((a) => !explicitDistrictArticles.includes(a)),
        ].slice(0, 6);

  // Categories for showcase
  const categoriesWithArticles = await prisma.category.findMany({
    take: 8,
    orderBy: { order: "asc" },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        take: 1,
        select: { id: true, title: true, summary: true, slug: true, featuredImage: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* 0. Live Financial & Markets Pulse Strip */}
      <MarketFinancialTicker />

      {/* Google AdSense Top Header Billboard */}
      <GoogleAdSlot slotType="header" />

      {/* 1. Hero Lead Section (Large Video & Side Playlist) */}
      {leadArticle && (
        <HeroLeadSection
          lang={lang}
          leadArticle={leadArticle}
          sidebarArticles={sidebarArticles}
        />
      )}

      {/* 2. Top Stories (4-Card Grid) */}
      <TopStoriesGrid lang={lang} stories={topStories} />

      {/* Google AdSense In-Feed Interstitial Banner */}
      <GoogleAdSlot slotType="feed" />

      {/* 3. Main Two-Column Editorial Layout (Balanced & Fully Detailed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
        {/* Left Column: Category Showcases, Ground Wire, & Fact Check (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* A. News by Category Showcases */}
          <CategoryNewsSection lang={lang} categories={categoriesWithArticles} />

          {/* B. Ground Bureau Wire: State & District Dispatch (Fills the previous empty gap completely) */}
          <StateDistrictNewsHub lang={lang} articles={districtArticles as any} />

          {/* C. Times Now / BNA Fact Check & Verification Desk */}
          <FactCheckSection lang={lang} />
        </div>

        {/* Right Column: Live Updates, Most Read Leaderboard, Reporter Network & Citizen Poll (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* A. Live Dispatch */}
          <LiveNewsUpdates lang={lang} />

          {/* B. Most Read Trending Stories Leaderboard (Ranked 01-05) */}
          <TrendingLeaderboard lang={lang} articles={localizedArticles as any} />

          {/* C. BNA Ground Reporter Network Card */}
          <ReporterNetworkCard lang={lang} />

          {/* D. Interactive Citizen Opinion Poll */}
          <DailyPollWidget />
        </div>
      </div>

      {/* 4. Photojournalism & Visual Stories Carousel */}
      <PhotoGallerySection lang={lang} />

      {/* Google AdSense Bottom Anchor Unit */}
      <GoogleAdSlot slotType="footer" />

      {/* 5. News Without Borders Multilingual Banner */}
      <NewsWithoutBordersBanner lang={lang} />
    </div>
  );
}
