"use client";

import { removeCartItem, updateCartItemQty } from "@/server/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartItemActions({
  cartItemId,
  qty,
}: {
  cartItemId: number;
  qty: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateCartItemQty(cartItemId, qty - 1)}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">{qty}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateCartItemQty(cartItemId, qty + 1)}
      >
        <Plus className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={() => removeCartItem(cartItemId)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
