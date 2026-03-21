import { Card, CardContent } from "@/components/ui/card";
import { Tractor } from "lucide-react";

export const metadata = { title: "Equipment for Hire" };

export default function ForHirePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Equipment for Hire</h1>
      <p className="text-muted-foreground mb-8">Browse our full range of agricultural equipment</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <Tractor className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <CardContent className="p-5">
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
