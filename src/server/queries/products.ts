import { db } from "@/lib/db";
import { eq, and, sql, ilike, desc } from "drizzle-orm";
import {
  product,
  category,
  machine,
  store,
} from "../../../drizzle/schema";

export async function getActiveCategories() {
  return db
    .select()
    .from(category)
    .where(eq(category.status, 1))
    .orderBy(category.name);
}

export async function getProductsByCategory(categoryCode: string) {
  return db
    .select({
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      priceA: product.priceA,
      image: product.image,
      categoryCode: product.categoryCode,
      categoryName: category.name,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(
      and(eq(product.categoryCode, categoryCode), eq(product.status, 1))
    )
    .orderBy(product.name);
}

export async function getAllActiveProducts() {
  return db
    .select({
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      priceA: product.priceA,
      image: product.image,
      categoryCode: product.categoryCode,
      categoryName: category.name,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(and(eq(product.status, 1), eq(category.status, 1)))
    .orderBy(product.name);
}

export async function searchProducts(query: string) {
  return db
    .select({
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      priceA: product.priceA,
      image: product.image,
      categoryCode: product.categoryCode,
      categoryName: category.name,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(
      and(
        eq(product.status, 1),
        ilike(product.name, `%${query}%`)
      )
    )
    .orderBy(product.name);
}

export async function getProductByCode(productCode: string) {
  const results = await db
    .select({
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      specs: product.specs,
      priceA: product.priceA,
      qtyBreakA: product.qtyBreakA,
      priceB: product.priceB,
      qtyBreakB: product.qtyBreakB,
      priceC: product.priceC,
      qtyBreakC: product.qtyBreakC,
      minHire: product.minHire,
      maxHire: product.maxHire,
      image: product.image,
      categoryCode: product.categoryCode,
      categoryName: category.name,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(eq(product.productCode, productCode))
    .limit(1);

  return results[0] ?? null;
}

export async function getProductAvailability(
  productCode: string,
  storeId: number
) {
  const results = await db
    .select({
      total: sql<number>`count(*)`,
      available: sql<number>`count(*) filter (where ${machine.status} = 1)`,
    })
    .from(machine)
    .where(
      and(
        eq(machine.productCode, productCode),
        eq(machine.storeId, storeId)
      )
    );

  return results[0] ?? { total: 0, available: 0 };
}

export async function getFeaturedProducts(limit = 6) {
  return db
    .select({
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      priceA: product.priceA,
      image: product.image,
      categoryCode: product.categoryCode,
      categoryName: category.name,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(and(eq(product.status, 1), eq(category.status, 1)))
    .orderBy(sql`random()`)
    .limit(limit);
}

export async function getStoresWithProduct(productCode: string) {
  return db
    .selectDistinct({
      storeId: store.storeId,
      storeName: store.storeName,
      city: store.city,
      availableCount: sql<number>`count(${machine.machineId}) filter (where ${machine.status} = 1)`,
    })
    .from(machine)
    .innerJoin(store, eq(machine.storeId, store.storeId))
    .where(
      and(eq(machine.productCode, productCode), eq(store.status, 1))
    )
    .groupBy(store.storeId, store.storeName, store.city)
    .orderBy(store.storeName);
}
