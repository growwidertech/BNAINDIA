"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ea580c]">BNA News</p>
        <h1 className="text-2xl font-black text-slate-900">This page could not be loaded</h1>
        <p className="text-sm text-slate-600">
          Please retry, or return to the homepage for the latest dispatches.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded bg-[#ea580c] text-white text-sm font-bold"
          >
            Try again
          </button>
          <a href="/en" className="px-4 py-2 rounded border border-slate-300 text-sm font-bold text-slate-800">
            Go to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
