import { requireStaff } from "@/lib/auth-utils";
import { getStaffContext } from "@/lib/user-context";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { machine, product, category, store } from "../../../../drizzle/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Warehouse } from "lucide-react";

export const metadata = { title: "Inventory" };

export default async function InventoryPage() {
  const session = await requireStaff();

  const ctx = await getStaffContext();
  const storeId = ctx?.storeId;

  const inventory = storeId
    ? await db
        .select({
          productCode: product.productCode,
          productName: product.name,
          categoryName: category.name,
          total: sql<number>`count(${machine.machineId})`,
          available: sql<number>`count(*) filter (where ${machine.status} = 1)`,
          hired: sql<number>`count(*) filter (where ${machine.status} = 2)`,
          inactive: sql<number>`count(*) filter (where ${machine.status} = -1)`,
        })
        .from(machine)
        .innerJoin(product, eq(machine.productCode, product.productCode))
        .innerJoin(category, eq(product.categoryCode, category.categoryCode))
        .where(eq(machine.storeId, storeId))
        .groupBy(product.productCode, product.name, category.name)
        .orderBy(product.name)
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Stock Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No inventory data.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-center">Hired</TableHead>
                  <TableHead className="text-center">Inactive</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.productCode}>
                    <TableCell className="font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.categoryName}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {item.total}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-800 border-0">
                        {item.available}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-100 text-amber-800 border-0">
                        {item.hired}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{item.inactive}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
