import React from "react";
import Link from "next/link";
import { UserCheck, Users, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

interface ReporterNetworkCardProps {
  lang: string;
}

export function ReporterNetworkCard({ lang }: ReporterNetworkCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#0b2545] to-[#103058] rounded-xl p-5 text-white shadow-md border-t-4 border-[#ea580c] space-y-4">
      {/* Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 text-[10px] font-bold uppercase tracking-wider border border-orange-400/30">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
          <span>Press Accreditation</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
          Live Network
        </span>
      </div>

      {/* Heading & Pitch */}
      <div>
        <h3 className="text-base font-black uppercase tracking-tight leading-snug">
          BNA Ground Reporter Network
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Are you a local reporter, journalist, or field correspondent? Get your district news published nationwide across 11 languages with official press credentials.
        </p>
      </div>

      {/* Quick stats / Features */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs py-1">
        <div className="bg-white/10 rounded-lg p-2">
          <span className="block font-black text-sm text-orange-400">120+</span>
          <span className="text-[10px] text-slate-300">District Bureaus</span>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <span className="block font-black text-sm text-emerald-400">11</span>
          <span className="text-[10px] text-slate-300">Languages</span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-1 space-y-2">
        <Link
          href={`/${lang}/reporter-signup`}
          className="w-full py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5 shadow"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Apply as Reporter</span>
        </Link>

        <Link
          href={`/${lang}/reporters`}
          className="w-full py-2 bg-white/10 hover:bg-white/15 text-slate-200 rounded-lg font-semibold text-xs transition flex items-center justify-center space-x-1"
        >
          <Users className="w-3.5 h-3.5 mr-1" />
          <span>Browse Bureau Journalists</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
