import Link from "next/link";
import { getActiveNews } from "@/server/queries/news";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Calendar } from "lucide-react";

export const metadata = { title: "News" };

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsPage() {
  const newsList = await getActiveNews();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">News</h1>
      <p className="text-muted-foreground mb-8">
        Latest updates from AgriHire
      </p>

      {newsList.length === 0 ? (
        <div className="text-center py-20">
          <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No news articles yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {newsList.map((article) => (
            <Link key={article.newsId} href={`/news/${article.newsId}`}>
              <Card className="transition-all hover:shadow-md hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h2 className="text-lg font-semibold line-clamp-1">
                        {article.title}
                      </h2>
                      {article.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.content}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.createDate)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {article.storeName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
