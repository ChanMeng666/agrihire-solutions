import { requireStaff } from "@/lib/auth-utils";
import { getStaffContext } from "@/lib/user-context";
import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { message, customer } from "../../../../drizzle/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { MessageReplyForm } from "./reply-form";

export const metadata = { title: "Messages" };

export default async function ManageMessagesPage() {
  const session = await requireStaff();

  const ctx = await getStaffContext();
  const storeId = ctx?.storeId;

  const messages = storeId
    ? await db
        .select({
          messageId: message.messageId,
          subject: message.subject,
          content: message.content,
          reply: message.reply,
          createDate: message.createDate,
          replyDate: message.replyDate,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          customerPhone: customer.phone,
        })
        .from(message)
        .innerJoin(customer, eq(message.customerId, customer.customerId))
        .where(eq(message.storeId, storeId))
        .orderBy(desc(message.createDate))
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Messages</h1>

      {messages.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No messages.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {messages.map((msg) => (
            <Card key={msg.messageId}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{msg.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      From: {msg.customerFirstName} {msg.customerLastName}
                      {msg.customerPhone && ` (${msg.customerPhone})`}
                      {" — "}
                      {new Date(msg.createDate).toLocaleDateString("en-NZ")}
                    </p>
                  </div>
                  <Badge variant={msg.reply ? "default" : "destructive"}>
                    {msg.reply ? "Replied" : "Needs Reply"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{msg.content}</p>

                {msg.reply ? (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Your reply{" "}
                      {msg.replyDate &&
                        `(${new Date(msg.replyDate).toLocaleDateString("en-NZ")})`}
                    </p>
                    <p className="text-sm">{msg.reply}</p>
                  </div>
                ) : (
                  <MessageReplyForm messageId={msg.messageId} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
