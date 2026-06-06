export interface OnzeActuArticle {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  content: string;
  category: string[];
  tags?: string[];
  countryName?: string[];
  imageUrls: string[];
  coverImage?: string;
  endpointAssignments?: { name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface OnzeActuListResponse {
  data: OnzeActuArticle[];
  meta: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export enum OnzeActuEndpoint {
  HomePage = "HomePage",
  Ligue1 = "Ligue 1",
  Ligue2 = "Ligue 2",
  ChampionsLeague = "Champions League",
  EuropaLeague = "Europa League",
  CoupeDeFrance = "Coupe de France",
  EquipeDeFrance = "Équipe de France",
  Transferts = "Transferts",
  Afrique = "Afrique",
  CoupeDuMonde = "Coupe du Monde",
  International = "International",
  Analyse = "Analyse",
  NationsLeague = "Nations League",
  CoupeDAfriqueDesNations = "Coupe d'Afrique des Nations",
  QualificationsCoupeDuMonde = "Qualifications Coupe du Monde",
}

export const OnzeActuRouteEndpoint: Record<string, OnzeActuEndpoint> = {
  "/": OnzeActuEndpoint.HomePage,
  "/ligue-1": OnzeActuEndpoint.Ligue1,
  "/ligue-2": OnzeActuEndpoint.Ligue2,
  "/champions-league": OnzeActuEndpoint.ChampionsLeague,
  "/europa-league": OnzeActuEndpoint.EuropaLeague,
  "/coupe-de-france": OnzeActuEndpoint.CoupeDeFrance,
  "/equipe-de-france": OnzeActuEndpoint.EquipeDeFrance,
  "/transferts": OnzeActuEndpoint.Transferts,
  "/afrique": OnzeActuEndpoint.Afrique,
  "/coupe-du-monde": OnzeActuEndpoint.CoupeDuMonde,
  "/international": OnzeActuEndpoint.International,
  "/analyse": OnzeActuEndpoint.Analyse,
  "/nations-league": OnzeActuEndpoint.NationsLeague,
  "/coupe-d-afrique-des-nations": OnzeActuEndpoint.CoupeDAfriqueDesNations,
  "/qualifications-coupe-du-monde": OnzeActuEndpoint.QualificationsCoupeDuMonde,
};

const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://api.onzeactu.com/api";

export interface FetchArticlesOptions {
  limit?: number;
  page?: number;
  requireImage?: boolean;
  search?: string;
  daysBack?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export function getArticleImage(article: OnzeActuArticle): string {
  return (
    article.coverImage ||
    article.imageUrls?.[0] ||
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop"
  );
}

export async function fetchOnzeActuArticlesByEndpoint(
  endpoint: OnzeActuEndpoint,
  options: FetchArticlesOptions = {}
): Promise<OnzeActuListResponse> {
  const {
    limit = 20,
    page = 1,
    requireImage,
    search,
    daysBack,
    sort = "createdAt",
    order = "desc",
  } = options;

  const params = new URLSearchParams({
    targetWebsite: "onzeactu.com",
    endpoint,
    filterByEndpoint: "true",
    limit: String(limit),
    page: String(page),
    sort,
    order,
  });

  if (requireImage) params.set("requireImage", "true");
  if (search) params.set("search", search);
  if (daysBack != null) params.set("daysBack", String(daysBack));

  const url = `${CMS_BASE}/ai-articles?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "omit",
      next: { revalidate: 60 },
    });
  } catch {
    return { data: [], meta: { total: 0, currentPage: page, totalPages: 0, limit } };
  }

  if (!res.ok) {
    return { data: [], meta: { total: 0, currentPage: page, totalPages: 0, limit } };
  }

  const json = await res.json();
  return json as OnzeActuListResponse;
}

export async function fetchOnzeActuArticleBySlug(
  slug: string
): Promise<OnzeActuArticle | null> {
  const url = `${CMS_BASE}/ai-articles/slug/${encodeURIComponent(slug)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "omit",
      next: { revalidate: 300 },
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const json = await res.json();
  return json as OnzeActuArticle;
}

export const fetchOnzeActuHome = (opts?: FetchArticlesOptions) =>
  fetchOnzeActuArticlesByEndpoint(OnzeActuEndpoint.HomePage, {
    limit: 9,
    ...opts,
  });

export const fetchOnzeActuLigue1 = (opts?: FetchArticlesOptions) =>
  fetchOnzeActuArticlesByEndpoint(OnzeActuEndpoint.Ligue1, { limit: 20, ...opts });

export const fetchOnzeActuTransferts = (opts?: FetchArticlesOptions) =>
  fetchOnzeActuArticlesByEndpoint(OnzeActuEndpoint.Transferts, {
    limit: 20,
    ...opts,
  });

export const fetchOnzeActuCoupeDuMonde = (opts?: FetchArticlesOptions) =>
  fetchOnzeActuArticlesByEndpoint(OnzeActuEndpoint.CoupeDuMonde, {
    limit: 20,
    ...opts,
  });
