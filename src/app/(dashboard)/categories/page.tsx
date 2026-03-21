import { requireStaff } from "@/lib/auth-utils";
import { getAllCategories } from "@/server/queries/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Warehouse } from "lucide-react";
import { AddCategoryForm, CategoryStatusToggle } from "./category-actions";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await requireStaff();
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Categories</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            All Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.categoryCode}>
                  <TableCell className="font-mono text-sm">
                    {c.categoryCode}
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-center">
                    {c.productCount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={c.status === 1 ? "default" : "destructive"}
                    >
                      {c.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <CategoryStatusToggle
                      categoryCode={c.categoryCode}
                      isActive={c.status === 1}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-6" />

          <AddCategoryForm />
        </CardContent>
      </Card>
    </div>
  );
}
