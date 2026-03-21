import { Card, CardContent } from "@/components/ui/card";

export default function CustomerLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
      <div className="space-y-4 max-w-3xl">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
