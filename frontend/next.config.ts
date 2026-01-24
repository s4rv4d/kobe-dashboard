import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nft-cdn.alchemy.com",
      },
      {
        protocol: "https",
        hostname: "static.alchemyapi.io",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.walletconnect.com wss://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.org https://*.alchemy.com https://*.alchemyapi.io https://eth.merkle.io",
              "frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
