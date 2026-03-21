"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { message, notifications } from "../../../drizzle/schema";
import { requireStaff } from "@/lib/auth-utils";
import { requireCustomerContext } from "@/lib/user-context";
import { revalidatePath } from "next/cache";

export async function sendContactMessage(formData: FormData) {
  const { customerId } = await requireCustomerContext();

  const storeId = Number(formData.get("storeId"));
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  const [msg] = await db
    .insert(message)
    .values({
      customerId,
      storeId,
      subject,
      content,
      createDate: new Date(),
    })
    .returning();

  // Create notification for the store
  await db.insert(notifications).values({
    messageId: msg.messageId,
    storeId,
    isRead: false,
    createDate: new Date(),
  });

  revalidatePath("/messages");
  revalidatePath("/manage-messages");
  return { success: true };
}

export async function replyToMessage(messageId: number, reply: string) {
  await requireStaff();

  await db
    .update(message)
    .set({
      reply,
      replyDate: new Date(),
    })
    .where(eq(message.messageId, messageId));

  // Mark notification as read
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.messageId, messageId));

  revalidatePath("/manage-messages");
  return { success: true };
}
