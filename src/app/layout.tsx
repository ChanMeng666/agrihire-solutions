import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agrihire.chanmeng.org"),
  title: {
    default: "AgriHire Solutions",
    template: "%s | AgriHire Solutions",
  },
  description:
    "New Zealand's trusted agricultural equipment hire service. Quality machinery for farms of all sizes.",
  openGraph: {
    title: "AgriHire Solutions",
    description: "Agricultural equipment hire made simple — across New Zealand.",
    type: "website",
    siteName: "AgriHire Solutions",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "AgriHire Solutions — agricultural equipment hire made simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriHire Solutions",
    description: "Agricultural equipment hire made simple — across New Zealand.",
    images: ["/og-cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
