"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMachine } from "@/server/actions/product-actions";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createMachine(formData);
      toast.success("Equipment added successfully");
      router.push("/equipment");
    } catch (err) {
      toast.error("Failed to add equipment");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/equipment">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Equipment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Details</CardTitle>
          <CardDescription>
            Register a new machine to the inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sn">Serial Number</Label>
              <Input
                id="sn"
                name="sn"
                placeholder="e.g. TRC-2024-001"
                required
                maxLength={50}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productCode">Product Code</Label>
                <Input
                  id="productCode"
                  name="productCode"
                  placeholder="e.g. TRC-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeId">Store ID</Label>
                <Input
                  id="storeId"
                  name="storeId"
                  type="number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Purchase Cost ($)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="Condition, notes..."
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Equipment
              </Button>
              <Link href="/equipment">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
