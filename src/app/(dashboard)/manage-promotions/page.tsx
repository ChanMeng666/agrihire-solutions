import Link from "next/link";
import { requireStaff } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { eq, sql, desc } from "drizzle-orm";
import { promotion, store } from "../../../../drizzle/schema";
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
import { Tag, Plus } from "lucide-react";

export const metadata = { title: "Manage Promotions" };

export default async function ManagePromotionsPage() {
  await requireStaff();

  const promotions = await db
    .select({
      promoCode: promotion.promoCode,
      name: promotion.name,
      discRate: promotion.discRate,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      status: promotion.status,
      storeName: store.storeName,
    })
    .from(promotion)
    .innerJoin(store, eq(promotion.storeId, store.storeId))
    .orderBy(desc(promotion.startDate));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
        <Link href="/manage-promotions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Promotion
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4" />
            All Promotions ({promotions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((p) => {
                const now = new Date();
                const isActive =
                  p.status === 1 &&
                  new Date(p.startDate) <= now &&
                  new Date(p.endDate) >= now;
                return (
                  <TableRow key={p.promoCode}>
                    <TableCell className="font-mono">
                      <Link href={`/manage-promotions/${p.promoCode}`} className="text-primary hover:underline">
                        {p.promoCode}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/manage-promotions/${p.promoCode}`}>
                        {p.name || p.promoCode}
                      </Link>
                    </TableCell>
                    <TableCell>{p.discRate}%</TableCell>
                    <TableCell className="text-sm">
                      {new Date(p.startDate).toLocaleDateString("en-NZ")}
                      {" - "}
                      {new Date(p.endDate).toLocaleDateString("en-NZ")}
                    </TableCell>
                    <TableCell>{p.storeName}</TableCell>
                    <TableCell>
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Active" : p.status === 1 ? "Scheduled" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
