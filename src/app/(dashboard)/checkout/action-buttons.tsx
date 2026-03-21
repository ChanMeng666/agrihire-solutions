"use client";

import { useState } from "react";
import { checkoutEquipment, returnEquipment } from "@/server/actions/hire-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, LogOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function CheckoutButton({ bookingItemId }: { bookingItemId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      await checkoutEquipment(bookingItemId);
      toast.success("Equipment checked out successfully");
    } catch (err) {
      toast.error("Failed to checkout equipment");
    }
    setLoading(false);
  }

  return (
    <Button size="sm" onClick={handleCheckout} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="mr-1 h-3.5 w-3.5" />
          Checkout
        </>
      )}
    </Button>
  );
}

export function ReturnButton({ bookingItemId }: { bookingItemId: number }) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function handleReturn() {
    setLoading(true);
    try {
      await returnEquipment(bookingItemId, note || undefined);
      toast.success("Equipment returned successfully");
      setNote("");
    } catch (err) {
      toast.error("Failed to process return");
    }
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" variant="outline">
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          Return
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Return</DialogTitle>
          <DialogDescription>
            Add any notes about the equipment condition before processing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="return-note">Return Note (optional)</Label>
            <Textarea
              id="return-note"
              placeholder="Equipment condition, damage notes, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleReturn} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 h-4 w-4" />
            )}
            Confirm Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
