import React from "react";
import { getLanguageConfig, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/languages";
import { Header } from "@/components/layout/Header";
import { BreakingNewsTicker } from "@/components/layout/BreakingNewsTicker";
import { Footer } from "@/components/layout/Footer";
import { GoogleAdSenseScript } from "@/components/ads/GoogleAdSenseScript";
import { getBreakingArticles, getNavCategories } from "@/lib/content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang: lang.code }));
}

export default async function MultilingualLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam || DEFAULT_LANGUAGE;
  const langConfig = getLanguageConfig(lang);
  const categories = getNavCategories();
  const breakingArticles = getBreakingArticles(lang);

  return (
    <div dir={langConfig.dir} lang={lang} className="flex flex-col min-h-screen">
      <GoogleAdSenseScript />
      <Header lang={lang} categories={categories} />
      <BreakingNewsTicker lang={lang} items={breakingArticles} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
