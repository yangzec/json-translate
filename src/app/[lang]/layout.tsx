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
  
  // 导入对应语言的字典
  const dict = await import(`@/dictionaries/${params.lang}.json`).then(
    (module) => module.default
  );

  // 构建语言替代链接对象
  const languageAlternates = {
    'en': '/en',
    'zh': '/zh',
    'zh-TW': '/zh-TW',
    'ja': '/ja',
    'ko': '/ko',
    'fr': '/fr',
    'de': '/de',
    'es': '/es',
    'pt': '/pt',
    'it': '/it',
    'ru': '/ru',
    'ar': '/ar',
    'el': '/el',
    'nl': '/nl',
    'id': '/id',
    'pl': '/pl',
    'th': '/th',
    'tr': '/tr',
    'vi': '/vi'
  }

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/favicon.png',
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      locale: params.lang,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: dict.metadata.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.title,
      description: dict.metadata.description,
      images: ['/og-image.png']
    },
    alternates: {
      languages: languageAlternates
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

type LayoutProps = {
  children: React.ReactNode;
  params: {
    lang: string;
  };
};

export default function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  if (!locales.includes(params.lang)) {
    notFound()
  }

  return (
    <html lang={params.lang} suppressHydrationWarning>
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