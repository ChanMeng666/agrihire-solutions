import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export const metadata = { title: "Our Stores" };

export default function StoresPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Our Stores</h1>
      <p className="text-muted-foreground mb-8">Find your nearest AgriHire location</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="h-4 w-32 bg-muted rounded mb-2" />
                  <div className="h-3 w-48 bg-muted rounded mb-1" />
                  <div className="h-3 w-36 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
