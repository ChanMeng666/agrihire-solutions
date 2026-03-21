"use server";

import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { product, machine, category, service } from "../../../drizzle/schema";
import { requireStaff } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  await requireStaff();

  const data = {
    productCode: formData.get("productCode") as string,
    categoryCode: formData.get("categoryCode") as string,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    specs: (formData.get("specs") as string) || null,
    priceA: formData.get("priceA") as string,
    qtyBreakA: Number(formData.get("qtyBreakA") || 0),
    priceB: (formData.get("priceB") as string) || null,
    qtyBreakB: Number(formData.get("qtyBreakB") || 168) || null,
    priceC: (formData.get("priceC") as string) || null,
    qtyBreakC: Number(formData.get("qtyBreakC") || 600) || null,
    minHire: Number(formData.get("minHire") || 0) || null,
    maxHire: Number(formData.get("maxHire") || 0) || null,
    image: (formData.get("image") as string) || null,
  };

  await db.insert(product).values(data);
  revalidatePath("/products");
  return { success: true };
}

export async function updateProduct(productCode: string, formData: FormData) {
  await requireStaff();

  await db
    .update(product)
    .set({
      name: formData.get("name") as string,
      categoryCode: formData.get("categoryCode") as string,
      description: (formData.get("description") as string) || null,
      specs: (formData.get("specs") as string) || null,
      priceA: formData.get("priceA") as string,
      qtyBreakA: Number(formData.get("qtyBreakA") || 0),
      priceB: (formData.get("priceB") as string) || null,
      qtyBreakB: Number(formData.get("qtyBreakB") || 168) || null,
      priceC: (formData.get("priceC") as string) || null,
      qtyBreakC: Number(formData.get("qtyBreakC") || 600) || null,
      minHire: Number(formData.get("minHire") || 0) || null,
      maxHire: Number(formData.get("maxHire") || 0) || null,
      image: (formData.get("image") as string) || null,
    })
    .where(eq(product.productCode, productCode));

  revalidatePath("/products");
  revalidatePath(`/products/${productCode}`);
  return { success: true };
}

export async function toggleProductStatus(productCode: string, active: boolean) {
  await requireStaff();
  await db
    .update(product)
    .set({ status: active ? 1 : -1 })
    .where(eq(product.productCode, productCode));
  revalidatePath("/products");
}

export async function createMachine(formData: FormData) {
  await requireStaff();

  await db.insert(machine).values({
    sn: formData.get("sn") as string,
    productCode: formData.get("productCode") as string,
    storeId: Number(formData.get("storeId")),
    purchaseDate: (formData.get("purchaseDate") as string) || null,
    cost: (formData.get("cost") as string) || null,
    note: (formData.get("note") as string) || null,
  });

  revalidatePath("/equipment");
  return { success: true };
}

export async function updateMachineStatus(machineId: number, status: number) {
  await requireStaff();
  await db.update(machine).set({ status }).where(eq(machine.machineId, machineId));
  revalidatePath("/equipment");
}

export async function createCategory(formData: FormData) {
  await requireStaff();

  await db.insert(category).values({
    categoryCode: formData.get("categoryCode") as string,
    name: formData.get("name") as string,
  });

  revalidatePath("/categories");
  return { success: true };
}

export async function updateCategory(categoryCode: string, formData: FormData) {
  await requireStaff();

  await db
    .update(category)
    .set({ name: formData.get("name") as string })
    .where(eq(category.categoryCode, categoryCode));

  revalidatePath("/categories");
  return { success: true };
}

export async function toggleCategoryStatus(categoryCode: string, active: boolean) {
  await requireStaff();
  await db
    .update(category)
    .set({ status: active ? 1 : -1 })
    .where(eq(category.categoryCode, categoryCode));
  revalidatePath("/categories");
}

export async function addServiceRecord(formData: FormData) {
  await requireStaff();

  await db.insert(service).values({
    machineId: Number(formData.get("machineId")),
    serviceDate: formData.get("serviceDate") as string,
    serviceName: formData.get("serviceName") as string,
    note: (formData.get("note") as string) || null,
  });

  revalidatePath("/equipment");
  return { success: true };
}
