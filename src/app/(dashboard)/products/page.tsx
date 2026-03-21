import Link from "next/link";
import { requireStaff } from "@/lib/auth-utils";
import { getAllProducts } from "@/server/queries/dashboard";
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
import { Layers, Plus } from "lucide-react";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  await requireStaff();
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4" />
            All Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price/day</TableHead>
                <TableHead className="text-center">Machines</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.productCode}>
                  <TableCell className="font-mono text-sm">
                    <Link
                      href={`/products/${p.productCode}`}
                      className="text-primary hover:underline"
                    >
                      {p.productCode}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.categoryName}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${p.priceA}</TableCell>
                  <TableCell className="text-center">{p.machineCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.status === 1 ? "default" : "destructive"}
                    >
                      {p.status === 1 ? "Active" : "Inactive"}
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
