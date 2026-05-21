export type NewsCategory =
  | "Ligue 1"
  | "Champions League"
  | "Transferts"
  | "Équipe de France"
  | "Afrique"
  | "International"
  | "Analyse";

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: NewsCategory;
  image: string;
  excerpt: string;
  body: string;
  date: string;
  author: string;
  readTime: number;
}
