import { Card, CardContent } from "@/components/ui/card";

export default function AuthLoading() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-56 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
