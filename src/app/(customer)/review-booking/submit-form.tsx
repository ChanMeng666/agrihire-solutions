"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processBooking } from "@/server/actions/booking-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Store {
  storeId: number;
  storeName: string;
  city: string | null;
}

export function SubmitBookingForm({
  cartId,
  customerId,
  stores,
}: {
  cartId: number;
  customerId: number;
  stores: Store[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [note, setNote] = useState("");

  async function handleSubmit() {
    if (!selectedStore) {
      toast.error("Please select a pickup store");
      return;
    }

    setLoading(true);

    try {
      const result = await processBooking(
        cartId,
        customerId,
        Number(selectedStore),
        note
      );

      if (result.success) {
        toast.success("Booking confirmed!");
        router.push(`/my-bookings/${result.bookingId}`);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process booking"
      );
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Complete Your Booking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Pickup Store</Label>
          <Select value={selectedStore} onValueChange={(v) => setSelectedStore(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select pickup store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((s) => (
                <SelectItem key={s.storeId} value={String(s.storeId)}>
                  {s.storeName}
                  {s.city ? ` (${s.city})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Any special requirements..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={loading || !selectedStore}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  );
}
