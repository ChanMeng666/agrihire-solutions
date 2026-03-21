import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import {
  booking,
  bookingItem,
  hireRecord,
  machine,
  product,
  customer,
  payment,
  store,
  staff,
} from "../../../../../drizzle/schema";
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
import { ArrowLeft, Calendar, MapPin, DollarSign, User } from "lucide-react";

export const metadata = { title: "Booking Detail" };

export default async function StaffBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const bookingId = Number(id);

  // Get booking info
  const bookingResult = await db
    .select({
      bookingId: booking.bookingId,
      createDate: booking.createDate,
      total: booking.total,
      note: booking.note,
      status: booking.status,
      storeName: store.storeName,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      customerEmail: sql<string>`(SELECT email FROM "user" WHERE user_id = ${customer.userId})`,
      customerPhone: customer.phone,
      customerAddress: sql<string>`COALESCE(${customer.addressLine1}, '') || ' ' || COALESCE(${customer.city}, '')`,
    })
    .from(booking)
    .innerJoin(store, eq(booking.storeId, store.storeId))
    .innerJoin(customer, eq(booking.customerId, customer.customerId))
    .where(eq(booking.bookingId, bookingId))
    .limit(1);

  if (bookingResult.length === 0) notFound();
  const b = bookingResult[0];

  // Get items with hire records
  const items = await db
    .select({
      bookingItemId: bookingItem.bookingItemId,
      lineNum: bookingItem.lineNum,
      hireRate: bookingItem.hireRate,
      hireFrom: bookingItem.hireFrom,
      hireTo: bookingItem.hireTo,
      itemStatus: bookingItem.status,
      machineSn: machine.sn,
      machineId: machine.machineId,
      productName: product.name,
      checkoutTime: hireRecord.checkoutTime,
      returnTime: hireRecord.returnTime,
      hireNote: hireRecord.note,
      checkoutStaffName: sql<string>`(SELECT first_name || ' ' || last_name FROM staff WHERE staff_id = ${hireRecord.checkoutStaff})`,
      returnStaffName: sql<string>`(SELECT first_name || ' ' || last_name FROM staff WHERE staff_id = ${hireRecord.returnStaff})`,
    })
    .from(bookingItem)
    .innerJoin(machine, eq(bookingItem.machineId, machine.machineId))
    .innerJoin(product, eq(machine.productCode, product.productCode))
    .leftJoin(hireRecord, eq(bookingItem.bookingItemId, hireRecord.bookingItemId))
    .where(eq(bookingItem.bookingId, bookingId))
    .orderBy(bookingItem.lineNum);

  // Get payments
  const payments = await db
    .select()
    .from(payment)
    .where(eq(payment.bookingId, bookingId));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/bookings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Booking #{b.bookingId}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(b.createDate).toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {b.storeName}
            </span>
          </div>
        </div>
        <Badge
          variant={b.status === 1 ? "default" : "destructive"}
          className="text-sm px-3 py-1"
        >
          {b.status === 1 ? "Active" : "Cancelled"}
        </Badge>
      </div>

      {/* Customer Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{b.customerFirstName} {b.customerLastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{b.customerEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p>{b.customerPhone || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Address</p>
              <p>{b.customerAddress?.trim() || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Hired Equipment ({items.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>SN</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead>Checkout</TableHead>
                <TableHead>Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.bookingItemId}>
                  <TableCell>{item.lineNum}</TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="font-mono text-sm">
                    <Link href={`/equipment/${item.machineId}`} className="text-primary hover:underline">
                      {item.machineSn}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(item.hireFrom).toLocaleDateString("en-NZ")}
                    {" – "}
                    {new Date(item.hireTo).toLocaleDateString("en-NZ")}
                  </TableCell>
                  <TableCell className="text-right">${item.hireRate}/day</TableCell>
                  <TableCell className="text-sm">
                    {item.checkoutTime ? (
                      <div>
                        <p>{new Date(item.checkoutTime).toLocaleString("en-NZ", { dateStyle: "short", timeStyle: "short" })}</p>
                        {item.checkoutStaffName && (
                          <p className="text-xs text-muted-foreground">by {item.checkoutStaffName}</p>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.returnTime ? (
                      <div>
                        <p>{new Date(item.returnTime).toLocaleString("en-NZ", { dateStyle: "short", timeStyle: "short" })}</p>
                        {item.returnStaffName && (
                          <p className="text-xs text-muted-foreground">by {item.returnStaffName}</p>
                        )}
                        {item.hireNote && (
                          <p className="text-xs text-amber-600 mt-0.5">{item.hireNote}</p>
                        )}
                      </div>
                    ) : item.checkoutTime ? (
                      <Badge className="bg-amber-100 text-amber-800 border-0">Out</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
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
          {payments.map((p) => (
            <div key={p.paymentId} className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {new Date(p.createDate).toLocaleDateString("en-NZ")}
              </span>
              <span className="font-medium">${p.amount}</span>
            </div>
          ))}
          <Separator className="my-3" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">${b.total}</span>
          </div>
        </CardContent>
      </Card>

      {b.note && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">
              <span className="font-medium">Note:</span> {b.note}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
