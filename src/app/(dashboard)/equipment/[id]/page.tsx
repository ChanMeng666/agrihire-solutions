import { notFound } from "next/navigation";
import Link from "next/link";
import { requireStaff } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { machine, product, category, service, store } from "../../../../../drizzle/schema";
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
import { ArrowLeft, Wrench, Package } from "lucide-react";
import { AddServiceForm } from "./service-form";

export const metadata = { title: "Equipment Detail" };

function getMachineStatusBadge(status: number) {
  switch (status) {
    case 1: return <Badge className="bg-green-100 text-green-800 border-0">Available</Badge>;
    case 2: return <Badge className="bg-amber-100 text-amber-800 border-0">Hired</Badge>;
    case 3: return <Badge className="bg-blue-100 text-blue-800 border-0">Returned</Badge>;
    case -1: return <Badge variant="destructive">Inactive</Badge>;
    default: return <Badge variant="secondary">Unknown</Badge>;
  }
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const machines = await db
    .select({
      machineId: machine.machineId,
      sn: machine.sn,
      status: machine.status,
      purchaseDate: machine.purchaseDate,
      cost: machine.cost,
      photo: machine.photo,
      note: machine.note,
      productName: product.name,
      productCode: product.productCode,
      categoryName: category.name,
      storeName: store.storeName,
    })
    .from(machine)
    .innerJoin(product, eq(machine.productCode, product.productCode))
    .innerJoin(category, eq(product.categoryCode, category.categoryCode))
    .innerJoin(store, eq(machine.storeId, store.storeId))
    .where(eq(machine.machineId, Number(id)))
    .limit(1);

  if (machines.length === 0) notFound();
  const m = machines[0];

  const serviceRecords = await db
    .select()
    .from(service)
    .where(eq(service.machineId, Number(id)))
    .orderBy(service.serviceDate);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/equipment">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{m.productName}</h1>
          <p className="text-muted-foreground">SN: {m.sn}</p>
        </div>
      </div>

      {/* Machine Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Machine Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Serial Number</p>
              <p className="font-mono font-medium">{m.sn}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <div className="mt-0.5">{getMachineStatusBadge(m.status)}</div>
            </div>
            <div>
              <p className="text-muted-foreground">Product</p>
              <p className="font-medium">{m.productName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <Badge variant="secondary">{m.categoryName}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Store</p>
              <p>{m.storeName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Purchase Date</p>
              <p>{m.purchaseDate || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cost</p>
              <p>{m.cost ? `$${m.cost}` : "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Note</p>
              <p>{m.note || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Service Records ({serviceRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {serviceRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No service records.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRecords.map((s) => (
                  <TableRow key={s.serviceId}>
                    <TableCell className="text-sm">{s.serviceDate}</TableCell>
                    <TableCell className="font-medium">{s.serviceName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.note || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Separator className="my-4" />

          <AddServiceForm machineId={Number(id)} />
        </CardContent>
      </Card>
    </div>
  );
}
