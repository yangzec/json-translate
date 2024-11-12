"use client"

import { useTranslate } from "@/context/TranslateContext"
import { useState, useEffect } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from "./ui/button"
import { CopyIcon, ExpandIcon, ShrinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function JsonPreview() {
  const { file, translatedResults, streamContent, isTranslating, currentTranslatingLang } = useTranslate()
  const [sourceContent, setSourceContent] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("")
  const { selectedLangs } = useTranslate()
  const { toast } = useToast()

  const languageLabels: Record<string, string> = {
    zh: '中文',
    en: '英语',
    ja: '日语',
    ko: '韩语',
    fr: '法语',
    de: '德语'
  }

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

  useEffect(() => {
    if (selectedLangs.length > 0) {
      setActiveTab(selectedLangs[0])
    }
  }, [])

  useEffect(() => {
    if (selectedLangs.length > 0 && (!activeTab || !selectedLangs.includes(activeTab))) {
      setActiveTab(selectedLangs[0])
    }
  }, [selectedLangs, activeTab])

  const formatJson = (jsonString: string) => {
    try {
      // 如果是空字符串或提示文本，直接返回
      if (!jsonString || 
          jsonString === '请上传JSON文件' || 
          jsonString === '翻译结果将显示在这里') {
        return jsonString
      }
      
      // 解析并格式化 JSON
      const obj = JSON.parse(jsonString)
      return JSON.stringify(obj, null, isCollapsed ? 0 : 2)
    } catch (e) {
      return jsonString
    }
  }

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "已复制",
        description: "内容已复制到剪贴板"
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "请手动复制内容"
      })
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 左侧原文 */}
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">原文</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ExpandIcon className="h-4 w-4" /> : <ShrinkIcon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(sourceContent)}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <SyntaxHighlighter 
          language="json"
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
            fontSize: '14px'
          }}
        >
          {formatJson(sourceContent)}
        </SyntaxHighlighter>
      </div>

      {/* 右侧译文 */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">译文</h3>
        
        <Tabs defaultValue={selectedLangs[0]} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            {selectedLangs.map(lang => (
              <TabsTrigger key={lang} value={lang}>
                {languageLabels[lang]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {selectedLangs.map(lang => {
            const result = translatedResults.find(r => r.lang === lang)
            return (
              <TabsContent key={lang} value={lang}>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => handleCopy(result?.content || '')}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                  <SyntaxHighlighter 
                    language="json"
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.375rem',
                      fontSize: '14px'
                    }}
                  >
                    {formatJson(
                      isTranslating && activeTab === lang && !result?.content
                        ? (currentTranslatingLang === lang ? streamContent : '{}')
                        : (result?.content || '{}')
                    )}
                  </SyntaxHighlighter>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
} 