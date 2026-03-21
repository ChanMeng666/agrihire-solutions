import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { store, storeHour } from "../../../drizzle/schema";

export async function getActiveStores() {
  return db
    .select()
    .from(store)
    .where(eq(store.status, 1))
    .orderBy(store.storeName);
}

export async function getStoreById(storeId: number) {
  const results = await db
    .select()
    .from(store)
    .where(and(eq(store.storeId, storeId), eq(store.status, 1)))
    .limit(1);

  return results[0] ?? null;
}

export async function getStoreHours(storeId: number) {
  return db
    .select()
    .from(storeHour)
    .where(eq(storeHour.storeId, storeId))
    .orderBy(storeHour.weekDay);
}
