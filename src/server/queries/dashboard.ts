import { db } from "@/lib/db";
import { eq, and, sql, gte, lte, desc, count } from "drizzle-orm";
import {
  booking,
  bookingItem,
  hireRecord,
  machine,
  product,
  customer,
  payment,
  category,
  store,
  staff,
  message,
  notifications,
} from "../../../drizzle/schema";

export async function getDashboardStats(storeId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [activeBookings, todayCheckouts, todayReturns, monthRevenue, totalMachines, unreadMessages] =
    await Promise.all([
      // Active bookings
      db
        .select({ count: sql<number>`count(*)` })
        .from(booking)
        .where(and(eq(booking.storeId, storeId), eq(booking.status, 1))),

      // Today's checkouts (items due to start today)
      db
        .select({ count: sql<number>`count(*)` })
        .from(bookingItem)
        .innerJoin(booking, eq(bookingItem.bookingId, booking.bookingId))
        .where(
          and(
            eq(booking.storeId, storeId),
            sql`${bookingItem.hireFrom} >= ${today}`,
            sql`${bookingItem.hireFrom} < ${tomorrow}`
          )
        ),

      // Today's returns
      db
        .select({ count: sql<number>`count(*)` })
        .from(bookingItem)
        .innerJoin(booking, eq(bookingItem.bookingId, booking.bookingId))
        .where(
          and(
            eq(booking.storeId, storeId),
            sql`${bookingItem.hireTo} >= ${today}`,
            sql`${bookingItem.hireTo} < ${tomorrow}`
          )
        ),

      // Monthly revenue
      db
        .select({ total: sql<number>`coalesce(sum(${payment.amount}::numeric), 0)` })
        .from(payment)
        .innerJoin(booking, eq(payment.bookingId, booking.bookingId))
        .where(
          and(
            eq(booking.storeId, storeId),
            gte(payment.createDate, monthStart)
          )
        ),

      // Total machines
      db
        .select({ count: sql<number>`count(*)` })
        .from(machine)
        .where(eq(machine.storeId, storeId)),

      // Unread messages
      db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.storeId, storeId),
            eq(notifications.isRead, false)
          )
        ),
    ]);

  return {
    activeBookings: activeBookings[0]?.count ?? 0,
    todayCheckouts: todayCheckouts[0]?.count ?? 0,
    todayReturns: todayReturns[0]?.count ?? 0,
    monthRevenue: monthRevenue[0]?.total ?? 0,
    totalMachines: totalMachines[0]?.count ?? 0,
    unreadMessages: unreadMessages[0]?.count ?? 0,
  };
}

export async function getRevenueByMonth(storeId: number, months = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return db
    .select({
      month: sql<string>`to_char(${payment.createDate}, 'YYYY-MM')`,
      revenue: sql<number>`sum(${payment.amount}::numeric)`,
    })
    .from(payment)
    .innerJoin(booking, eq(payment.bookingId, booking.bookingId))
    .where(
      and(eq(booking.storeId, storeId), gte(payment.createDate, startDate))
    )
    .groupBy(sql`to_char(${payment.createDate}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${payment.createDate}, 'YYYY-MM')`);
}

export async function getBookingsByCategory(storeId: number) {
  return db
    .select({
      categoryName: category.name,
      count: sql<number>`count(${bookingItem.bookingItemId})`,
    })
    .from(bookingItem)
    .innerJoin(booking, eq(bookingItem.bookingId, booking.bookingId))
    .innerJoin(machine, eq(bookingItem.machineId, machine.machineId))
    .innerJoin(product, eq(machine.productCode, product.productCode))
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(eq(booking.storeId, storeId))
    .groupBy(category.name)
    .orderBy(desc(sql`count(${bookingItem.bookingItemId})`));
}

export async function getMachinesByStore(storeId: number) {
  return db
    .select({
      machineId: machine.machineId,
      sn: machine.sn,
      productName: product.name,
      categoryName: category.name,
      status: machine.status,
      photo: machine.photo,
      note: machine.note,
      purchaseDate: machine.purchaseDate,
      cost: machine.cost,
    })
    .from(machine)
    .innerJoin(product, eq(machine.productCode, product.productCode))
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .where(eq(machine.storeId, storeId))
    .orderBy(product.name, machine.sn);
}

export async function getAllProducts() {
  return db
    .select({
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      priceA: product.priceA,
      priceB: product.priceB,
      priceC: product.priceC,
      categoryName: category.name,
      categoryCode: product.categoryCode,
      image: product.image,
      status: product.status,
      machineCount: sql<number>`(SELECT count(*) FROM machine WHERE machine.product_code = ${product.productCode})`,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .orderBy(product.name);
}

export async function getAllCategories() {
  return db
    .select({
      categoryCode: category.categoryCode,
      name: category.name,
      status: category.status,
      productCount: sql<number>`(SELECT count(*) FROM product WHERE product.category_code = ${category.categoryCode})`,
    })
    .from(category)
    .orderBy(category.name);
}

export async function getStaffByStore(storeId: number) {
  return db
    .select({
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      position: staff.position,
      phone: staff.phone,
      email: sql<string>`(SELECT email FROM "user" WHERE user_id = ${staff.userId})`,
      role: sql<string>`(SELECT role FROM "user" WHERE user_id = ${staff.userId})`,
    })
    .from(staff)
    .where(eq(staff.storeId, storeId))
    .orderBy(staff.lastName);
}
