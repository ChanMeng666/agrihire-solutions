import { db } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { cart, cartItem, product, category } from "../../../drizzle/schema";

export async function getOrCreateCart(customerId: number) {
  const existing = await db
    .select()
    .from(cart)
    .where(eq(cart.customerId, customerId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [newCart] = await db
    .insert(cart)
    .values({ customerId })
    .returning();

  return newCart;
}

export async function getCartWithItems(customerId: number) {
  const customerCart = await db
    .select()
    .from(cart)
    .where(eq(cart.customerId, customerId))
    .limit(1);

  if (customerCart.length === 0) return { cart: null, items: [] };

  const items = await db
    .select({
      cartItemId: cartItem.cartItemId,
      productCode: cartItem.productCode,
      qty: cartItem.qty,
      lineNum: cartItem.lineNum,
      hireRate: cartItem.hireRate,
      discRate: cartItem.discRate,
      hireFrom: cartItem.hireFrom,
      hireTo: cartItem.hireTo,
      productName: product.name,
      productImage: product.image,
      categoryName: category.name,
    })
    .from(cartItem)
    .innerJoin(product, eq(cartItem.productCode, product.productCode))
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(eq(cartItem.cartId, customerCart[0].cartId))
    .orderBy(cartItem.lineNum);

  return { cart: customerCart[0], items };
}

export async function getCartItemCount(customerId: number) {
  const result = await db
    .select({
      count: sql<number>`coalesce(sum(${cartItem.qty}), 0)`,
    })
    .from(cart)
    .leftJoin(cartItem, eq(cart.cartId, cartItem.cartId))
    .where(eq(cart.customerId, customerId));

  return result[0]?.count ?? 0;
}
