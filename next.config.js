/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

try {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch {
  // OpenNext is optional for a plain local Next.js run.
}

module.exports = nextConfig;
