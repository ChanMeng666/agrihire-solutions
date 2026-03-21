import { db } from "@/lib/db";
import { eq, sql, desc } from "drizzle-orm";
import { store, staff, customer, user, storeHour } from "../../../drizzle/schema";

export async function getAllStores() {
  return db
    .select({
      storeId: store.storeId,
      storeName: store.storeName,
      phone: store.phone,
      email: store.email,
      city: store.city,
      status: store.status,
      managerName: sql<string>`(
        SELECT s.first_name || ' ' || s.last_name
        FROM staff s
        WHERE s.staff_id = ${store.managerId}
      )`,
    })
    .from(store)
    .orderBy(store.storeName);
}

export async function getAllStaff() {
  return db
    .select({
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      position: staff.position,
      phone: staff.phone,
      storeName: sql<string>`(SELECT store_name FROM store WHERE store_id = ${staff.storeId})`,
      email: sql<string>`(SELECT email FROM "user" WHERE user_id = ${staff.userId})`,
      role: sql<string>`(SELECT role FROM "user" WHERE user_id = ${staff.userId})`,
      isActive: sql<number>`(SELECT is_active FROM "user" WHERE user_id = ${staff.userId})`,
    })
    .from(staff)
    .orderBy(staff.lastName);
}

export async function getAllCustomers() {
  return db
    .select({
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      city: customer.city,
      email: sql<string>`(SELECT email FROM "user" WHERE user_id = ${customer.userId})`,
      isActive: sql<number>`(SELECT is_active FROM "user" WHERE user_id = ${customer.userId})`,
      storeName: sql<string>`(SELECT store_name FROM store WHERE store_id = ${customer.myStore})`,
      bookingCount: sql<number>`(SELECT count(*) FROM booking WHERE customer_id = ${customer.customerId})`,
    })
    .from(customer)
    .orderBy(customer.lastName);
}
