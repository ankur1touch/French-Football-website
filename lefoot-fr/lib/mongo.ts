import { MongoClient, type Db, type Collection } from "mongodb";
import type { NewsItem } from "@/types/news";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  return global._mongoClientPromise;
}

export async function getMongoDb(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) return null;
  const client = await promise;
  const dbName = process.env.MONGODB_DB ?? "lefoot_fr";
  return client.db(dbName);
}

export async function getArticlesCollection(): Promise<Collection<NewsItem> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return db.collection<NewsItem>("articles");
}

export async function insertMongoArticle(article: NewsItem): Promise<NewsItem> {
  const col = await getArticlesCollection();
  if (!col) throw new Error("MongoDB not configured");
  await col.updateOne({ slug: article.slug }, { $set: article }, { upsert: true });
  return article;
}

export async function listMongoArticles(): Promise<NewsItem[]> {
  const col = await getArticlesCollection();
  if (!col) return [];
  return col.find({}).sort({ publishedAt: -1 }).limit(100).toArray();
}

export async function getMongoArticleBySlug(slug: string): Promise<NewsItem | null> {
  const col = await getArticlesCollection();
  if (!col) return null;
  return col.findOne({ slug });
}

export async function countMongoArticles(): Promise<number> {
  const col = await getArticlesCollection();
  if (!col) return 0;
  return col.countDocuments();
}
