"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPromotion } from "@/server/actions/promotion-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewPromotionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createPromotion(formData);
      toast.success("Promotion created");
      router.push("/manage-promotions");
    } catch (err) {
      toast.error("Failed to create promotion");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/manage-promotions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Promotion</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promoCode">Promo Code</Label>
                <Input id="promoCode" name="promoCode" placeholder="e.g. SPRING25" required maxLength={20} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeId">Store ID</Label>
                <Input id="storeId" name="storeId" type="number" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Promotion Name</Label>
              <Input id="name" name="name" placeholder="e.g. Spring Sale 2025" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discRate">Discount (%)</Label>
                <Input id="discRate" name="discRate" type="number" step="0.01" min="0" max="100" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCodes">Product Codes (comma-separated)</Label>
              <Input id="productCodes" name="productCodes" placeholder="e.g. TRC-001, PLW-002" />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Promotion
              </Button>
              <Link href="/manage-promotions"><Button variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
