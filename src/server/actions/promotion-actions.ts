"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { promotion, promoProduct, news } from "../../../drizzle/schema";
import { requireStaff } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function createPromotion(formData: FormData) {
  await requireStaff();

  await db.insert(promotion).values({
    promoCode: formData.get("promoCode") as string,
    storeId: Number(formData.get("storeId")),
    discRate: formData.get("discRate") as string,
    startDate: new Date(formData.get("startDate") as string),
    endDate: new Date(formData.get("endDate") as string),
    name: (formData.get("name") as string) || null,
    description: (formData.get("description") as string) || null,
  });

  // Link products if provided
  const productCodes = formData.get("productCodes") as string;
  if (productCodes) {
    const codes = productCodes.split(",").map((c) => c.trim()).filter(Boolean);
    for (const code of codes) {
      await db.insert(promoProduct).values({
        promoCode: formData.get("promoCode") as string,
        productCode: code,
      });
    }
  }

  revalidatePath("/manage-promotions");
  return { success: true };
}

export async function togglePromotionStatus(promoCode: string, active: boolean) {
  await requireStaff();
  await db
    .update(promotion)
    .set({ status: active ? 1 : -1 })
    .where(eq(promotion.promoCode, promoCode));
  revalidatePath("/manage-promotions");
}

export async function createNews(formData: FormData) {
  await requireStaff();

  await db.insert(news).values({
    storeId: Number(formData.get("storeId")),
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    createDate: new Date(),
  });

  revalidatePath("/manage-news");
  return { success: true };
}

export async function updateNews(newsId: number, formData: FormData) {
  await requireStaff();

  await db
    .update(news)
    .set({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    })
    .where(eq(news.newsId, newsId));

  revalidatePath("/manage-news");
  return { success: true };
}

export async function toggleNewsStatus(newsId: number, active: boolean) {
  await requireStaff();
  await db
    .update(news)
    .set({ status: active ? 1 : -1 })
    .where(eq(news.newsId, newsId));
  revalidatePath("/manage-news");
}
