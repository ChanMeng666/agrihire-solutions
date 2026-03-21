import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export type UserRole = "customer" | "staff" | "lmgr" | "nmgr" | "admin";

const STAFF_ROLES: UserRole[] = ["staff", "lmgr", "nmgr", "admin"];
const MANAGER_ROLES: UserRole[] = ["lmgr", "nmgr", "admin"];

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const userRole = (session.user as Record<string, unknown>).role as UserRole;
  if (!allowedRoles.includes(userRole)) {
    redirect("/");
  }
  return session;
}

export async function requireStaff() {
  return requireRole(STAFF_ROLES);
}

export async function requireManager() {
  return requireRole(MANAGER_ROLES);
}

export async function requireAdmin() {
  return requireRole(["admin"]);
}

export function isStaffRole(role: string): boolean {
  return STAFF_ROLES.includes(role as UserRole);
}

export function isManagerRole(role: string): boolean {
  return MANAGER_ROLES.includes(role as UserRole);
}
