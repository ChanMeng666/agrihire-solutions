"use client";

import { useState } from "react";
import {
  createCategory,
  toggleCategoryStatus,
} from "@/server/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export function AddCategoryForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createCategory(formData);
      toast.success("Category created");
      e.currentTarget.reset();
    } catch {
      toast.error("Failed to create category. Code may already exist.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="font-medium text-sm">Add New Category</h4>
      <div className="flex gap-3 items-end">
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="categoryCode" className="text-xs">
            Code
          </Label>
          <Input
            id="categoryCode"
            name="categoryCode"
            placeholder="e.g. TRC"
            required
            maxLength={10}
            className="w-28"
          />
        </div>
        <div className="space-y-1 flex-1">
          <Label htmlFor="name" className="text-xs">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Tractors"
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="mr-1 h-3.5 w-3.5" />
          )}
          Add
        </Button>
      </div>
    </form>
  );
}

export function CategoryStatusToggle({
  categoryCode,
  isActive,
}: {
  categoryCode: string;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleCategoryStatus(categoryCode, !isActive);
      toast.success(
        isActive ? "Category deactivated" : "Category activated"
      );
    } catch {
      toast.error("Failed to update status");
    }
    setLoading(false);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={isActive ? "text-destructive hover:text-destructive" : "text-primary hover:text-primary"}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isActive ? (
        "Deactivate"
      ) : (
        "Activate"
      )}
    </Button>
  );
}
