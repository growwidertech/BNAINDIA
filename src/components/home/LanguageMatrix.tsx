"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, getDictionary } from "@/lib/languages";

interface LanguageMatrixProps {
  currentLang: string;
}

export function LanguageMatrix({ currentLang }: LanguageMatrixProps) {
  const router = useRouter();
  const dict = getDictionary(currentLang);

  const handleSelectLanguage = (langCode: string) => {
    router.push(`/${langCode}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 shadow-sm my-6">
      {/* Title */}
      <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
          {dict.selectLanguage}
        </h3>
      </div>

      {/* Grid of Languages */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLang;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`p-2 rounded border text-xs transition flex flex-col items-center justify-center ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                  : "bg-gray-50 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm">{lang.nativeName}</span>
              <span className={`text-[10px] mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                {lang.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
