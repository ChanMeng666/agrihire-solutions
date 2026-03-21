import { requireStaff } from "@/lib/auth-utils";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileDashboardNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaff();
  const userRole = (session.user as Record<string, unknown>).role as string;

  return (
    <div className="flex">
      <DashboardSidebar userRole={userRole} />
      <div className="flex-1 min-h-[calc(100vh-4rem)]">
        <MobileDashboardNav userRole={userRole} />
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
