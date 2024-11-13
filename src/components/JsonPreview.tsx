"use client"

import { useTranslate } from "@/context/TranslateContext"
import { useState, useEffect, memo, useRef } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from "./ui/button"
import { CopyIcon, ExpandIcon, ShrinkIcon, DownloadIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JSZip from 'jszip'
import dynamic from 'next/dynamic';

const VirtualizedJson = dynamic(() => import('./VirtualizedJson'), {
  ssr: false
});

export function JsonPreview() {
  const { file, translatedResults, streamContent, isTranslating, currentTranslatingLang } = useTranslate()
  const [sourceContent, setSourceContent] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("")
  const { selectedLangs } = useTranslate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  const languageLabels: Record<string, string> = {
    zh: '中文',
    en: '英语',
    ja: '日语',
    ko: '韩语',
    fr: '法语',
    de: '德语',
    es: '西班牙语',
    it: '意大利语',
    pt: '葡萄牙语',
    nl: '荷兰语',
    pl: '波兰语'
  }

  useEffect(() => {
    if (file) {
      setIsLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const formatted = JSON.stringify(JSON.parse(content), null, 2)
          setSourceContent(formatted)
        } catch (error) {
          console.error('JSON解析错误:', error)
        } finally {
          setIsLoading(false)
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

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setContainerSize(prev => ({ ...prev, width }));
    }
  }, []);

  const formatJson = (jsonString: string) => {
    try {
      // 如果是空字符串或提示文本，直接返回
      if (!jsonString || 
          jsonString === '请上传JSON文件' || 
          jsonString === '翻译结果将显示在这里') {
        return jsonString;
      }
      
      // 处理流式输出的情况
      if (isTranslating) {
        try {
          // 尝试将内容包装成完整的JSON对象
          const wrappedContent = `{"temp": ${jsonString}}`;
          const parsed = JSON.parse(wrappedContent);
          return JSON.stringify(parsed.temp, null, isCollapsed ? 0 : 2);
        } catch {
          // 如果解析失败，进行基本的格式化
          return jsonString
            .split(',')
            .map(line => line.trim())
            .join(',\n  ');
        }
      }
      
      // 非流式输出情况，正常解析和格式化
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, isCollapsed ? 0 : 2);
    } catch (e) {
      // 如果所有尝试都失败，返回原始字符串
      return jsonString;
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

  const handleDownload = (lang: string) => {
    const result = translatedResults.find(r => r.lang === lang)
    if (!result) return

    try {
      const blob = new Blob([result.content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `translated_${lang}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "成功",
        description: `${languageLabels[lang]}翻译文件已下载`
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "下载失败，请重试"
      })
    }
  }

  const handleDownloadAll = () => {
    try {
      // 创建一个 zip 文件
      const zip = new JSZip()
      
      // 添加所有翻译结果到 zip
      translatedResults.forEach(result => {
        zip.file(`translated_${result.lang}.json`, result.content)
      })
      
      // 生成并下载 zip 文件
      zip.generateAsync({ type: "blob" }).then(content => {
        const url = URL.createObjectURL(content)
        const a = document.createElement('a')
        a.href = url
        a.download = 'translations.zip'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast({
          title: "成功",
          description: "所有翻译文件已下载"
        })
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "下载失败，请重试"
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
        {isLoading ? (
          <div className="flex items-center justify-center h-[500px]">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <div ref={containerRef} className="h-[500px] overflow-hidden">
            {sourceContent ? (
              <VirtualizedJson
                content={formatJson(sourceContent)}
                height={containerSize.height}
                width={containerSize.width}
                showLineNumbers={true}
              />
            ) : (
              <VirtualizedJson
                content={`{
  // 请上传 JSON 文件
}`}
                height={containerSize.height}
                width={containerSize.width}
                showLineNumbers={false}
              />
            )}
          </div>
        )}
      </div>

      {/* 右侧译文 */}
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">译文</h3>
          <div className="flex items-center gap-2">
            {activeTab && translatedResults.find(r => r.lang === activeTab) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(activeTab)}
                className="flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                下载{languageLabels[activeTab]}翻译
              </Button>
            )}
            {translatedResults.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                className="flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                下载所有译文
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue={selectedLangs[0]} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <VirtualizedJson
            content={formatJson(
              isTranslating && activeTab === currentTranslatingLang
                ? streamContent
                : (translatedResults.find(r => r.lang === activeTab)?.content || `{
  // 翻译结果将显示在这里
}`)
            )}
            height={containerSize.height}
            width={containerSize.width}
            showLineNumbers={true}
          />

          <TabsList>
            {selectedLangs.map(lang => (
              <TabsTrigger key={lang} value={lang}>
                {languageLabels[lang]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
} 