"use client";

import { useState } from "react";
import { sendContactMessage } from "@/server/actions/message-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface Store {
  storeId: number;
  storeName: string;
}

export function ContactForm({ stores }: { stores: Store[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedStore) {
      toast.error("Please select a store");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("storeId", selectedStore);
      await sendContactMessage(formData);
      toast.success("Message sent! We'll get back to you soon.");
      e.currentTarget.reset();
      setSelectedStore("");
    } catch (err) {
      toast.error("Please sign in to send a message.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Store</Label>
        <Select value={selectedStore} onValueChange={(v) => setSelectedStore(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Select a store to contact" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((s) => (
              <SelectItem key={s.storeId} value={String(s.storeId)}>
                {s.storeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can we help?" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Message</Label>
        <Textarea id="content" name="content" placeholder="Tell us more..." rows={5} required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Send Message
      </Button>
    </form>
  );
}
