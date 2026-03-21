import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductByCode,
  getStoresWithProduct,
} from "@/server/queries/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tractor, ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productCode: string }>;
}) {
  const { productCode } = await params;
  const product = await getProductByCode(productCode);
  return { title: product ? product.name : "Equipment Detail" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ categoryCode: string; productCode: string }>;
}) {
  const { categoryCode, productCode } = await params;
  const [product, stores] = await Promise.all([
    getProductByCode(productCode),
    getStoresWithProduct(productCode),
  ]);

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <Link href={`/for-hire/${categoryCode}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/for-hire" className="hover:text-foreground">
            Equipment
          </Link>
          <span>/</span>
          <Link
            href={`/for-hire/${categoryCode}`}
            className="hover:text-foreground"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <Tractor className="h-20 w-20 text-muted-foreground/20" />
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.categoryName}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Pricing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Rate/day</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      Standard
                      {product.qtyBreakA > 0 &&
                        ` (up to ${product.qtyBreakA}h)`}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${product.priceA}
                    </TableCell>
                  </TableRow>
                  {product.priceB && (
                    <TableRow>
                      <TableCell>
                        Extended
                        {product.qtyBreakB &&
                          ` (up to ${product.qtyBreakB}h)`}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${product.priceB}
                      </TableCell>
                    </TableRow>
                  )}
                  {product.priceC && (
                    <TableRow>
                      <TableCell>
                        Long-term
                        {product.qtyBreakC &&
                          ` (${product.qtyBreakC}h+)`}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${product.priceC}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Hire period */}
          {(product.minHire || product.maxHire) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Hire period:{" "}
                {product.minHire && `min ${product.minHire} days`}
                {product.minHire && product.maxHire && " / "}
                {product.maxHire && `max ${product.maxHire} days`}
              </span>
            </div>
          )}

          {/* Availability by store */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Store Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stores.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Not currently available at any store.
                </p>
              ) : (
                <div className="space-y-3">
                  {stores.map((s) => (
                    <div
                      key={s.storeId}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{s.storeName}</p>
                        {s.city && (
                          <p className="text-xs text-muted-foreground">
                            {s.city}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          s.availableCount > 0 ? "default" : "secondary"
                        }
                      >
                        {s.availableCount} available
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add to cart */}
          <Link href="/login">
            <Button size="lg" className="w-full text-base">
              Sign in to Hire
            </Button>
          </Link>
        </div>
      </div>

      {/* Specs */}
      {product.specs && (
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.specs}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
