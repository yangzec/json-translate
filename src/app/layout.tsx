import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JSON Translation Tool - AI-Powered JSON i18n Translation | Free Online Tool",
  description: "Free online JSON translation tool for i18n. AI-powered, supports 40+ languages, preserves JSON structure. Perfect for developers and localization teams.",
  keywords: "JSON translation, i18n tool, internationalization, localization, AI translation, developer tools, JSON converter",
  openGraph: {
    title: "JSON Translation Tool - AI-Powered JSON i18n Translation",
    description: "Transform your JSON files into multiple languages instantly. AI-powered translation tool that maintains JSON structure integrity.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JSON Translation Tool Preview"
      }
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Translation Tool - AI-Powered JSON i18n Translation",
    description: "Transform your JSON files into multiple languages instantly. AI-powered translation tool that maintains JSON structure integrity.",
    images: ["/og-image.png"],
    creator: "@decohack"
  },
  alternates: {
    canonical: "https://yourdomain.com",
    languages: {
      'en-US': 'https://yourdomain.com/en',
      'zh-CN': 'https://yourdomain.com/zh',
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
        <Toaster />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "JSON Translation Tool",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "AI-powered JSON translation tool for internationalization",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            }
          })}
        </script>
      </body>
    </html>
  );
}
