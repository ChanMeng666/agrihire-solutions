"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/server/actions/product-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createProduct(formData);
      toast.success("Product created successfully");
      router.push("/products");
    } catch (err) {
      toast.error("Failed to create product");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Add a new product to the equipment catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productCode">Product Code</Label>
                <Input
                  id="productCode"
                  name="productCode"
                  placeholder="e.g. TRC-001"
                  required
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryCode">Category Code</Label>
                <Input
                  id="categoryCode"
                  name="categoryCode"
                  placeholder="e.g. TRC"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Compact Tractor 25HP"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specs">Specifications</Label>
              <Textarea
                id="specs"
                name="specs"
                placeholder="Technical specifications..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                placeholder="https://..."
              />
            </div>

            <Separator />

            <h3 className="font-semibold">Pricing Tiers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceA">Standard Rate ($/day)</Label>
                <Input
                  id="priceA"
                  name="priceA"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtyBreakA">Break A (hours)</Label>
                <Input
                  id="qtyBreakA"
                  name="qtyBreakA"
                  type="number"
                  defaultValue="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceB">Extended Rate ($/day)</Label>
                <Input
                  id="priceB"
                  name="priceB"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtyBreakB">Break B (hours)</Label>
                <Input
                  id="qtyBreakB"
                  name="qtyBreakB"
                  type="number"
                  defaultValue="168"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceC">Long-term Rate ($/day)</Label>
                <Input
                  id="priceC"
                  name="priceC"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtyBreakC">Break C (hours)</Label>
                <Input
                  id="qtyBreakC"
                  name="qtyBreakC"
                  type="number"
                  defaultValue="600"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minHire">Min Hire (days)</Label>
                <Input id="minHire" name="minHire" type="number" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxHire">Max Hire (days)</Label>
                <Input id="maxHire" name="maxHire" type="number" min="0" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
              </Button>
              <Link href="/products">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
