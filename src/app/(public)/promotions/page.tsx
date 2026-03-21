import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

export const metadata = { title: "Promotions" };

export default function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Promotions</h1>
      <p className="text-muted-foreground mb-8">Current deals and discounts</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="h-5 w-5 text-primary" />
                <div className="h-5 w-40 bg-muted rounded" />
              </div>
              <div className="h-3 w-full bg-muted rounded mb-2" />
              <div className="h-3 w-2/3 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
