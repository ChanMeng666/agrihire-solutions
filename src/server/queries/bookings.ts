import { db } from "@/lib/db";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  booking,
  bookingItem,
  hireRecord,
  machine,
  product,
  store,
  customer,
  payment,
  staff,
} from "../../../drizzle/schema";

export async function getBookingsByCustomer(customerId: number) {
  return db
    .select({
      bookingId: booking.bookingId,
      createDate: booking.createDate,
      total: booking.total,
      note: booking.note,
      status: booking.status,
      storeName: store.storeName,
      itemCount: sql<number>`count(${bookingItem.bookingItemId})`,
    })
    .from(booking)
    .innerJoin(store, eq(booking.storeId, store.storeId))
    .leftJoin(bookingItem, eq(booking.bookingId, bookingItem.bookingId))
    .where(eq(booking.customerId, customerId))
    .groupBy(
      booking.bookingId,
      booking.createDate,
      booking.total,
      booking.note,
      booking.status,
      store.storeName
    )
    .orderBy(desc(booking.createDate));
}

export async function getBookingDetail(bookingId: number, customerId: number) {
  const bookingResult = await db
    .select({
      bookingId: booking.bookingId,
      createDate: booking.createDate,
      total: booking.total,
      note: booking.note,
      status: booking.status,
      storeName: store.storeName,
      storeId: booking.storeId,
    })
    .from(booking)
    .innerJoin(store, eq(booking.storeId, store.storeId))
    .where(
      and(eq(booking.bookingId, bookingId), eq(booking.customerId, customerId))
    )
    .limit(1);

  if (bookingResult.length === 0) return null;

  const items = await db
    .select({
      bookingItemId: bookingItem.bookingItemId,
      lineNum: bookingItem.lineNum,
      hireRate: bookingItem.hireRate,
      hireFrom: bookingItem.hireFrom,
      hireTo: bookingItem.hireTo,
      itemStatus: bookingItem.status,
      machineSn: machine.sn,
      productName: product.name,
      productCode: product.productCode,
      checkoutTime: hireRecord.checkoutTime,
      returnTime: hireRecord.returnTime,
    })
    .from(bookingItem)
    .innerJoin(machine, eq(bookingItem.machineId, machine.machineId))
    .innerJoin(product, eq(machine.productCode, product.productCode))
    .leftJoin(
      hireRecord,
      eq(bookingItem.bookingItemId, hireRecord.bookingItemId)
    )
    .where(eq(bookingItem.bookingId, bookingId))
    .orderBy(bookingItem.lineNum);

  const payments = await db
    .select()
    .from(payment)
    .where(eq(payment.bookingId, bookingId));

  return {
    ...bookingResult[0],
    items,
    payments,
  };
}

export async function getBookingsByStore(storeId: number) {
  return db
    .select({
      bookingId: booking.bookingId,
      createDate: booking.createDate,
      total: booking.total,
      note: booking.note,
      status: booking.status,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      customerPhone: customer.phone,
      itemCount: sql<number>`count(${bookingItem.bookingItemId})`,
    })
    .from(booking)
    .innerJoin(customer, eq(booking.customerId, customer.customerId))
    .leftJoin(bookingItem, eq(booking.bookingId, bookingItem.bookingId))
    .where(eq(booking.storeId, storeId))
    .groupBy(
      booking.bookingId,
      booking.createDate,
      booking.total,
      booking.note,
      booking.status,
      customer.firstName,
      customer.lastName,
      customer.phone
    )
    .orderBy(desc(booking.createDate));
}

export async function getTodayReturns(storeId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db
    .select({
      bookingItemId: bookingItem.bookingItemId,
      bookingId: bookingItem.bookingId,
      hireTo: bookingItem.hireTo,
      hireRate: bookingItem.hireRate,
      machineSn: machine.sn,
      productName: product.name,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      returnTime: hireRecord.returnTime,
    })
    .from(bookingItem)
    .innerJoin(booking, eq(bookingItem.bookingId, booking.bookingId))
    .innerJoin(machine, eq(bookingItem.machineId, machine.machineId))
    .innerJoin(product, eq(machine.productCode, product.productCode))
    .innerJoin(customer, eq(booking.customerId, customer.customerId))
    .leftJoin(
      hireRecord,
      eq(bookingItem.bookingItemId, hireRecord.bookingItemId)
    )
    .where(
      and(
        eq(booking.storeId, storeId),
        sql`${bookingItem.hireTo} >= ${today}`,
        sql`${bookingItem.hireTo} < ${tomorrow}`
      )
    )
    .orderBy(bookingItem.hireTo);
}
