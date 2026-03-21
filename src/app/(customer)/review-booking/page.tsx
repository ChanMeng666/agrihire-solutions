import { getCartWithItems } from "@/server/queries/cart";
import { getActiveStores } from "@/server/queries/stores";
import { requireCustomerContext } from "@/lib/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitBookingForm } from "./submit-form";

export const metadata = { title: "Review Booking" };

export default async function ReviewBookingPage() {
  const { customerId } = await requireCustomerContext();

  const [{ cart, items }, stores] = await Promise.all([
    getCartWithItems(customerId),
    getActiveStores(),
  ]);

  if (!cart || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link href="/for-hire">
          <Button>Browse Equipment</Button>
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const days = Math.ceil(
      (new Date(item.hireTo).getTime() - new Date(item.hireFrom).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const discount = Number(item.discRate || 0);
    const rate = Number(item.hireRate) * (1 - discount / 100);
    return sum + rate * days * item.qty;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Review Your Booking
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Equipment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const days = Math.ceil(
                  (new Date(item.hireTo).getTime() -
                    new Date(item.hireFrom).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const discount = Number(item.discRate || 0);
                const rate = Number(item.hireRate) * (1 - discount / 100);
                const lineTotal = rate * days * item.qty;

                return (
                  <TableRow key={item.cartItemId}>
                    <TableCell>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        ${rate.toFixed(2)}/day
                        {discount > 0 && (
                          <Badge className="ml-1 text-xs" variant="default">
                            {discount}% off
                          </Badge>
                        )}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(item.hireFrom).toLocaleDateString("en-NZ")}
                      {" - "}
                      {new Date(item.hireTo).toLocaleDateString("en-NZ")}
                      <p className="text-xs text-muted-foreground">
                        {days} day{days !== 1 ? "s" : ""}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">{item.qty}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${lineTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {cart.promoCode && (
            <p className="text-sm text-primary mt-2">
              Promo code applied: {cart.promoCode}
            </p>
          )}
        </CardContent>
      </Card>

      <SubmitBookingForm
        cartId={cart.cartId}
        customerId={customerId}
        stores={stores}
      />
    </div>
  );
}
