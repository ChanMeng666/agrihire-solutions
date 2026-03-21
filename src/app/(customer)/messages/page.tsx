import { getMessagesByCustomer } from "@/server/queries/messages";
import { getCustomerContext } from "@/lib/user-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar } from "lucide-react";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const ctx = await getCustomerContext();
  const customerId = ctx?.customerId;

  const messages = customerId ? await getMessagesByCustomer(customerId) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Messages</h1>

      {messages.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {messages.map((msg) => (
            <Card key={msg.messageId}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{msg.subject}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(msg.createDate).toLocaleDateString("en-NZ")}
                      <Badge variant="secondary" className="text-xs">
                        {msg.storeName}
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    variant={msg.reply ? "default" : "outline"}
                    className="shrink-0"
                  >
                    {msg.reply ? "Replied" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{msg.content}</p>
                {msg.reply && (
                  <div className="bg-muted/50 rounded-lg p-4 mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Reply from store{" "}
                      {msg.replyDate &&
                        `(${new Date(msg.replyDate).toLocaleDateString("en-NZ")})`}
                    </p>
                    <p className="text-sm">{msg.reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
