"use client";

import React from "react";
import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

export function PhotoGallerySection({ lang }: { lang: string }) {
  const galleries = [
    {
      title: "Himalayan Glacial Basins: High-Altitude Scientific Expedition Documented",
      count: "12 Photos",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80",
      photographer: "Arun K. Sen / BNA Photo Wire",
    },
    {
      title: "Vande Bharat High-Speed Sleeper Trains: Inside the Next-Gen Cabins",
      count: "8 Photos",
      category: "Transport",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
      photographer: "R. Sharma / Bureau Wire",
    },
    {
      title: "ISRO Propulsion Complex: Cryogenic Engine Stage Testing in Tamil Nadu",
      count: "10 Photos",
      category: "Space",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      photographer: "K. Narayanan / ISRO Wire",
    },
    {
      title: "Kumbh Pilgrimage Preparations: Riverfront Ghats Illuminated in Prayagraj",
      count: "14 Photos",
      category: "Culture",
      image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80",
      photographer: "Deepak Verma / BNA Ground",
    },
  ];

  return (
    <section className="my-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#ea580c]">
        <div className="flex items-center space-x-2.5">
          <span className="w-1.5 h-6 bg-[#ea580c] rounded-sm" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-sans flex items-center space-x-2">
            <span>BNA in Pictures</span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/70 px-2 py-0.5 rounded-full lowercase">
              visual stories
            </span>
          </h2>
        </div>

        <Link
          href={`/${lang}/entertainment`}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center transition"
        >
          <span>View All Galleries</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* 4-Card Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {galleries.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl overflow-hidden bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
            </div>

            {/* Photo count pill */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center space-x-1 shadow">
              <Camera className="w-3 h-3 text-amber-400" />
              <span>{item.count}</span>
            </div>

            {/* Gradient Overlay & Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="font-extrabold text-xs sm:text-sm text-white leading-snug line-clamp-2 mt-0.5 group-hover:text-orange-200 transition">
                {item.title}
              </h3>
              <p className="text-[10px] text-slate-300 mt-1 line-clamp-1">
                Photo: {item.photographer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
