import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { TranslateProvider } from "@/context/TranslateContext";
import { locales, defaultLocale } from "@/config/i18n";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// ... metadata 配置保持不变 ...

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang
  
  return {
    title: 'JSON Translater',
    description: 'A JSON translation tool powered by AI'
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={cn(
        geistSans.variable,
        geistMono.variable,
        "min-h-screen bg-background font-sans antialiased"
      )}>
        <TranslateProvider>
          <Navbar />
          {children}
          <Toaster />
        </TranslateProvider>
      </body>
    </html>
  )
} 