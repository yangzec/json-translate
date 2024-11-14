'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames } from '@/config/i18n'
import { useState, useEffect } from 'react'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentLang, setCurrentLang] = useState('')
  
  useEffect(() => {
    setMounted(true)
    setCurrentLang(pathname.split('/')[1])
  }, [pathname])

  const handleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLang}`, `/${newLocale}`)
    router.push(newPath)
  }

  if (!mounted) return null

  return (
    <select 
      onChange={(e) => handleChange(e.target.value)}
      value={currentLang}
      className="bg-transparent"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {localeNames[locale as keyof typeof localeNames]}
        </option>
      ))}
    </select>
  )
} 