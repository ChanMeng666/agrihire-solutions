import { requireStaff } from "@/lib/auth-utils";
import { getDashboardStats, getRevenueByMonth, getBookingsByCategory } from "@/server/queries/dashboard";
import { getStaffContext } from "@/lib/user-context";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await requireStaff();
  const ctx = await getStaffContext();
  const storeId = ctx?.storeId;

  if (!storeId) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
        <p className="text-muted-foreground">
          You are not assigned to a store. Please contact an administrator.
        </p>
      </div>
    );
  }

  const [stats, revenue, categories] = await Promise.all([
    getDashboardStats(storeId),
    getRevenueByMonth(storeId),
    getBookingsByCategory(storeId),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session.user.name || "Staff"}
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenue} />
        <CategoryChart data={categories} />
      </div>
    </div>
  );
}
