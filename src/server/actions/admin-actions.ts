"use server";

import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { store, storeHour, staff, customer, user } from "../../../drizzle/schema";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { hashPassword } from "better-auth/crypto";

// ============================================================
// Store CRUD
// ============================================================

export async function createStore(formData: FormData) {
  await requireAdmin();

  const [newStore] = await db
    .insert(store)
    .values({
      storeName: formData.get("storeName") as string,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      addressLine1: (formData.get("addressLine1") as string) || null,
      addressLine2: (formData.get("addressLine2") as string) || null,
      suburb: (formData.get("suburb") as string) || null,
      city: (formData.get("city") as string) || null,
      postCode: (formData.get("postCode") as string) || null,
      lng: (formData.get("lng") as string) || null,
      lat: (formData.get("lat") as string) || null,
    })
    .returning();

  // Add default store hours (Mon-Fri 6:00-17:00, Sat 7:00-12:00)
  const defaultHours = [
    { weekDay: 1, open: "06:00", close: "17:00" },
    { weekDay: 2, open: "06:00", close: "17:00" },
    { weekDay: 3, open: "06:00", close: "17:00" },
    { weekDay: 4, open: "06:00", close: "17:00" },
    { weekDay: 5, open: "06:00", close: "17:00" },
    { weekDay: 6, open: "07:00", close: "12:00" },
  ];

  for (const h of defaultHours) {
    await db.insert(storeHour).values({
      storeId: newStore.storeId,
      weekDay: h.weekDay,
      openTime: h.open,
      closeTime: h.close,
    });
  }

  revalidatePath("/admin/stores");
  return { success: true, storeId: newStore.storeId };
}

export async function updateStore(storeId: number, formData: FormData) {
  await requireAdmin();

  await db
    .update(store)
    .set({
      storeName: formData.get("storeName") as string,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      addressLine1: (formData.get("addressLine1") as string) || null,
      addressLine2: (formData.get("addressLine2") as string) || null,
      suburb: (formData.get("suburb") as string) || null,
      city: (formData.get("city") as string) || null,
      postCode: (formData.get("postCode") as string) || null,
      lng: (formData.get("lng") as string) || null,
      lat: (formData.get("lat") as string) || null,
    })
    .where(eq(store.storeId, storeId));

  revalidatePath("/admin/stores");
  return { success: true };
}

export async function toggleStoreStatus(storeId: number, active: boolean) {
  await requireAdmin();
  await db
    .update(store)
    .set({ status: active ? 1 : -1 })
    .where(eq(store.storeId, storeId));
  revalidatePath("/admin/stores");
}

// ============================================================
// Staff CRUD
// ============================================================

export async function createStaff(formData: FormData) {
  await requireAdmin();

  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const tempPassword = crypto.randomBytes(16).toString("base64url");
  const hashedPassword = await hashPassword(tempPassword);

  // Create user account
  const [newUser] = await db
    .insert(user)
    .values({
      email,
      password: hashedPassword,
      role: role as "staff" | "lmgr" | "nmgr" | "admin",
    })
    .returning();

  // Create staff profile
  await db.insert(staff).values({
    userId: newUser.userId,
    storeId: Number(formData.get("storeId")) || null,
    firstName: (formData.get("firstName") as string) || null,
    lastName: formData.get("lastName") as string,
    position: (formData.get("position") as string) || null,
    phone: (formData.get("phone") as string) || null,
  });

  revalidatePath("/admin/staff");
  return { success: true, tempPassword: tempPassword };
}

export async function updateStaffRole(staffId: number, role: string) {
  await requireAdmin();

  const staffResult = await db
    .select({ userId: staff.userId })
    .from(staff)
    .where(eq(staff.staffId, staffId))
    .limit(1);

  if (staffResult[0]) {
    await db
      .update(user)
      .set({ role: role as "staff" | "lmgr" | "nmgr" | "admin" })
      .where(eq(user.userId, staffResult[0].userId));
  }

  revalidatePath("/admin/staff");
}

export async function toggleUserActive(userId: number, active: boolean) {
  await requireAdmin();
  await db
    .update(user)
    .set({ isActive: active ? 1 : -1 })
    .where(eq(user.userId, userId));
  revalidatePath("/admin/staff");
  revalidatePath("/admin/customers");
}
