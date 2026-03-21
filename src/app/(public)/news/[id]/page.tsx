import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsById } from "@/server/queries/news";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsById(Number(id));
  return { title: article?.title || "News Article" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsById(Number(id));

  if (!article) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/news">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Button>
        </Link>

        <article className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {article.createDate
                  ? new Date(article.createDate).toLocaleDateString("en-NZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </span>
              <Badge variant="secondary">{article.storeName}</Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
