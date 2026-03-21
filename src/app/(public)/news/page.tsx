import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "News" };

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">News</h1>
      <p className="text-muted-foreground mb-8">Latest updates from AgriHire</p>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-5 w-64 bg-muted rounded mb-3" />
              <div className="h-3 w-full bg-muted rounded mb-2" />
              <div className="h-3 w-3/4 bg-muted rounded mb-4" />
              <div className="h-3 w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
