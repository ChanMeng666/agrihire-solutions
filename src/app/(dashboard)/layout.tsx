import { requireStaff } from "@/lib/auth-utils";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

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
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
