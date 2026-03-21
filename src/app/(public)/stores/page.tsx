import { getActiveStores, getStoreHours } from "@/server/queries/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = { title: "Our Stores" };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function StoresPage() {
  const stores = await getActiveStores();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Our Stores</h1>
      <p className="text-muted-foreground mb-8">
        Find your nearest AgriHire location
      </p>

      {stores.length === 0 ? (
        <div className="text-center py-20">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No stores found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((s) => (
            <Card key={s.storeId} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  {s.storeName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                {(s.addressLine1 || s.city) && (
                  <div className="text-sm text-muted-foreground">
                    {s.addressLine1 && <p>{s.addressLine1}</p>}
                    {s.addressLine2 && <p>{s.addressLine2}</p>}
                    <p>
                      {[s.suburb, s.city, s.postCode].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}
                {s.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{s.phone}</span>
                  </div>
                )}
                {s.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{s.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
