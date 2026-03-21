"use server";

import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { hireRecord, bookingItem, machine } from "../../../drizzle/schema";
import { requireStaff } from "@/lib/auth-utils";
import { requireStaffContext } from "@/lib/user-context";
import { revalidatePath } from "next/cache";

export async function checkoutEquipment(bookingItemId: number) {
  await requireStaff();
  const { staffId } = await requireStaffContext();

  // Update hire record with checkout info
  await db
    .update(hireRecord)
    .set({
      checkoutTime: new Date(),
      checkoutStaff: staffId,
    })
    .where(eq(hireRecord.bookingItemId, bookingItemId));

  // Update machine status to 'hired' (2)
  const item = await db
    .select({ machineId: bookingItem.machineId })
    .from(bookingItem)
    .where(eq(bookingItem.bookingItemId, bookingItemId))
    .limit(1);

  if (item[0]) {
    await db
      .update(machine)
      .set({ status: 2 })
      .where(eq(machine.machineId, item[0].machineId));
  }

  revalidatePath("/checkout");
  revalidatePath("/dashboard");
}

export async function returnEquipment(
  bookingItemId: number,
  note?: string
) {
  await requireStaff();
  const { staffId } = await requireStaffContext();

  // Update hire record with return info
  await db
    .update(hireRecord)
    .set({
      returnTime: new Date(),
      returnStaff: staffId,
      ...(note ? { note } : {}),
    })
    .where(eq(hireRecord.bookingItemId, bookingItemId));

  // Update machine status to 'available' (1)
  const item = await db
    .select({ machineId: bookingItem.machineId })
    .from(bookingItem)
    .where(eq(bookingItem.bookingItemId, bookingItemId))
    .limit(1);

  if (item[0]) {
    await db
      .update(machine)
      .set({ status: 1 })
      .where(eq(machine.machineId, item[0].machineId));
  }

  revalidatePath("/returns");
  revalidatePath("/checkout");
  revalidatePath("/dashboard");
}

export async function getPendingCheckouts(storeId: number) {
  return db.execute(sql`
    SELECT
      bi.booking_item_id,
      bi.booking_id,
      bi.hire_from,
      bi.hire_to,
      bi.hire_rate,
      m.sn AS machine_sn,
      m.machine_id,
      p.name AS product_name,
      c.first_name AS customer_first_name,
      c.last_name AS customer_last_name,
      c.phone AS customer_phone,
      hr.checkout_time,
      hr.return_time
    FROM booking_item bi
    INNER JOIN booking b ON bi.booking_id = b.booking_id
    INNER JOIN machine m ON bi.machine_id = m.machine_id
    INNER JOIN product p ON m.product_code = p.product_code
    INNER JOIN customer c ON b.customer_id = c.customer_id
    LEFT JOIN hire_record hr ON bi.booking_item_id = hr.booking_item_id
    WHERE b.store_id = ${storeId}
      AND b.status = 1
      AND hr.checkout_time IS NULL
      AND bi.hire_from <= now() + interval '1 day'
    ORDER BY bi.hire_from ASC
  `);
}

export async function getCheckedOutItems(storeId: number) {
  return db.execute(sql`
    SELECT
      bi.booking_item_id,
      bi.booking_id,
      bi.hire_from,
      bi.hire_to,
      bi.hire_rate,
      m.sn AS machine_sn,
      m.machine_id,
      p.name AS product_name,
      c.first_name AS customer_first_name,
      c.last_name AS customer_last_name,
      c.phone AS customer_phone,
      hr.checkout_time,
      hr.return_time
    FROM booking_item bi
    INNER JOIN booking b ON bi.booking_id = b.booking_id
    INNER JOIN machine m ON bi.machine_id = m.machine_id
    INNER JOIN product p ON m.product_code = p.product_code
    INNER JOIN customer c ON b.customer_id = c.customer_id
    LEFT JOIN hire_record hr ON bi.booking_item_id = hr.booking_item_id
    WHERE b.store_id = ${storeId}
      AND b.status = 1
      AND hr.checkout_time IS NOT NULL
      AND hr.return_time IS NULL
    ORDER BY bi.hire_to ASC
  `);
}
