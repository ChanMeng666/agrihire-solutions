import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tractor,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { getFeaturedProducts, getActiveCategories } from "@/server/queries/products";
import { getActivePromotions } from "@/server/queries/promotions";

const FEATURES = [
  {
    icon: Tractor,
    title: "Wide Range of Equipment",
    description:
      "From tractors to harvesters, we have the machinery you need for every agricultural task.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description:
      "All equipment is regularly serviced and maintained to ensure reliable performance.",
  },
  {
    icon: Clock,
    title: "Flexible Hire Periods",
    description:
      "Hire by the hour, day, or week. Our tiered pricing gives you the best value.",
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    description:
      "Pick up and return equipment at any of our convenient store locations across NZ.",
  },
];

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = [];
  let featuredProducts: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  let promotions: Awaited<ReturnType<typeof getActivePromotions>> = [];

  try {
    [categories, featuredProducts, promotions] = await Promise.all([
      getActiveCategories(),
      getFeaturedProducts(6),
      getActivePromotions(),
    ]);
  } catch {
    // DB not connected yet — show static fallback
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/30">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
              Trusted by farms across New Zealand
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Agricultural Equipment{" "}
              <span className="text-primary">Hire Made Simple</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Access quality farming machinery without the cost of ownership.
              Browse, book, and pick up equipment from your nearest store.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/for-hire">
                <Button size="lg" className="px-8 text-base">
                  Browse Equipment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/stores">
                <Button variant="outline" size="lg" className="px-8 text-base">
                  Find a Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Equipment Categories
              </h2>
              <p className="mt-3 text-muted-foreground">
                Find the right machinery for your needs
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((cat) => (
                <Link key={cat.categoryCode} href={`/for-hire/${cat.categoryCode}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/30">
                    <CardContent className="flex flex-col items-center text-center p-8">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Tractor className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-semibold">{cat.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Featured Equipment
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Popular equipment available for hire
                </p>
              </div>
              <Link href="/for-hire">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((p) => (
                <Link
                  key={p.productCode}
                  href={`/for-hire/${p.categoryCode}/${p.productCode}`}
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
                        <Tractor className="h-12 w-12 text-muted-foreground/20" />
                      )}
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {p.categoryName}
                      </Badge>
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-primary">
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
          </div>
        </section>
      )}

      {/* Active Promotions */}
      {promotions.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">
                Current Promotions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Save on your next equipment hire
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {promotions.slice(0, 3).map((promo) => (
                <Link key={promo.promoCode} href="/promotions">
                  <Card className="border-primary/20 transition-all hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                      <Badge className="text-lg px-4 py-1 mb-3">
                        {promo.discRate}% OFF
                      </Badge>
                      <h3 className="font-semibold">
                        {promo.name || promo.promoCode}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {promo.storeName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Code: <span className="font-mono">{promo.promoCode}</span>
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose AgriHire
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need for a smooth equipment hire experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
            <CardContent className="flex flex-col items-center text-center p-12 md:p-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-lg">
                Create an account today and start hiring the equipment you
                need. No long-term commitments, flexible pricing.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="px-8 text-base"
                  >
                    Create Account
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
