"use server";

import { db } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import {
  booking,
  bookingItem,
  hireRecord,
  payment,
  cart,
  cartItem,
  machine,
} from "../../../drizzle/schema";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

/**
 * Translates the MySQL process_booking stored procedure to a Drizzle transaction.
 * Checks availability, creates booking, assigns machines, calculates total,
 * creates payment and hire records, then clears the cart.
 */
export async function processBooking(
  cartId: number,
  customerId: number,
  storeId: number,
  note: string
) {
  await requireAuth();

  // Use raw SQL for the complex transactional logic
  // This mirrors the original MySQL stored procedure
  const result = await db.transaction(async (tx) => {
    // Step 1: Check availability for all cart items
    const availabilityCheck = await tx.execute(sql`
      SELECT ci.product_code, ci.hire_from, ci.hire_to, ci.qty AS needed_qty,
             COUNT(m.machine_id) FILTER (WHERE bi.machine_id IS NULL) AS available_qty
      FROM cart_item ci
      LEFT JOIN machine m ON ci.product_code = m.product_code AND m.store_id = ${storeId}
      LEFT JOIN booking_item bi ON m.machine_id = bi.machine_id
          AND bi.hire_from < ci.hire_to AND bi.hire_to > ci.hire_from
      WHERE ci.cart_id = ${cartId}
      GROUP BY ci.product_code, ci.hire_from, ci.hire_to, ci.qty
      HAVING COUNT(m.machine_id) FILTER (WHERE bi.machine_id IS NULL) >= ci.qty
    `);

    // Count cart items
    const cartCountResult = await tx.execute(sql`
      SELECT COUNT(*) as count FROM cart_item WHERE cart_id = ${cartId}
    `);
    const cartCount = Number(
      (cartCountResult as unknown as Array<{ count: number }>)[0]?.count ?? 0
    );
    const availableCount = (availabilityCheck as unknown as Array<unknown>).length;

    if (availableCount !== cartCount) {
      throw new Error("Some items are no longer available for the selected dates");
    }

    // Step 2: Create booking
    const [newBooking] = await tx
      .insert(booking)
      .values({
        customerId,
        storeId,
        createDate: new Date(),
        note,
        status: 1,
      })
      .returning();

    const bookingId = newBooking.bookingId;

    // Step 3: Assign machines to booking items using ROW_NUMBER
    await tx.execute(sql`
      INSERT INTO booking_item (booking_id, machine_id, line_num, hire_rate, hire_from, hire_to)
      SELECT ${bookingId}, machine_id, ROW_NUMBER() OVER (ORDER BY hire_from, product_code), hire_rate, hire_from, hire_to
      FROM (
        SELECT
          ci.product_code,
          m.machine_id,
          ci.hire_rate * (1 - COALESCE(ci.disc_rate, 0) / 100) AS hire_rate,
          ci.hire_from,
          ci.hire_to,
          ci.qty,
          ROW_NUMBER() OVER (PARTITION BY ci.product_code, ci.hire_from ORDER BY m.machine_id) AS row_num
        FROM cart_item ci
        LEFT JOIN machine m ON ci.product_code = m.product_code AND m.store_id = ${storeId}
        LEFT JOIN booking_item bi ON m.machine_id = bi.machine_id
            AND bi.hire_from < ci.hire_to AND bi.hire_to > ci.hire_from
        WHERE ci.cart_id = ${cartId}
          AND bi.machine_id IS NULL
      ) AS subquery
      WHERE row_num <= qty
    `);

    // Step 4: Calculate total
    await tx.execute(sql`
      UPDATE booking
      SET total = (
        SELECT SUM(CEIL(EXTRACT(DAY FROM (bi.hire_to - bi.hire_from))) * bi.hire_rate)
        FROM booking_item bi
        WHERE bi.booking_id = ${bookingId}
      )
      WHERE booking_id = ${bookingId}
    `);

    // Step 5: Create payment record
    await tx.execute(sql`
      INSERT INTO payment (booking_id, create_date, amount)
      SELECT ${bookingId}, now(), total
      FROM booking
      WHERE booking_id = ${bookingId}
    `);

    // Step 6: Create hire records
    await tx.execute(sql`
      INSERT INTO hire_record (booking_item_id)
      SELECT booking_item_id
      FROM booking_item
      WHERE booking_id = ${bookingId}
    `);

    // Step 7: Clear cart
    await tx.execute(sql`DELETE FROM cart_item WHERE cart_id = ${cartId}`);
    await tx.execute(
      sql`UPDATE cart SET promo_code = NULL WHERE cart_id = ${cartId}`
    );

    return bookingId;
  });

  revalidatePath("/my-bookings");
  revalidatePath("/cart");
  return { success: true, bookingId: result };
}

export async function cancelBooking(bookingId: number, customerId: number) {
  await requireAuth();

  await db
    .update(booking)
    .set({ status: -1 })
    .where(
      and(eq(booking.bookingId, bookingId), eq(booking.customerId, customerId))
    );

  revalidatePath("/my-bookings");
}
