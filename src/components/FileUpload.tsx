"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslate } from "@/context/TranslateContext"
import { useToast } from "@/hooks/use-toast"
import { parseJson } from "@/lib/json-utils"

export function FileUpload() {
  const { toast } = useToast()
  const { setFile } = useTranslate()
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    
    if (!files || !files[0]) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请选择文件"
      })
      return
    }

    const file = files[0]
    
    // 检查文件扩展名
    if (!file.name.endsWith('.json')) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请上传.json后缀的文件"
      })
      return
    }

    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "文件大小不能超过10MB"
      })
      return
    }

    // 验证JSON内容
    try {
      const text = await file.text() // 使用更现代的API读取文件
      const result = parseJson(text.trim()) // 使用工具函数解析
      
      if (!result.success) {
        throw new Error(result.error || '无效的JSON格式')
      }

      // 检查是否为空对象
      if (Object.keys(result.data).length === 0) {
        throw new Error('JSON文件不能为空')
      }

      setFile(file)
      toast({
        title: "成功",
        description: "文件上传成功"
      })
      
    } catch (err) {
      toast({
        variant: "destructive",
        title: "JSON格式错误",
        description: err instanceof Error ? err.message : "文件格式无效，请检查是否为正确的JSON文件"
      })
    }
  }

  return (
    <div className="w-full max-w-xl">
      <Input 
        type="file" 
        accept=".json"
        onChange={handleUpload}
        className="mb-2"
      />
      <p className="text-sm text-muted-foreground mb-2">
        支持.json格式文件，最大10MB
      </p>
      <Button className="w-full">
        上传JSON文件
      </Button>
    </div>
  )
} 