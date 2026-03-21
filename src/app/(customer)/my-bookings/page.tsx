import Link from "next/link";
import { getBookingsByCustomer } from "@/server/queries/bookings";
import { getCustomerContext } from "@/lib/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowRight } from "lucide-react";

export const metadata = { title: "My Bookings" };

function getStatusBadge(status: number) {
  if (status === 1)
    return <Badge className="bg-primary/10 text-primary border-0">Active</Badge>;
  if (status === -1)
    return <Badge variant="destructive">Cancelled</Badge>;
  return <Badge variant="secondary">Unknown</Badge>;
}

export default async function MyBookingsPage() {
  const ctx = await getCustomerContext();
  const bookings = ctx ? await getBookingsByCustomer(ctx.customerId) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">No bookings yet</p>
          <Link href="/for-hire">
            <Button>Browse Equipment</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {bookings.map((b) => (
            <Link key={b.bookingId} href={`/my-bookings/${b.bookingId}`}>
              <Card className="transition-all hover:shadow-md hover:border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          Booking #{b.bookingId}
                        </span>
                        {getStatusBadge(b.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {b.storeName} &bull;{" "}
                        {new Date(b.createDate).toLocaleDateString("en-NZ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {b.itemCount} item{b.itemCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">${b.total}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
