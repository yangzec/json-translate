import { defaultLocale, locales } from '@/config/i18n'
import { notFound } from 'next/navigation'
import { TranslateProvider } from '@/context/TranslateContext'
import { getDictionary } from '@/lib/getDictionary'

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang = params.lang || defaultLocale;

  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <TranslateProvider>
      <div lang={lang}>
        {children}
      </div>
    </TranslateProvider>
  )
} 