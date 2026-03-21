"use client";

import { useState } from "react";
import { addServiceRecord } from "@/server/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export function AddServiceForm({ machineId }: { machineId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("machineId", String(machineId));
      await addServiceRecord(formData);
      toast.success("Service record added");
      e.currentTarget.reset();
    } catch {
      toast.error("Failed to add service record");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="font-medium text-sm">Add Service Record</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="serviceDate" className="text-xs">Date</Label>
          <Input
            id="serviceDate"
            name="serviceDate"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="serviceName" className="text-xs">Service Name</Label>
          <Input
            id="serviceName"
            name="serviceName"
            placeholder="e.g. Oil change"
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="note" className="text-xs">Notes</Label>
        <Textarea id="note" name="note" rows={2} placeholder="Details..." />
      </div>
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Plus className="mr-1 h-3.5 w-3.5" />}
        Add Record
      </Button>
    </form>
  );
}
