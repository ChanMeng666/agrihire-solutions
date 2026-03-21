import { requireStaff } from "@/lib/auth-utils";
import { getStaffContext } from "@/lib/user-context";
import { getPendingCheckouts, getCheckedOutItems } from "@/server/actions/hire-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, RotateCcw } from "lucide-react";
import { CheckoutButton, ReturnButton } from "./action-buttons";

export const metadata = { title: "Checkout & Returns" };

interface HireItem {
  booking_item_id: number;
  booking_id: number;
  hire_from: string;
  hire_to: string;
  hire_rate: string;
  machine_sn: string;
  machine_id: number;
  product_name: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  checkout_time: string | null;
  return_time: string | null;
}

export default async function CheckoutPage() {
  const session = await requireStaff();

  const ctx = await getStaffContext();
  const storeId = ctx?.storeId;

  const pending = storeId
    ? ((await getPendingCheckouts(storeId)) as unknown as HireItem[])
    : [];
  const checkedOut = storeId
    ? ((await getCheckedOutItems(storeId)) as unknown as HireItem[])
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Checkout & Returns</h1>

      <Tabs defaultValue="checkout">
        <TabsList>
          <TabsTrigger value="checkout" className="gap-2">
            <LogOut className="h-4 w-4" />
            Pending Checkout ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="returns" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Checked Out ({checkedOut.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkout" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Equipment Ready for Checkout
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No equipment pending checkout.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Serial No.</TableHead>
                      <TableHead>Hire Period</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((item) => (
                      <TableRow key={item.booking_item_id}>
                        <TableCell className="font-medium">
                          #{item.booking_id}
                        </TableCell>
                        <TableCell>
                          <div>
                            {item.customer_first_name} {item.customer_last_name}
                            {item.customer_phone && (
                              <p className="text-xs text-muted-foreground">
                                {item.customer_phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.machine_sn}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(item.hire_from).toLocaleDateString("en-NZ")}
                          {" - "}
                          {new Date(item.hire_to).toLocaleDateString("en-NZ")}
                        </TableCell>
                        <TableCell>${item.hire_rate}/day</TableCell>
                        <TableCell className="text-right">
                          <CheckoutButton bookingItemId={item.booking_item_id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Equipment Currently Checked Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              {checkedOut.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No equipment currently checked out.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Serial No.</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkedOut.map((item) => {
                      const isOverdue = new Date(item.hire_to) < new Date();
                      return (
                        <TableRow key={item.booking_item_id}>
                          <TableCell className="font-medium">
                            #{item.booking_id}
                          </TableCell>
                          <TableCell>
                            {item.customer_first_name} {item.customer_last_name}
                          </TableCell>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {item.machine_sn}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(item.hire_to).toLocaleDateString("en-NZ")}
                          </TableCell>
                          <TableCell>
                            {isOverdue ? (
                              <Badge variant="destructive">Overdue</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800 border-0">
                                Out
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <ReturnButton bookingItemId={item.booking_item_id} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
