import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { AuthProvider } from "@/components/common/AuthProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "BNA NEWS — True Democracy Voice | Trusted Indian & World News",
  description:
    "Bharat News Agency (BNA) — True Democracy Voice. Unbiased breaking news, investigative ground reports, multimedia journalism, and accredited national correspondents across 11 languages.",
  keywords: [
    "BNA News",
    "True Democracy Voice",
    "breaking news",
    "world news",
    "india news",
    "bureau reporters",
    "business",
    "technology",
    "ground journalism",
  ],
  authors: [{ name: "BNA News Agency" }],
  icons: {
    icon: "/images/bna-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-[#ea580c] selection:text-white">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
