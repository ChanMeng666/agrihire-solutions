import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
            <div className="h-[300px] bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
            <div className="h-[300px] bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
