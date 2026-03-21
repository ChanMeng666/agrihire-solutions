import { NextResponse } from "next/server";
import { getCustomerContext } from "@/lib/user-context";
import { getCartItemCount } from "@/server/queries/cart";

export async function GET() {
  try {
    const ctx = await getCustomerContext();
    if (!ctx) return NextResponse.json({ count: 0 });

    const count = await getCartItemCount(ctx.customerId);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
