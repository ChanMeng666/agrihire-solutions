import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { getBookingDetail } from "@/server/queries/bookings";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calendar, MapPin, DollarSign } from "lucide-react";

export const metadata = { title: "Booking Detail" };

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAuth();
  const userId = Number(session.user.id);

  const customerResult = await db.execute(
    sql`SELECT customer_id FROM customer WHERE user_id = ${userId}`
  );
  const customerId = (customerResult as unknown as Array<{ customer_id: number }>)[0]?.customer_id;
  if (!customerId) notFound();

  const booking = await getBookingDetail(Number(id), customerId);
  if (!booking) notFound();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/my-bookings">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
      </Link>

      {/* Booking Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Booking #{booking.bookingId}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(booking.createDate).toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {booking.storeName}
            </span>
          </div>
        </div>
        <Badge
          variant={booking.status === 1 ? "default" : "destructive"}
          className="text-sm px-3 py-1"
        >
          {booking.status === 1 ? "Active" : "Cancelled"}
        </Badge>
      </div>

      {/* Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Hired Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booking.items.map((item) => (
                <TableRow key={item.bookingItemId}>
                  <TableCell className="font-medium">{item.lineNum}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        SN: {item.machineSn}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <p>
                      {new Date(item.hireFrom).toLocaleDateString("en-NZ")}
                    </p>
                    <p className="text-muted-foreground">
                      to {new Date(item.hireTo).toLocaleDateString("en-NZ")}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">${item.hireRate}/day</TableCell>
                  <TableCell className="text-center">
                    {item.returnTime ? (
                      <Badge variant="secondary">Returned</Badge>
                    ) : item.checkoutTime ? (
                      <Badge className="bg-amber-100 text-amber-800 border-0">
                        Checked Out
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {booking.payments.map((p) => (
              <div key={p.paymentId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Payment on{" "}
                  {new Date(p.createDate).toLocaleDateString("en-NZ")}
                </span>
                <span className="font-medium">${p.amount}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">${booking.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {booking.note && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span>{" "}
              {booking.note}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
