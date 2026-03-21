import { requireStaff } from "@/lib/auth-utils";
import { getBookingsByStore } from "@/server/queries/bookings";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList } from "lucide-react";

export const metadata = { title: "Bookings" };

export default async function BookingsPage() {
  const session = await requireStaff();
  const userId = Number(session.user.id);

  const staffResult = await db.execute(
    sql`SELECT store_id FROM staff WHERE user_id = ${userId}`
  );
  const storeId = (staffResult as unknown as Array<{ store_id: number }>)[0]?.store_id;

  const bookings = storeId ? await getBookingsByStore(storeId) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            All Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No bookings found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.bookingId}>
                    <TableCell className="font-medium">#{b.bookingId}</TableCell>
                    <TableCell>
                      {b.customerFirstName} {b.customerLastName}
                      {b.customerPhone && (
                        <p className="text-xs text-muted-foreground">
                          {b.customerPhone}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(b.createDate).toLocaleDateString("en-NZ")}
                    </TableCell>
                    <TableCell>{b.itemCount}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${b.total}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={b.status === 1 ? "default" : "destructive"}
                      >
                        {b.status === 1 ? "Active" : "Cancelled"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
