import { getCartWithItems } from "@/server/queries/cart";
import { removePromoCode } from "@/server/actions/cart-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";
import { requireCustomerContext } from "@/lib/user-context";
import { ApplyPromoForm } from "./promo-form";
import { CartItemActions } from "./cart-item-actions";

export const metadata = { title: "Shopping Cart" };

export default async function CartPage() {
  const { customerId } = await requireCustomerContext();

  const { cart, items } = await getCartWithItems(customerId);

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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/for-hire">
            <Button>Browse Equipment</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const days = Math.ceil(
                (new Date(item.hireTo).getTime() -
                  new Date(item.hireFrom).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const discount = Number(item.discRate || 0);
              const effectiveRate =
                Number(item.hireRate) * (1 - discount / 100);
              const lineTotal = effectiveRate * days * item.qty;

              return (
                <Card key={item.cartItemId}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{item.productName}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.categoryName}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-2 space-y-0.5">
                          <p>
                            From:{" "}
                            {new Date(item.hireFrom).toLocaleDateString(
                              "en-NZ"
                            )}
                          </p>
                          <p>
                            To:{" "}
                            {new Date(item.hireTo).toLocaleDateString("en-NZ")}
                          </p>
                          <p>
                            {days} day{days !== 1 ? "s" : ""} &times; $
                            {effectiveRate.toFixed(2)}/day
                            {discount > 0 && (
                              <Badge className="ml-2 text-xs" variant="default">
                                {discount}% off
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold">
                          ${lineTotal.toFixed(2)}
                        </p>
                        <CartItemActions
                          cartItemId={item.cartItemId}
                          qty={item.qty}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {cart?.promoCode && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-primary">
                      <Tag className="h-3.5 w-3.5" />
                      {cart.promoCode}
                    </span>
                    <form action={async () => { "use server"; await removePromoCode(); }}>
                      <Button variant="ghost" size="sm" type="submit" className="h-auto p-0 text-xs text-destructive">
                        Remove
                      </Button>
                    </form>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${subtotal.toFixed(2)}</span>
                </div>

                <Link href="/review-booking" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Review
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {!cart?.promoCode && (
              <Card>
                <CardContent className="pt-6">
                  <ApplyPromoForm />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
