import Link from "next/link";
import { requireStaff } from "@/lib/auth-utils";
import { getMachinesByStore } from "@/server/queries/dashboard";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
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
import { Package, Plus } from "lucide-react";

export const metadata = { title: "Equipment" };

function getMachineStatusBadge(status: number) {
  switch (status) {
    case 1:
      return <Badge className="bg-green-100 text-green-800 border-0">Available</Badge>;
    case 2:
      return <Badge className="bg-amber-100 text-amber-800 border-0">Hired</Badge>;
    case 3:
      return <Badge className="bg-blue-100 text-blue-800 border-0">Returned</Badge>;
    case -1:
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

export default async function EquipmentPage() {
  const session = await requireStaff();
  const userId = Number(session.user.id);

  const staffResult = await db.execute(
    sql`SELECT store_id FROM staff WHERE user_id = ${userId}`
  );
  const storeId = (staffResult as unknown as Array<{ store_id: number }>)[0]?.store_id;

  const machines = storeId ? await getMachinesByStore(storeId) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
        <Link href="/equipment/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Machines ({machines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {machines.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No equipment found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial No.</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((m) => (
                  <TableRow key={m.machineId}>
                    <TableCell className="font-mono text-sm">
                      <Link href={`/equipment/${m.machineId}`} className="text-primary hover:underline">
                        {m.sn}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/equipment/${m.machineId}`}>{m.productName}</Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{m.categoryName}</Badge>
                    </TableCell>
                    <TableCell>{getMachineStatusBadge(m.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {m.note || "—"}
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
