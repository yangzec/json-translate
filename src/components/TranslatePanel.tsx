"use client"

import { useState } from "react"
import { useTranslate } from "@/context/TranslateContext"
import { translate } from "@/lib/openai"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

interface TranslatedResult {
  lang: string;
  content: string;
}

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
    setTranslatedContent,
    progress,
    setProgress,
    cancelTranslation,
    setCancelTranslation,
    streamContent,
    setStreamContent,
    translatedResults,
    setTranslatedResults,
    selectedLangs,
    setSelectedLangs,
    currentTranslatingLang,
    setCurrentTranslatingLang,
    totalProgress,
    estimatedTime,
    setTotalProgress,
    setEstimatedTime
  } = useTranslate()
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [controller, setController] = useState<AbortController | null>(null)

  const languageOptions = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: '英语' },
    { value: 'ja', label: '日语' },
    { value: 'ko', label: '韩语' },
    { value: 'fr', label: '法语' },
    { value: 'de', label: '德语' },
  ]

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.ceil(seconds)}秒`
    return `${Math.ceil(seconds / 60)}分钟`
  }

  const handleTranslate = async () => {
    if (!file || !apiKey) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请上传文件并输入API Key"
      })
      return
    }

    const controller = new AbortController();
    const signal = controller.signal;
    
    setIsTranslating(true)
    setError("")
    setProgress(0)
    setCancelTranslation(false)

    try {
      const reader = new FileReader()
      let progressInterval: NodeJS.Timeout | undefined
      
      const readFilePromise = new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string)
          } else {
            reject(new Error('文件内容为空'))
          }
        }
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsText(file)
      })

      const content = await readFilePromise
      
      try {
        const jsonContent = JSON.parse(content as string)
        const jsonSize = new Blob([JSON.stringify(jsonContent)]).size
        
        if (jsonSize > 10 * 1024 * 1024) {
          throw new Error('JSON内容超过10MB限制')
        }

        const untranslatedLangs = selectedLangs.filter(lang => 
          !translatedResults.some(r => r.lang === lang)
        )

        const startTime = Date.now()
        let completedLangs = 0
        const results: TranslatedResult[] = [...translatedResults]

        for (const lang of untranslatedLangs) {
          setCurrentTranslatingLang(lang)
          
          const result = await translate(
            content,
            lang,
            apiKey,
            signal,
            (progress) => {
              const singleLangWeight = 100 / untranslatedLangs.length
              const totalProgress = (completedLangs * singleLangWeight) + (progress * singleLangWeight / 100)
              setTotalProgress(Math.round(totalProgress))
              
              const elapsed = (Date.now() - startTime) / 1000
              const estimatedTotal = (elapsed / totalProgress) * 100
              const remaining = Math.max(0, estimatedTotal - elapsed)
              setEstimatedTime(remaining)
            },
            (chunk) => {
              setStreamContent(chunk)
            }
          )
          
          results.push({
            lang,
            content: result
          })
          setTranslatedResults([...results])
          completedLangs++
        }

        clearInterval(progressInterval)
        setProgress(100)
        setStreamContent('')

        toast({
          title: "成功",
          description: untranslatedLangs.length > 0 
            ? "翻译完成！" 
            : "所选语言已全部翻译完成"
        })

      } catch (err) {
        clearInterval(progressInterval)
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
          'JSON内容超过10MB限制': '文件内容过大,请分批处理',
          '翻译已取消': '翻译已被用户取消',
          'Network Error': '网络连接错误,请检查网络设置',
          'Rate limit exceeded': 'API调用频率超限,请稍后重试',
          'Service unavailable': '服务暂时不可用,请稍后重试'
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
      setTotalProgress(0)
      setEstimatedTime(0)
      setCurrentTranslatingLang(null)
      setIsTranslating(false)
    }
  }

  const handleCancel = () => {
    if (controller) {
      controller.abort()
      setController(null)
    }
    setCancelTranslation(true)
    setIsTranslating(false)
    setProgress(0)
    setTotalProgress(0)
    setEstimatedTime(0)
    setCurrentTranslatingLang(null)
    setStreamContent('')
    toast({
      title: "已取消",
      description: "翻译已取消"
    })
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

      {isTranslating && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>总体进度 ({totalProgress}%)</span>
              <span>预计剩余时间: {formatTime(estimatedTime)}</span>
            </div>
            <Progress value={totalProgress} className="w-full" />
          </div>
          
          {currentTranslatingLang && (
            <div className="text-sm text-muted-foreground">
              正在翻译: {
                languageOptions.find(opt => opt.value === currentTranslatingLang)?.label || currentTranslatingLang
              }
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          className="flex-1" 
          onClick={handleTranslate}
          disabled={isTranslating || !file || !apiKey}
        >
          {isTranslating ? "翻译中..." : "开始翻译"}
        </Button>

        {isTranslating && (
          <Button 
            variant="outline"
            onClick={handleCancel}
            className="w-24"
          >
            取消
          </Button>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">目标语言</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {languageOptions.map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedLangs.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLangs([...selectedLangs, option.value])
                  } else {
                    setSelectedLangs(selectedLangs.filter(l => l !== option.value))
                  }
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
} 