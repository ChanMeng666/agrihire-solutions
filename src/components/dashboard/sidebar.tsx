"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  LogOut as LogOutIcon,
  Package,
  Layers,
  Warehouse,
  Tag,
  Newspaper,
  MessageSquare,
  BarChart3,
  Store,
  Users,
  UserCog,
  Tractor,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/checkout", label: "Checkout", icon: LogOutIcon },
  { href: "/returns", label: "Returns", icon: Tractor },
];

const MANAGE_NAV = [
  { href: "/equipment", label: "Equipment", icon: Package },
  { href: "/products", label: "Products", icon: Layers },
  { href: "/categories", label: "Categories", icon: Warehouse },
  { href: "/inventory", label: "Inventory", icon: Warehouse },
  { href: "/manage-promotions", label: "Promotions", icon: Tag },
  { href: "/manage-news", label: "News", icon: Newspaper },
  { href: "/manage-messages", label: "Messages", icon: MessageSquare },
];

const ADMIN_NAV = [
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/stores", label: "Stores", icon: Store },
  { href: "/admin/staff", label: "Staff", icon: UserCog },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export function DashboardSidebar({
  userRole,
}: {
  userRole: string;
}) {
  const pathname = usePathname();
  const isManager = ["lmgr", "nmgr", "admin"].includes(userRole);
  const isAdmin = ["nmgr", "admin"].includes(userRole);

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-sidebar min-h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Operations
          </p>
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Management
          </p>
          {MANAGE_NAV.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </div>

        {isManager && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {isAdmin ? "Administration" : "Reports"}
              </p>
              {ADMIN_NAV.filter((item) => {
                if (item.href === "/reports") return true;
                return isAdmin;
              }).map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname.startsWith(item.href)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
