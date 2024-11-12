"use client"

import { useTranslate } from "@/context/TranslateContext"
import { useState, useEffect } from "react"

export function JsonPreview() {
  const { file, translatedContent, streamContent } = useTranslate()
  const [sourceContent, setSourceContent] = useState<string>("")

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const formatted = JSON.stringify(JSON.parse(content), null, 2)
          setSourceContent(formatted)
        } catch (error) {
          console.error('JSON解析错误:', error)
        }
      }
      reader.readAsText(file)
    }
  }, [file])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">原文</h3>
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
          <code>{sourceContent || '请上传JSON文件'}</code>
        </pre>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">译文</h3>
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
          <code>{streamContent || translatedContent || '翻译结果将显示在这里'}</code>
        </pre>
      </div>
    </div>
  )
} 