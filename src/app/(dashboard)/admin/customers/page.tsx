import { requireAdmin } from "@/lib/auth-utils";
import { getAllCustomers } from "@/server/queries/admin";
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
import { Users } from "lucide-react";

export const metadata = { title: "Customer Management" };

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getAllCustomers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Customers ({customers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Preferred Store</TableHead>
                <TableHead className="text-center">Bookings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.customerId}>
                  <TableCell className="font-medium">
                    {c.firstName} {c.lastName}
                  </TableCell>
                  <TableCell className="text-sm">{c.email}</TableCell>
                  <TableCell>{c.phone || "—"}</TableCell>
                  <TableCell>{c.city || "—"}</TableCell>
                  <TableCell>{c.storeName || "None"}</TableCell>
                  <TableCell className="text-center">{c.bookingCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={c.isActive === 1 ? "default" : "destructive"}
                    >
                      {c.isActive === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
