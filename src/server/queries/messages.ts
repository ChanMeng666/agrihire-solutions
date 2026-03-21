import { db } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { message, store } from "../../../drizzle/schema";

export async function getMessagesByCustomer(customerId: number) {
  return db
    .select({
      messageId: message.messageId,
      subject: message.subject,
      content: message.content,
      reply: message.reply,
      status: message.status,
      createDate: message.createDate,
      replyDate: message.replyDate,
      storeName: store.storeName,
      storeId: message.storeId,
    })
    .from(message)
    .innerJoin(store, eq(message.storeId, store.storeId))
    .where(eq(message.customerId, customerId))
    .orderBy(desc(message.createDate));
}

export async function getMessagesByStore(storeId: number) {
  return db
    .select()
    .from(message)
    .where(eq(message.storeId, storeId))
    .orderBy(desc(message.createDate));
}
