import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductsByCategory,
  getActiveCategories,
} from "@/server/queries/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tractor, ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryCode: string }>;
}) {
  const { categoryCode } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find((c) => c.categoryCode === categoryCode);
  return { title: cat ? `${cat.name} - Equipment` : "Equipment" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryCode: string }>;
}) {
  const { categoryCode } = await params;
  const [products, categories] = await Promise.all([
    getProductsByCategory(categoryCode),
    getActiveCategories(),
  ]);

  const currentCategory = categories.find(
    (c) => c.categoryCode === categoryCode
  );
  if (!currentCategory) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/for-hire">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentCategory.name}
          </h1>
          <p className="text-muted-foreground">
            {products.length} item{products.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/for-hire">
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-1.5 text-sm hover:bg-accent"
          >
            All
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.categoryCode} href={`/for-hire/${cat.categoryCode}`}>
            <Badge
              variant={
                cat.categoryCode === categoryCode ? "default" : "outline"
              }
              className="cursor-pointer px-4 py-1.5 text-sm hover:bg-accent"
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Tractor className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            No equipment in this category at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.productCode}
              href={`/for-hire/${categoryCode}/${p.productCode}`}
            >
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <Tractor className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <p className="mt-3 text-lg font-bold text-primary">
                    ${p.priceA}
                    <span className="text-sm font-normal text-muted-foreground">
                      /day
                    </span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
