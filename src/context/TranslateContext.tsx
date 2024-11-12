"use client"

import { createContext, useContext, useState } from 'react'

interface TranslateContextType {
  file: File | null
  setFile: (file: File | null) => void
  sourceLang: string
  setSourceLang: (lang: string) => void
  targetLang: string
  setTargetLang: (lang: string) => void
  apiKey: string
  setApiKey: (key: string) => void
  isTranslating: boolean
  setIsTranslating: (status: boolean) => void
  translatedContent: string
  setTranslatedContent: (content: string) => void
  progress: number
  setProgress: (progress: number) => void
  cancelTranslation: boolean
  setCancelTranslation: (cancel: boolean) => void
  streamContent: string
  setStreamContent: (content: string) => void
}

const TranslateContext = createContext<TranslateContextType | undefined>(undefined)

export function TranslateProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<File | null>(null)
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('zh')
  const [apiKey, setApiKey] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedContent, setTranslatedContent] = useState('')
  const [progress, setProgress] = useState(0)
  const [cancelTranslation, setCancelTranslation] = useState(false)
  const [streamContent, setStreamContent] = useState('')

  return (
    <TranslateContext.Provider value={{
      file,
      setFile,
      sourceLang,
      setSourceLang,
      targetLang,
      setTargetLang,
      apiKey,
      setApiKey,
      isTranslating,
      setIsTranslating,
      translatedContent,
      setTranslatedContent,
      progress,
      setProgress,
      cancelTranslation,
      setCancelTranslation,
      streamContent,
      setStreamContent,
    }}>
      {children}
    </TranslateContext.Provider>
  )
}

export function useTranslate() {
  const context = useContext(TranslateContext)
  if (context === undefined) {
    throw new Error('useTranslate must be used within a TranslateProvider')
  }
  return context
} 