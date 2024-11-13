"use client"

import { Input } from "@/components/ui/input"
import { useTranslate } from "@/context/TranslateContext"
import { useToast } from "@/hooks/use-toast"
import { parseJson } from "@/lib/json-utils"
import { UploadIcon, FileJson2Icon, KeyIcon, Languages, FileIcon } from "lucide-react"
import { useState } from "react"

export function FileUpload() {
  const [isUploaded, setIsUploaded] = useState(false)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null)
  const { toast } = useToast()
  const { setFile, apiKey, setApiKey, resetTranslation } = useTranslate()
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    
    if (!files || !files[0]) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file"
      })
      return
    }

    const file = files[0]
    
    // 检查文件扩展名
    if (!file.name.endsWith('.json')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a file with a .json extension"
      })
      return
    }

    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size cannot exceed 10MB"
      })
      return
    }

    // 验证JSON内容
    try {
      const text = await file.text()
      const result = parseJson(text.trim())
      
      if (!result.success) {
        throw new Error(result.error || 'Invalid JSON format')
      }

      // 检查是否为空对象
      if (Object.keys(result.data).length === 0) {
        throw new Error('JSON file cannot be empty')
      }

      setFile(file)
      setIsUploaded(true)
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size)
      })
      resetTranslation()
      toast({
        title: "Success",
        description: "File uploaded successfully"
      })
      
    } catch (err) {
      setIsUploaded(false)
      setFileInfo(null)
      toast({
        variant: "destructive",
        title: "JSON Format Error",
        description: err instanceof Error ? err.message : "Invalid file format, please check if it is a correct JSON file"
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
          className={`flex flex-col items-center justify-center w-full py-16 border border-dashed rounded-2xl cursor-pointer transition-colors
            ${isUploaded 
              ? 'border-blue-500 bg-blue-50 hover:bg-blue-100/50' 
              : 'border-blue-300 bg-blue-50 hover:bg-blue-100/50'
            }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mb-3 flex items-center justify-center">
            {isUploaded ? (
              <FileJson2Icon className="w-10 h-10 text-blue-600" />
            ) : (
              <UploadIcon className="w-10 h-10 text-blue-600" />
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
                Supports .json format files, up to 10MB
              </span>
              <h6 className="text-center text-gray-900 text-sm font-medium leading-5">
                Drag files here or click to upload
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
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <KeyIcon className="w-5 h-5" />
          OpenAI API Key
        </h2>
        <p className="text-xs text-muted-foreground pb-2">
          Tips: OpenAI API Key is required for translation.
        </p>
        <Input 
          type="password" 
          placeholder="sk-..." 
          className="mt-1 shadow-none"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        
      </div>
    </div>
  )
} 