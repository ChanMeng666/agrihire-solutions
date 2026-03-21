"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProduct } from "@/server/actions/product-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Product {
  productCode: string;
  name: string;
  description: string | null;
  specs: string | null;
  priceA: string;
  qtyBreakA: number;
  priceB: string | null;
  qtyBreakB: number | null;
  priceC: string | null;
  qtyBreakC: number | null;
  minHire: number | null;
  maxHire: number | null;
  image: string | null;
  categoryCode: string;
  categoryName: string;
}

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await updateProduct(product.productCode, formData);
      toast.success("Product updated successfully");
      router.push("/products");
    } catch (err) {
      toast.error("Failed to update product");
    }
    setLoading(false);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit: {product.name}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Code</Label>
                <Input value={product.productCode} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryCode">Category Code</Label>
                <Input
                  id="categoryCode"
                  name="categoryCode"
                  defaultValue={product.categoryCode}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product.description || ""}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specs">Specifications</Label>
              <Textarea
                id="specs"
                name="specs"
                defaultValue={product.specs || ""}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                defaultValue={product.image || ""}
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
                  defaultValue={product.priceA}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtyBreakA">Break A (hours)</Label>
                <Input
                  id="qtyBreakA"
                  name="qtyBreakA"
                  type="number"
                  defaultValue={product.qtyBreakA}
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
                  defaultValue={product.priceB || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtyBreakB">Break B (hours)</Label>
                <Input
                  id="qtyBreakB"
                  name="qtyBreakB"
                  type="number"
                  defaultValue={product.qtyBreakB || 168}
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
                  defaultValue={product.priceC || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtyBreakC">Break C (hours)</Label>
                <Input
                  id="qtyBreakC"
                  name="qtyBreakC"
                  type="number"
                  defaultValue={product.qtyBreakC || 600}
                />
              </div>
            </div>

            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minHire">Min Hire (days)</Label>
                <Input
                  id="minHire"
                  name="minHire"
                  type="number"
                  defaultValue={product.minHire || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxHire">Max Hire (days)</Label>
                <Input
                  id="maxHire"
                  name="maxHire"
                  type="number"
                  defaultValue={product.maxHire || ""}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Link href="/products">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
