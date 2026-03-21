"use client";

import { useState } from "react";
import { replyToMessage } from "@/server/actions/message-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function MessageReplyForm({ messageId }: { messageId: number }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!reply.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setLoading(true);
    try {
      await replyToMessage(messageId, reply);
      toast.success("Reply sent");
    } catch (err) {
      toast.error("Failed to send reply");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Type your reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={3}
      />
      <Button size="sm" onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Send Reply
      </Button>
    </div>
  );
}
