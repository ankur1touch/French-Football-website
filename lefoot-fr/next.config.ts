import type { NextConfig } from "next";

// Allow self-signed / untrusted TLS certs in dev (api.onzeactu.com cert issue)
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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
      { protocol: "https", hostname: "api.onzeactu.com" },
      { protocol: "https", hostname: "**.onzeactu.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.s3.amazonaws.com" },
      // Performgroup / Getty / Omnisport CDN
      { protocol: "https", hostname: "**.performgroup.com" },
      // Yahoo / Yimg
      { protocol: "https", hostname: "**.yimg.com" },
      // Getty Images
      { protocol: "https", hostname: "media.gettyimages.com" },
      { protocol: "https", hostname: "**.gettyimages.com" },
      // French sports media
      { protocol: "https", hostname: "medias.lequipe.fr" },
      { protocol: "https", hostname: "media.lequipe.fr" },
      // Common news CDNs
      { protocol: "https", hostname: "imago-images.de" },
      { protocol: "https", hostname: "static.independent.co.uk" },
      { protocol: "https", hostname: "**.wp.com" },
    ],
  },
};

export default nextConfig;
