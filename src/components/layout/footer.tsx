import Link from "next/link";
import { Tractor } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Tractor className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">AgriHire</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              New Zealand&apos;s trusted agricultural equipment hire service.
              Quality machinery for farms of all sizes.
            </p>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Equipment</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/for-hire" className="hover:text-foreground transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="hover:text-foreground transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-foreground transition-colors">
                  Our Stores
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-foreground transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-foreground transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AgriHire Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Agricultural Equipment Hire &mdash; New Zealand
          </p>
        </div>
      </div>
    </footer>
  );
}
