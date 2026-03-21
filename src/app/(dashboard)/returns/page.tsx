import { requireStaff } from "@/lib/auth-utils";
import { getTodayReturns } from "@/server/queries/bookings";
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
import { Tractor } from "lucide-react";

export const metadata = { title: "Returns" };

export default async function ReturnsPage() {
  const session = await requireStaff();
  const userId = Number(session.user.id);

  const staffResult = await db.execute(
    sql`SELECT store_id FROM staff WHERE user_id = ${userId}`
  );
  const storeId = (staffResult as unknown as Array<{ store_id: number }>)[0]?.store_id;

  const returns = storeId ? await getTodayReturns(storeId) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Today&apos;s Returns</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tractor className="h-4 w-4" />
            Equipment Due Today ({returns.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {returns.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No equipment returns due today.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Serial No.</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((r) => (
                  <TableRow key={r.bookingItemId}>
                    <TableCell>#{r.bookingId}</TableCell>
                    <TableCell>
                      {r.customerFirstName} {r.customerLastName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.productName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {r.machineSn}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(r.hireTo).toLocaleTimeString("en-NZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {r.returnTime ? (
                        <Badge className="bg-green-100 text-green-800 border-0">
                          Returned
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
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
