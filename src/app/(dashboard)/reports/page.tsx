import { requireManager } from "@/lib/auth-utils";
import { getRevenueByMonth, getBookingsByCategory } from "@/server/queries/dashboard";
import { getStaffContext } from "@/lib/user-context";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";

export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const session = await requireManager();

  const ctx = await getStaffContext();
  const storeId = ctx?.storeId;

  const [revenue, categories] = await Promise.all([
    storeId ? getRevenueByMonth(storeId, 12) : [],
    storeId ? getBookingsByCategory(storeId) : [],
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenue} />
        <CategoryChart data={categories} />
      </div>
    </div>
  );
}
