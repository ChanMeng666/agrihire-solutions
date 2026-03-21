import Link from "next/link";
import { requireStaff } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { news, store } from "../../../../drizzle/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Newspaper, Plus } from "lucide-react";

export const metadata = { title: "Manage News" };

export default async function ManageNewsPage() {
  await requireStaff();

  const newsList = await db
    .select({
      newsId: news.newsId,
      title: news.title,
      createDate: news.createDate,
      status: news.status,
      storeName: store.storeName,
    })
    .from(news)
    .innerJoin(store, eq(news.storeId, store.storeId))
    .orderBy(desc(news.createDate));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">News</h1>
        <Link href="/manage-news/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Article
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            All Articles ({newsList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsList.map((n) => (
                <TableRow key={n.newsId}>
                  <TableCell className="font-medium">
                    <Link href={`/manage-news/${n.newsId}`} className="hover:text-primary hover:underline">
                      {n.title || "Untitled"}
                    </Link>
                  </TableCell>
                  <TableCell>{n.storeName}</TableCell>
                  <TableCell className="text-sm">
                    {n.createDate
                      ? new Date(n.createDate).toLocaleDateString("en-NZ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={n.status === 1 ? "default" : "secondary"}>
                      {n.status === 1 ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
