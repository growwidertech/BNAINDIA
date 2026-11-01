"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Key, Mail, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "@/components/common/AuthProvider";
import { getDictionary } from "@/lib/languages";

export default function SignInPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const dict = getDictionary(params.lang);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        await refreshUser();
        router.push(`/${params.lang}`);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Login failed");
      }
    } catch {
      setErrorMsg("Network error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-600 flex items-center justify-center text-white mb-2 shadow">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Sign In
        </h1>
        <p className="text-xs text-slate-500">
          Access your Antigravity News bookmarks, comments, and reports.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition shadow disabled:opacity-50"
        >
          {submitting ? "Signing In..." : "Sign In to Account"}
        </button>
      </form>

      {/* Quick-fill Demo Accounts */}
      <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
        <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
          Quick-Fill Demo Credentials
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => fillDemoAccount("admin@antigravitynews.com", "Admin@123")}
            className="p-2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-center hover:opacity-90"
          >
            🛡️ Admin (Vikram)
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount("editor@antigravitynews.com", "Editor@123")}
            className="p-2 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-center hover:opacity-90"
          >
            ✏️ Editor (Priya)
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount("reporter@antigravitynews.com", "Reporter@123")}
            className="p-2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-center hover:opacity-90"
          >
            📰 Contributor (Arjun)
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount("reader@antigravitynews.com", "Reader@123")}
            className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-center hover:opacity-90"
          >
            👤 Reader (Aanya)
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href={`/${params.lang}/auth/signup`}
          className="text-red-600 font-bold hover:underline"
        >
          Sign Up here
        </Link>
      </div>
    </div>
  );
}
