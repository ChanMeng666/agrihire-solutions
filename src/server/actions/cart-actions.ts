"use server";

import { db } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { cart, cartItem, product, promotion, promoProduct } from "../../../drizzle/schema";
import { getOrCreateCart } from "../queries/cart";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function addToCart(formData: FormData) {
  const session = await requireAuth();
  const userId = Number(session.user.id);

  // Get customer ID from user
  const customerResult = await db.execute(
    sql`SELECT customer_id FROM customer WHERE user_id = ${userId}`
  );
  const customerId = (customerResult as unknown as Array<{ customer_id: number }>)[0]?.customer_id;
  if (!customerId) throw new Error("Customer profile not found");

  const productCode = formData.get("productCode") as string;
  const qty = Number(formData.get("qty") || 1);
  const hireFrom = new Date(formData.get("hireFrom") as string);
  const hireTo = new Date(formData.get("hireTo") as string);

  // Get product price
  const productResult = await db
    .select({ priceA: product.priceA })
    .from(product)
    .where(eq(product.productCode, productCode))
    .limit(1);

  if (productResult.length === 0) throw new Error("Product not found");

  const customerCart = await getOrCreateCart(customerId);

  // Get next line number
  const lineResult = await db
    .select({
      maxLine: sql<number>`coalesce(max(${cartItem.lineNum}), 0)`,
    })
    .from(cartItem)
    .where(eq(cartItem.cartId, customerCart.cartId));

  const nextLine = (lineResult[0]?.maxLine ?? 0) + 1;

  await db.insert(cartItem).values({
    cartId: customerCart.cartId,
    productCode,
    qty,
    lineNum: nextLine,
    hireRate: productResult[0].priceA,
    hireFrom,
    hireTo,
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function removeCartItem(cartItemId: number) {
  await requireAuth();
  await db.delete(cartItem).where(eq(cartItem.cartItemId, cartItemId));
  revalidatePath("/cart");
}

export async function updateCartItemQty(cartItemId: number, qty: number) {
  await requireAuth();
  if (qty < 1) {
    await db.delete(cartItem).where(eq(cartItem.cartItemId, cartItemId));
  } else {
    await db
      .update(cartItem)
      .set({ qty })
      .where(eq(cartItem.cartItemId, cartItemId));
  }
  revalidatePath("/cart");
}

export async function applyPromoCode(promoCode: string) {
  const session = await requireAuth();
  const userId = Number(session.user.id);

  const customerResult = await db.execute(
    sql`SELECT customer_id FROM customer WHERE user_id = ${userId}`
  );
  const customerId = (customerResult as unknown as Array<{ customer_id: number }>)[0]?.customer_id;
  if (!customerId) throw new Error("Customer profile not found");

  // Check if promo exists and is active
  const promoResult = await db
    .select()
    .from(promotion)
    .where(
      and(
        eq(promotion.promoCode, promoCode),
        eq(promotion.status, 1),
        sql`${promotion.startDate} <= now()`,
        sql`${promotion.endDate} >= now()`
      )
    )
    .limit(1);

  if (promoResult.length === 0) {
    return { success: false, error: "Invalid or expired promotion code" };
  }

  const promo = promoResult[0];

  // Update cart with promo code
  const customerCart = await getOrCreateCart(customerId);
  await db
    .update(cart)
    .set({ promoCode })
    .where(eq(cart.cartId, customerCart.cartId));

  // Get promo products
  const promoProducts = await db
    .select({ productCode: promoProduct.productCode })
    .from(promoProduct)
    .where(eq(promoProduct.promoCode, promoCode));

  const promoProductCodes = promoProducts.map((p) => p.productCode);

  // Apply discount to matching cart items
  if (promoProductCodes.length > 0) {
    for (const code of promoProductCodes) {
      await db
        .update(cartItem)
        .set({ discRate: promo.discRate })
        .where(
          and(
            eq(cartItem.cartId, customerCart.cartId),
            eq(cartItem.productCode, code)
          )
        );
    }
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removePromoCode() {
  const session = await requireAuth();
  const userId = Number(session.user.id);

  const customerResult = await db.execute(
    sql`SELECT customer_id FROM customer WHERE user_id = ${userId}`
  );
  const customerId = (customerResult as unknown as Array<{ customer_id: number }>)[0]?.customer_id;
  if (!customerId) throw new Error("Customer profile not found");

  const customerCart = await getOrCreateCart(customerId);

  await db
    .update(cart)
    .set({ promoCode: null })
    .where(eq(cart.cartId, customerCart.cartId));

  // Reset discount on all items
  await db
    .update(cartItem)
    .set({ discRate: "0.00" })
    .where(eq(cartItem.cartId, customerCart.cartId));

  revalidatePath("/cart");
}
