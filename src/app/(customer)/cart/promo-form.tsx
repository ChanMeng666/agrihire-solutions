"use client";

import { useState } from "react";
import { applyPromoCode } from "@/server/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ApplyPromoForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const code = (formData.get("promoCode") as string).trim().toUpperCase();

    if (!code) {
      toast.error("Please enter a promotion code");
      setLoading(false);
      return;
    }

    const result = await applyPromoCode(code);
    if (result.success) {
      toast.success("Promotion applied!");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Label htmlFor="promoCode" className="flex items-center gap-1.5">
        <Tag className="h-3.5 w-3.5" />
        Promotion Code
      </Label>
      <div className="flex gap-2">
        <Input
          id="promoCode"
          name="promoCode"
          placeholder="Enter code"
          className="flex-1"
        />
        <Button type="submit" variant="outline" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
    </form>
  );
}
