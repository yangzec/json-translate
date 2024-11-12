"use client"

import { useTranslate } from "@/context/TranslateContext"
import { useState, useEffect } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from "./ui/button"
import { CopyIcon, ExpandIcon, ShrinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function JsonPreview() {
  const { file, translatedContent, streamContent } = useTranslate()
  const [sourceContent, setSourceContent] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { toast } = useToast()

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
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ExpandIcon className="h-4 w-4" /> : <ShrinkIcon className="h-4 w-4" />}
          {isCollapsed ? '展开' : '折叠'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">原文</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(sourceContent)}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <SyntaxHighlighter 
              language="json"
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: '0.375rem',
                maxHeight: '500px',
                fontSize: '14px'
              }}
              showLineNumbers={true}
              wrapLines={true}
              lineProps={{
                style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
              }}
            >
              {formatJson(sourceContent) || '请上传JSON文件'}
            </SyntaxHighlighter>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">译文</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(streamContent || translatedContent)}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <SyntaxHighlighter 
              language="json"
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: '0.375rem',
                maxHeight: '500px',
                fontSize: '14px'
              }}
              showLineNumbers={true}
              wrapLines={true}
              lineProps={{
                style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
              }}
            >
              {formatJson(streamContent || translatedContent) || '翻译结果将显示在这里'}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  )
} 