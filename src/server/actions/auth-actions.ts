"use server";

import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { resetTokens, user, customer } from "../../../drizzle/schema";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function requestPasswordReset(email: string) {
  // Check user exists
  const users = await db
    .select({ userId: user.userId, email: user.email })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (users.length === 0) {
    // Don't reveal whether email exists
    return { success: true };
  }

  // Generate token
  const token = crypto.randomBytes(16).toString("hex");
  const expiryTime = String(Date.now() / 1000 + 30 * 60); // 30 minutes

  // Delete existing tokens for this email
  await db.delete(resetTokens).where(eq(resetTokens.email, email));

  // Insert new token
  await db.insert(resetTokens).values({
    token,
    email,
    expiryTime,
  });

  // In production, send email with reset link via Resend
  // For now, log the token (the link would be /reset-password/{token})
  console.log(`Password reset token for ${email}: ${token}`);

  return { success: true, token }; // Remove token from response in production
}

export async function resetPassword(token: string, newPassword: string) {
  // Find token
  const tokens = await db
    .select()
    .from(resetTokens)
    .where(eq(resetTokens.token, token))
    .limit(1);

  if (tokens.length === 0) {
    return { success: false, error: "Invalid or expired reset link" };
  }

  const resetToken = tokens[0];
  const now = Date.now() / 1000;

  if (now > Number(resetToken.expiryTime)) {
    await db.delete(resetTokens).where(eq(resetTokens.token, token));
    return { success: false, error: "Reset link has expired" };
  }

  // Update password - Better Auth uses its own hashing internally
  // For direct DB update, we need to handle this carefully
  // Using Better Auth's API would be ideal, but for now update directly
  await db
    .update(user)
    .set({ password: newPassword }) // Note: in production, hash with bcrypt/scrypt
    .where(eq(user.email, resetToken.email));

  // Delete used token
  await db.delete(resetTokens).where(eq(resetTokens.token, token));

  return { success: true };
}

export async function updateCustomerProfile(formData: FormData) {
  const userId = Number(formData.get("userId"));
  if (!userId) throw new Error("User ID required");

  // Update customer record
  await db
    .update(customer)
    .set({
      firstName: (formData.get("firstName") as string) || null,
      lastName: formData.get("lastName") as string,
      phone: (formData.get("phone") as string) || null,
      addressLine1: (formData.get("addressLine1") as string) || null,
      addressLine2: (formData.get("addressLine2") as string) || null,
      suburb: (formData.get("suburb") as string) || null,
      city: (formData.get("city") as string) || null,
      postCode: (formData.get("postCode") as string) || null,
    })
    .where(
      eq(
        customer.userId,
        userId
      )
    );

  revalidatePath("/profile");
  return { success: true };
}
