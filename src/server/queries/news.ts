import { db } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { news, store } from "../../../drizzle/schema";

export async function getActiveNews() {
  return db
    .select({
      newsId: news.newsId,
      title: news.title,
      content: news.content,
      createDate: news.createDate,
      storeName: store.storeName,
    })
    .from(news)
    .innerJoin(store, eq(news.storeId, store.storeId))
    .where(eq(news.status, 1))
    .orderBy(desc(news.createDate));
}

export async function getNewsById(newsId: number) {
  const results = await db
    .select({
      newsId: news.newsId,
      title: news.title,
      content: news.content,
      createDate: news.createDate,
      storeName: store.storeName,
      storeId: news.storeId,
    })
    .from(news)
    .innerJoin(store, eq(news.storeId, store.storeId))
    .where(and(eq(news.newsId, newsId), eq(news.status, 1)))
    .limit(1);

  return results[0] ?? null;
}
