"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tractor,
  Menu,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Store,
  Tag,
  Newspaper,
  Phone,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/for-hire", label: "Equipment", icon: Tractor },
  { href: "/stores", label: "Stores", icon: Store },
  { href: "/promotions", label: "Promotions", icon: Tag },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/contact", label: "Contact", icon: Phone },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userRole = (session?.user as Record<string, unknown> | undefined)
    ?.role as string | undefined;
  const isStaff =
    userRole === "staff" ||
    userRole === "lmgr" ||
    userRole === "nmgr" ||
    userRole === "admin";

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Tractor className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">AgriHire</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {session ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <CartBadge />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="relative h-9 w-9 rounded-full cursor-pointer focus:outline-none"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">
                        {session.user.name || session.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isStaff && (
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {!isStaff && (
                    <>
                      <DropdownMenuItem>
                        <Link href="/my-bookings" className="flex items-center w-full">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/messages" className="flex items-center w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Messages
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-1 mt-8">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                {!session && (
                  <>
                    <div className="my-2 border-t" />
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/cart/count")
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, []);

  if (count <= 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}
