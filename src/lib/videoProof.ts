export type VideoPlatform =
  | "YOUTUBE"
  | "TWITTER_X"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "OTHER";

export interface VideoPlatformMeta {
  platform: VideoPlatform;
  name: string;
  badgeLabel: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  btnBg: string;
  btnHover: string;
  btnText: string;
  embedUrl: string | null;
  actionText: string;
  domainNotice: string;
}

export function detectVideoProofPlatform(url: string | null | undefined): VideoPlatform {
  if (!url) return "OTHER";
  const cleanUrl = url.trim().toLowerCase();

  if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
    return "YOUTUBE";
  }
  if (cleanUrl.includes("twitter.com") || cleanUrl.includes("x.com")) {
    return "TWITTER_X";
  }
  if (cleanUrl.includes("instagram.com")) {
    return "INSTAGRAM";
  }
  if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch")) {
    return "FACEBOOK";
  }
  return "OTHER";
}

export function extractYouTubeId(url: string): string | null {
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
  }
}

export function getVideoPlatformMeta(
  rawUrl: string,
  preferredPlatform?: string | null
): VideoPlatformMeta {
  const platform =
    (preferredPlatform as VideoPlatform) || detectVideoProofPlatform(rawUrl);

  switch (platform) {
    case "YOUTUBE": {
      const ytId = extractYouTubeId(rawUrl);
      return {
        platform: "YOUTUBE",
        name: "YouTube",
        badgeLabel: "YouTube Video Proof",
        badgeBg: "bg-red-100 dark:bg-red-950/70",
        badgeBorder: "border-red-300 dark:border-red-800",
        badgeText: "text-red-700 dark:text-red-300",
        btnBg: "bg-[#FF0000]",
        btnHover: "hover:bg-[#CC0000]",
        btnText: "text-white",
        embedUrl: ytId ? `https://www.youtube-nocookie.com/embed/${ytId}` : null,
        actionText: "Watch Original Video on YouTube",
        domainNotice: "Redirects directly to YouTube video broadcast",
      };
    }
    case "TWITTER_X": {
      return {
        platform: "TWITTER_X",
        name: "X (formerly Twitter)",
        badgeLabel: "X (Twitter) Proof Post",
        badgeBg: "bg-slate-900 text-white dark:bg-black",
        badgeBorder: "border-slate-700",
        badgeText: "text-slate-100",
        btnBg: "bg-black dark:bg-slate-900",
        btnHover: "hover:bg-slate-800",
        btnText: "text-white border border-slate-700",
        embedUrl: null,
        actionText: "View Video Proof on X (Twitter)",
        domainNotice: "Opens verified footage post on X (formerly Twitter)",
      };
    }
    case "INSTAGRAM": {
      return {
        platform: "INSTAGRAM",
        name: "Instagram",
        badgeLabel: "Instagram Reel / Clip",
        badgeBg: "bg-pink-100 dark:bg-pink-950/70",
        badgeBorder: "border-pink-300 dark:border-pink-800",
        badgeText: "text-pink-700 dark:text-pink-300",
        btnBg: "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500",
        btnHover: "hover:opacity-90",
        btnText: "text-white",
        embedUrl: null,
        actionText: "Watch Source Reel on Instagram",
        domainNotice: "Redirects directly to Instagram Reel / Video post",
      };
    }
    case "FACEBOOK": {
      return {
        platform: "FACEBOOK",
        name: "Facebook Video",
        badgeLabel: "Facebook Watch Proof",
        badgeBg: "bg-blue-100 dark:bg-blue-950/70",
        badgeBorder: "border-blue-300 dark:border-blue-800",
        badgeText: "text-blue-700 dark:text-blue-300",
        btnBg: "bg-[#1877F2]",
        btnHover: "hover:bg-[#166fe5]",
        btnText: "text-white",
        embedUrl: null,
        actionText: "Watch Video Proof on Facebook",
        domainNotice: "Redirects directly to Facebook video source",
      };
    }
    default: {
      return {
        platform: "OTHER",
        name: "External Media Wire",
        badgeLabel: "External Video Evidence",
        badgeBg: "bg-slate-100 dark:bg-slate-800",
        badgeBorder: "border-slate-300 dark:border-slate-700",
        badgeText: "text-slate-700 dark:text-slate-300",
        btnBg: "bg-slate-800 dark:bg-slate-700",
        btnHover: "hover:bg-slate-700",
        btnText: "text-white",
        embedUrl: null,
        actionText: "Open Source Video on Host Site",
        domainNotice: "Redirects to external third-party video host",
      };
    }
  }
}
