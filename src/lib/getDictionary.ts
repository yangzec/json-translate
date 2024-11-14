

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  zh: () => import('@/dictionaries/zh.json').then(module => module.default),
  ja: () => import('@/dictionaries/ja.json').then(module => module.default),
}

export const getDictionary = async (locale: string) => {
  try {
    if (!(locale in dictionaries)) {
      console.warn(`Dictionary not found for locale: ${locale}, falling back to English`)
      return await dictionaries.en()
    }
    return await dictionaries[locale as keyof typeof dictionaries]()
  } catch (error) {
    console.error(`Failed to load dictionary for ${locale}`, error)
    return await dictionaries.en()
  }
} 