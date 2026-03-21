import { Card, CardContent } from "@/components/ui/card";

export default function PublicLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
      <div className="h-4 w-96 bg-muted rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            <CardContent className="p-5 space-y-3">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
