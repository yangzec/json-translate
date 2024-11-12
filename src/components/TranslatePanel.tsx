"use client"

import { useState } from "react"
import { useTranslate } from "@/context/TranslateContext"
import { translate } from "@/lib/openai"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function TranslatePanel() {
  const { 
    file, 
    sourceLang, 
    setSourceLang,
    targetLang, 
    setTargetLang,
    apiKey,
    setApiKey,
    isTranslating,
    setIsTranslating,
    setTranslatedContent
  } = useTranslate()
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!file || !apiKey) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请上传文件并输入API Key"
      })
      return
    }

    setIsTranslating(true)
    setError("")

    // 添加超时控制
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('翻译超时,请重试')), 30000)
    })

    try {
      const reader = new FileReader()
      
      const readFilePromise = new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result)
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsText(file)
      })

      // 使用 Promise.race 实现超时控制
      const content = await Promise.race([readFilePromise, timeoutPromise])
      
      // 验证JSON格式和大小
      try {
        const jsonContent = JSON.parse(content as string)
        const jsonSize = new Blob([JSON.stringify(jsonContent)]).size
        
        if (jsonSize > 10 * 1024 * 1024) {
          throw new Error('JSON内容超过10MB限制')
        }

        const result = await translate(content as string, targetLang, apiKey)
        setTranslatedContent(result)
        
        toast({
          title: "成功",
          description: "翻译完成！"
        })
        
      } catch (err) {
        if (err instanceof SyntaxError) {
          throw new Error('JSON格式无效')
        }
        throw err
      }

    } catch (err: unknown) {
      console.error('翻译错误:', err)
      if (err instanceof Error) {
        // 根据不同错误类型显示不同提示
        const errorMap: Record<string, string> = {
          'API Key 无效或已过期': '请检查API Key是否正确',
          'API 调用次数已达上限': '已达到API使用限制,请稍后重试',
          '翻译超时,请重试': '网络请求超时,请检查网络后重试',
          'JSON格式无效': '文件格式错误,请上传有效的JSON文件',
          'JSON内容超过10MB限制': '文件内容过大,请分批处理'
        }
        setError(errorMap[err.message] || err.message)
        toast({
          variant: "destructive",
          title: "错误",
          description: err.message
        })
      } else {
        setError('发生未知错误,请重试')
        toast({
          variant: "destructive",
          title: "错误",
          description: '发生未知错误,请重试'
        })
      }
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">源语言</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full rounded-md border p-2 mt-1"
          >
            <option value="en">英语</option>
            <option value="zh">中文</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">目标语言</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full rounded-md border p-2 mt-1"
          >
            <option value="zh">中文</option>
            <option value="en">英语</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">OpenAI API Key</label>
        <Input 
          type="password" 
          placeholder="sk-..." 
          className="mt-1"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button 
        className="w-full" 
        onClick={handleTranslate}
        disabled={isTranslating || !file || !apiKey}
      >
        {isTranslating ? "翻译中..." : "开始翻译"}
      </Button>
    </div>
  )
} 