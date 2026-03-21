import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Get in touch with our team</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Phone, label: "Phone", value: "0800 AGRIHIRE" },
            { icon: Mail, label: "Email", value: "info@agrihire.co.nz" },
            { icon: MapPin, label: "Locations", value: "Multiple stores NZ-wide" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill in the form below and we&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us more..." rows={5} />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
