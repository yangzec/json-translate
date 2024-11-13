"use client"

import { Input } from "@/components/ui/input"
import { useTranslate } from "@/context/TranslateContext"
import { useToast } from "@/hooks/use-toast"
import { parseJson } from "@/lib/json-utils"
import { UploadIcon, FileJson2Icon } from "lucide-react"
import { useState } from "react"

export function FileUpload() {
  const [isUploaded, setIsUploaded] = useState(false)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null)
  const { toast } = useToast()
  const { setFile, apiKey, setApiKey } = useTranslate()
  
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
      const text = await file.text()
      const result = parseJson(text.trim())
      
      if (!result.success) {
        throw new Error(result.error || '无效的JSON格式')
      }

      // 检查是否为空对象
      if (Object.keys(result.data).length === 0) {
        throw new Error('JSON文件不能为空')
      }

      setFile(file)
      setIsUploaded(true)
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size)
      })
      toast({
        title: "成功",
        description: "文件上传成功"
      })
      
    } catch (err) {
      setIsUploaded(false)
      setFileInfo(null)
      toast({
        variant: "destructive",
        title: "JSON格式错误",
        description: err instanceof Error ? err.message : "文件格式无效，请检查是否为正确的JSON文件"
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      const event = { target: { files } } as React.ChangeEvent<HTMLInputElement>
      handleUpload(event)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-xl space-y-4">
      <div>
        <label 
          htmlFor="dropzone-file" 
          className={`flex flex-col items-center justify-center w-full py-9 border border-dashed rounded-2xl cursor-pointer transition-colors
            ${isUploaded 
              ? 'border-green-500 bg-green-50 hover:bg-green-100' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mb-3 flex items-center justify-center">
            {isUploaded ? (
              <FileJson2Icon className="w-10 h-10 text-green-600" />
            ) : (
              <UploadIcon className="w-10 h-10 text-indigo-600" />
            )}
          </div>
          {fileInfo ? (
            <>
              <span className="text-center text-gray-900 text-sm font-medium leading-5 mb-1">
                {fileInfo.name}
              </span>
              <span className="text-center text-gray-500 text-xs">
                {fileInfo.size}
              </span>
            </>
          ) : (
            <>
              <span className="text-center text-gray-400 text-xs font-normal leading-4 mb-1">
                支持.json格式文件，最大10MB
              </span>
              <h6 className="text-center text-gray-900 text-sm font-medium leading-5">
                拖拽文件到这里或点击上传
              </h6>
            </>
          )}
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".json"
            onChange={handleUpload}
          />
        </label>
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
    </div>
  )
} 