import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCartItemCount } from "@/server/queries/cart";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ count: 0 });
    }

    const userId = Number(session.user.id);
    const customerResult = await db.execute(
      sql`SELECT customer_id FROM customer WHERE user_id = ${userId}`
    );
    const customerId = (customerResult as unknown as Array<{ customer_id: number }>)[0]?.customer_id;

    if (!customerId) {
      return NextResponse.json({ count: 0 });
    }

    const count = await getCartItemCount(customerId);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
