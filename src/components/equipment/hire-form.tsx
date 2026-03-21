"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/server/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Store {
  storeId: number;
  storeName: string;
  city: string | null;
  availableCount: number;
}

export function HireForm({
  productCode,
  stores,
}: {
  productCode: string;
  stores: Store[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("productCode", productCode);
      await addToCart(formData);
      toast.success("Added to cart!");
      router.push("/cart");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add to cart. Please sign in."
      );
    }
    setLoading(false);
  }

  // Set default dates: tomorrow to day after
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Hire This Equipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store">Pickup Store</Label>
            <Select
              name="storeId"
              value={selectedStore}
              onValueChange={(v) => setSelectedStore(v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((s) => (
                  <SelectItem key={s.storeId} value={String(s.storeId)}>
                    {s.storeName}
                    {s.city ? ` (${s.city})` : ""} —{" "}
                    {s.availableCount} available
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hireFrom">Hire From</Label>
              <Input
                id="hireFrom"
                name="hireFrom"
                type="date"
                defaultValue={formatDate(tomorrow)}
                min={formatDate(tomorrow)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireTo">Hire To</Label>
              <Input
                id="hireTo"
                name="hireTo"
                type="date"
                defaultValue={formatDate(dayAfter)}
                min={formatDate(dayAfter)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qty">Quantity</Label>
            <Input
              id="qty"
              name="qty"
              type="number"
              min="1"
              defaultValue="1"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading || !selectedStore}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Add to Cart
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
