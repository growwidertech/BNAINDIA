"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

interface GoogleAdSenseScriptProps {
  initialPublisherId?: string;
  initialEnabled?: boolean;
}

export function GoogleAdSenseScript({
  initialPublisherId,
  initialEnabled,
}: GoogleAdSenseScriptProps) {
  const [publisherId, setPublisherId] = useState(initialPublisherId || "ca-pub-9876543210123456");
  const [enabled, setEnabled] = useState(initialEnabled !== undefined ? initialEnabled : true);

  useEffect(() => {
    // If not provided via server props, fetch dynamic ad config
    if (initialPublisherId === undefined || initialEnabled === undefined) {
      fetch("/api/ads")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setPublisherId(data.publisherId);
            setEnabled(data.adsenseEnabled);
          }
        })
        .catch(() => {});
    }
  }, [initialPublisherId, initialEnabled]);

  if (!enabled || !publisherId) return null;

  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
