import { db } from "./db";
import { eq } from "drizzle-orm";
import { customer, staff } from "../../drizzle/schema";
import { getServerSession } from "./auth-utils";

interface CustomerContext {
  userId: number;
  customerId: number;
}

interface StaffContext {
  userId: number;
  staffId: number;
  storeId: number | null;
}

export async function getCustomerContext(): Promise<CustomerContext | null> {
  const session = await getServerSession();
  if (!session) return null;

  const userId = Number(session.user.id);
  const result = await db
    .select({ customerId: customer.customerId })
    .from(customer)
    .where(eq(customer.userId, userId))
    .limit(1);

  if (result.length === 0) return null;
  return { userId, customerId: result[0].customerId };
}

export async function getStaffContext(): Promise<StaffContext | null> {
  const session = await getServerSession();
  if (!session) return null;

  const userId = Number(session.user.id);
  const result = await db
    .select({
      staffId: staff.staffId,
      storeId: staff.storeId,
    })
    .from(staff)
    .where(eq(staff.userId, userId))
    .limit(1);

  if (result.length === 0) return null;
  return { userId, staffId: result[0].staffId, storeId: result[0].storeId };
}

export async function requireCustomerContext(): Promise<CustomerContext> {
  const ctx = await getCustomerContext();
  if (!ctx) throw new Error("Customer profile not found");
  return ctx;
}

export async function requireStaffContext(): Promise<StaffContext> {
  const ctx = await getStaffContext();
  if (!ctx) throw new Error("Staff profile not found");
  return ctx;
}
