import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.208.158.203", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.goal.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "**.sofascore.com" },
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "**.bbci.co.uk" },
      { protocol: "https", hostname: "**.guim.co.uk" },
      { protocol: "https", hostname: "**.espncdn.com" },
      { protocol: "https", hostname: "**.365dm.com" },
      { protocol: "https", hostname: "**.minutemediacdn.com" },
    ],
  },
};

export default nextConfig;
