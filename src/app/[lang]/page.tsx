import React from "react";
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
import { getCategoriesWithArticles, getPublishedArticles } from "@/lib/content";

export const dynamic = "force-dynamic";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang: langParam } = await params;
  const lang = langParam || DEFAULT_LANGUAGE;
  const localizedArticles = getPublishedArticles(lang).slice(0, 30);

  const leadArticle =
    localizedArticles.find((article) => article.isHeroVideo || article.isBreaking) ||
    localizedArticles[0];

  const sidebarArticles = localizedArticles.filter((article) => article.id !== leadArticle?.id).slice(0, 4);
  const topStories = localizedArticles.filter((article) => article.id !== leadArticle?.id).slice(0, 4);

  const explicitDistrictArticles = localizedArticles.filter(
    (article) => Boolean(article.location || article.district || article.state) && article.id !== leadArticle?.id
  );
  const districtArticles =
    explicitDistrictArticles.length >= 4
      ? explicitDistrictArticles
      : [
          ...explicitDistrictArticles,
          ...localizedArticles.filter((article) => !explicitDistrictArticles.includes(article)),
        ].slice(0, 6);

  const categoriesWithArticles = getCategoriesWithArticles(lang);

  return (
    <div className="space-y-6">
      <MarketFinancialTicker />
      <GoogleAdSlot slotType="header" />

      {leadArticle && (
        <HeroLeadSection
          lang={lang}
          leadArticle={leadArticle}
          sidebarArticles={sidebarArticles}
        />
      )}

      <TopStoriesGrid lang={lang} stories={topStories} />
      <GoogleAdSlot slotType="feed" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
        <div className="lg:col-span-8 space-y-10">
          <CategoryNewsSection lang={lang} categories={categoriesWithArticles} />
          <StateDistrictNewsHub lang={lang} articles={districtArticles as any} />
          <FactCheckSection lang={lang} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <LiveNewsUpdates lang={lang} />
          <TrendingLeaderboard lang={lang} articles={localizedArticles as any} />
          <ReporterNetworkCard lang={lang} />
          <DailyPollWidget />
        </div>
      </div>

      <PhotoGallerySection lang={lang} />
      <GoogleAdSlot slotType="footer" />
      <NewsWithoutBordersBanner lang={lang} />
    </div>
  );
}
