import { db } from "@/lib/db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import {
  promotion,
  promoProduct,
  product,
  store,
} from "../../../drizzle/schema";

export async function getActivePromotions() {
  const now = new Date();
  return db
    .select({
      promoCode: promotion.promoCode,
      name: promotion.name,
      description: promotion.description,
      discRate: promotion.discRate,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      storeName: store.storeName,
      storeId: promotion.storeId,
    })
    .from(promotion)
    .innerJoin(store, eq(promotion.storeId, store.storeId))
    .where(
      and(
        eq(promotion.status, 1),
        lte(promotion.startDate, now),
        gte(promotion.endDate, now)
      )
    )
    .orderBy(promotion.endDate);
}

export async function getPromotionProducts(promoCode: string) {
  return db
    .select({
      productCode: product.productCode,
      name: product.name,
      priceA: product.priceA,
      image: product.image,
      categoryCode: product.categoryCode,
    })
    .from(promoProduct)
    .innerJoin(product, eq(promoProduct.productCode, product.productCode))
    .where(eq(promoProduct.promoCode, promoCode));
}
