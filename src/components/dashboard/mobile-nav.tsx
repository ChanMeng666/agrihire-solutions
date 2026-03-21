"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Menu,
} from "lucide-react";

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

export function MobileDashboardNav({ userRole }: { userRole: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isManager = ["lmgr", "nmgr", "admin"].includes(userRole);
  const isAdmin = ["nmgr", "admin"].includes(userRole);

  function NavLink({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
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

  return (
    <div className="lg:hidden border-b px-4 py-2 flex items-center gap-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="overflow-y-auto py-6 px-4">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Operations
            </p>
            {MAIN_NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}

            <Separator className="my-4" />

            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Management
            </p>
            {MANAGE_NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}

            {isManager && (
              <>
                <Separator className="my-4" />
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {isAdmin ? "Administration" : "Reports"}
                </p>
                {ADMIN_NAV.filter((item) => {
                  if (item.href === "/reports") return true;
                  return isAdmin;
                }).map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <span className="text-sm font-medium text-muted-foreground">
        {MAIN_NAV.find((n) => pathname.startsWith(n.href))?.label ||
          MANAGE_NAV.find((n) => pathname.startsWith(n.href))?.label ||
          ADMIN_NAV.find((n) => pathname.startsWith(n.href))?.label ||
          "Dashboard"}
      </span>
    </div>
  );
}
