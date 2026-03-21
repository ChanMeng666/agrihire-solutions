import Link from "next/link";
import { getActivePromotions, getPromotionProducts } from "@/server/queries/promotions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Calendar, Tractor } from "lucide-react";

export const metadata = { title: "Promotions" };

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function PromotionsPage() {
  const promotions = await getActivePromotions();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Promotions</h1>
      <p className="text-muted-foreground mb-8">
        Current deals and discounts on equipment hire
      </p>

      {promotions.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            No active promotions at the moment. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {promotions.map((promo) => (
            <Card
              key={promo.promoCode}
              className="border-primary/20 overflow-hidden"
            >
              <CardHeader className="bg-primary/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {promo.name || promo.promoCode}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {promo.storeName}
                      </p>
                    </div>
                  </div>
                  <Badge className="w-fit text-base px-4 py-1">
                    {promo.discRate}% OFF
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {promo.description && (
                  <p className="text-muted-foreground">{promo.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Valid: {formatDate(promo.startDate)} &mdash;{" "}
                    {formatDate(promo.endDate)}
                  </span>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    Use code: {promo.promoCode}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
