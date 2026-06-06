export const ALLOWED_IMAGE_HOSTS = [
  "goal.com",
  "cloudinary.com",
  "images.unsplash.com",
  "via.placeholder.com",
  "sofascore.com",
  "media.api-sports.io",
  "i.guim.co.uk",
  "ichef.bbci.co.uk",
  "a.espncdn.com",
  "cdn.sportbible.com",
  "e0.365dm.com",
  "e2.365dm.com",
  "minutemediacdn.com",
  "sportbible.com",
  "onzeactu.com",
  "amazonaws.com",
  "s3.amazonaws.com",
  // Performgroup / Getty / Omnisport CDN
  "performgroup.com",
  "images.performgroup.com",
  // Yahoo / Yimg
  "yimg.com",
  "s.yimg.com",
  // Getty / iStockphoto
  "gettyimages.com",
  "media.gettyimages.com",
  // AFP / L'Equipe / various French sports media
  "medias.lequipe.fr",
  "media.lequipe.fr",
  "afp.com",
  // Common news CDNs
  "imago-images.de",
  "static.independent.co.uk",
  "i2.wp.com",
  "i1.wp.com",
  "i0.wp.com",
] as const;

export function isAllowedImageUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return ALLOWED_IMAGE_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

export const FALLBACK_NEWS_IMAGE =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop";
