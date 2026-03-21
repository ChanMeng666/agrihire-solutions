import Link from "next/link";
import { requireAdmin } from "@/lib/auth-utils";
import { getAllStaff } from "@/server/queries/admin";
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
import { UserCog, Plus } from "lucide-react";

export const metadata = { title: "Staff Management" };

const ROLE_LABELS: Record<string, string> = {
  staff: "Staff",
  lmgr: "Local Manager",
  nmgr: "Network Manager",
  admin: "Admin",
};

export default async function AdminStaffPage() {
  await requireAdmin();
  const staffList = await getAllStaff();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <Link href="/admin/staff/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            All Staff ({staffList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((s) => (
                <TableRow key={s.staffId}>
                  <TableCell className="font-medium">
                    {s.firstName} {s.lastName}
                  </TableCell>
                  <TableCell className="text-sm">{s.email}</TableCell>
                  <TableCell>{s.position || "—"}</TableCell>
                  <TableCell>{s.storeName || "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ROLE_LABELS[s.role] || s.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={s.isActive === 1 ? "default" : "destructive"}
                    >
                      {s.isActive === 1 ? "Active" : "Inactive"}
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
