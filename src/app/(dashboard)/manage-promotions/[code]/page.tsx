import { notFound } from "next/navigation";
import Link from "next/link";
import { requireStaff } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { promotion, promoProduct, product, store } from "../../../../../drizzle/schema";
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
import { ArrowLeft, Tag } from "lucide-react";

export const metadata = { title: "Promotion Detail" };

export default async function PromotionDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  await requireStaff();
  const { code } = await params;

  const promos = await db
    .select({
      promoCode: promotion.promoCode,
      name: promotion.name,
      description: promotion.description,
      discRate: promotion.discRate,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      status: promotion.status,
      note: promotion.note,
      storeName: store.storeName,
    })
    .from(promotion)
    .innerJoin(store, eq(promotion.storeId, store.storeId))
    .where(eq(promotion.promoCode, code))
    .limit(1);

  if (promos.length === 0) notFound();
  const promo = promos[0];

  const linkedProducts = await db
    .select({
      productCode: product.productCode,
      name: product.name,
      priceA: product.priceA,
    })
    .from(promoProduct)
    .innerJoin(product, eq(promoProduct.productCode, product.productCode))
    .where(eq(promoProduct.promoCode, code));

  const now = new Date();
  const isActive =
    promo.status === 1 &&
    new Date(promo.startDate) <= now &&
    new Date(promo.endDate) >= now;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/manage-promotions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {promo.name || promo.promoCode}
          </h1>
          <p className="text-muted-foreground">{promo.storeName}</p>
        </div>
        <Badge
          variant={isActive ? "default" : "secondary"}
          className="text-sm px-3 py-1"
        >
          {isActive ? "Active" : promo.status === 1 ? "Scheduled" : "Inactive"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Promotion Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Promo Code</p>
              <p className="font-mono font-medium">{promo.promoCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Discount Rate</p>
              <Badge className="text-base">{promo.discRate}% OFF</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p>{new Date(promo.startDate).toLocaleDateString("en-NZ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End Date</p>
              <p>{new Date(promo.endDate).toLocaleDateString("en-NZ")}</p>
            </div>
          </div>
          {promo.description && (
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Description</p>
              <p className="mt-1">{promo.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Linked Products ({linkedProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No products linked to this promotion.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Original Price</TableHead>
                  <TableHead className="text-right">After Discount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedProducts.map((p) => {
                  const discounted =
                    Number(p.priceA) * (1 - Number(promo.discRate) / 100);
                  return (
                    <TableRow key={p.productCode}>
                      <TableCell className="font-mono text-sm">
                        {p.productCode}
                      </TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right text-muted-foreground line-through">
                        ${p.priceA}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ${discounted.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
