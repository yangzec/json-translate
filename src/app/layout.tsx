import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { TranslateProvider } from "@/context/TranslateContext";
import { locales } from "@/config/i18n";
import { defaultLocale } from "@/config/i18n";
import { notFound } from "next/navigation";

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang = await params.lang || defaultLocale;

  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <TranslateProvider>
          <Navbar />
          {children}
          <Toaster />
        </TranslateProvider>
      </body>
    </html>
  )
}
