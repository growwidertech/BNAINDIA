import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/languages";

interface CategoryShowcaseProps {
  lang: string;
  categories: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    articles: {
      id: string;
      slug: string;
      title: string;
      summary: string;
      featuredImage: string;
    }[];
  }[];
}

export function CategoryNewsSection({ lang, categories }: CategoryShowcaseProps) {
  const dict = getDictionary(lang);

  const fallbackCategories = [
    {
      name: "World",
      slug: "world",
      desc: "Global events, politics and international affairs",
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Business",
      slug: "business",
      desc: "Markets, economy and corporate news",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Technology",
      slug: "technology",
      desc: "Innovation, gadgets and digital transformation",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Sports",
      slug: "sports",
      desc: "Live scores, tournaments and athlete updates",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Entertainment",
      slug: "entertainment",
      desc: "Movies, celebrities and pop culture",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Health",
      slug: "health",
      desc: "Wellness, medical breakthroughs and health tips",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Lifestyle",
      slug: "lifestyle",
      desc: "Food, travel, fashion and living",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Science",
      slug: "science",
      desc: "Discoveries, space exploration and physics",
      image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="my-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#ea580c] pb-2 mb-6">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-6 bg-[#ea580c] rounded-sm" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-sans">
            {dict.newsByCategory}
          </h2>
        </div>
        <Link
          href={`/${lang}/world`}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center transition"
        >
          <span>{dict.viewAll}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {fallbackCategories.map((cat, idx) => (
          <Link
            key={idx}
            href={`/${lang}/${cat.slug}`}
            className="group block bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition"
          >
            <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition flex items-center justify-between">
                <span>{cat.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {cat.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
