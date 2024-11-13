"use client"

import { useState, useEffect } from "react"
import { useTranslate } from "@/context/TranslateContext"
import { translate } from "@/lib/openai"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { chunkJsonObject, mergeTranslatedChunks } from "@/lib/json-utils"

interface TranslatedResult {
  lang: string;
  content: string;
}

const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export function TranslatePanel() {
  const { 
    file, 
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
  const [totalChunks, setTotalChunks] = useState(0);
  const [completedChunks, setCompletedChunks] = useState(0);

  const languageOptions = [
    { value: "zh", label: "中文" },
    { value: "de", label: "德语" },
    { value: "ko", label: "韩语" },
    { value: "fr", label: "法语" },
    { value: "es", label: "西班牙语" },
    { value: "it", label: "意大利语" },
    { value: "ja", label: "日语" },
    { value: "pt", label: "葡萄牙语" },
    { value: "nl", label: "荷兰语" },
    { value: "pl", label: "波兰语" }
  ];

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.ceil(seconds)}秒`
    return `${Math.ceil(seconds / 60)}分钟`
  }

  const handleTranslationError = (err: any) => {
    setError(err.message || "翻译过程中发生错误");
    toast({
      variant: "destructive",
      title: "错误",
      description: err.message || "翻译过程中发生错误"
    });
  }

  const handleTranslate = async () => {
    if (!file || !apiKey) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请上传文件并输入API Key"
      });
      return;
    }

    const controller = new AbortController();
    setController(controller);
    setIsTranslating(true);
    setError("");
    setProgress(0);
    setCancelTranslation(false);

    const startTime = Date.now();
    
    try {
      const content = await readFileContent(file);
      const jsonContent = JSON.parse(content);
      
      const savedProgress = localStorage.getItem(`translation_progress_${file.name}`);
      const savedChunks = savedProgress ? JSON.parse(savedProgress) : {};
      
      const chunks = chunkJsonObject(jsonContent, {
        maxKeys: 50,
        maxSize: 4000,
        preserveStructure: true
      });
      
      const calculatedTotalChunks = chunks.length * selectedLangs.length;
      setTotalChunks(calculatedTotalChunks);
      let currentCompletedChunks = 0;
      setCompletedChunks(currentCompletedChunks);
      
      const results: TranslatedResult[] = [...translatedResults];
      
      for (const lang of selectedLangs) {
        if (cancelTranslation) break;
        
        setCurrentTranslatingLang(lang);
        const translatedChunks: Record<string, any>[] = [];
        const savedLangChunks = savedChunks[lang] || [];
        
        // 初始化当前语言的已翻译内容
        let currentLangContent = mergeTranslatedChunks(savedLangChunks);
        
        // 如果有已保存的内容，先添加到结果中
        if (Object.keys(currentLangContent).length > 0) {
          const resultIndex = results.findIndex(r => r.lang === lang);
          if (resultIndex !== -1) {
            results[resultIndex] = {
              lang,
              content: JSON.stringify(currentLangContent, null, 2)
            };
          } else {
            results.push({
              lang,
              content: JSON.stringify(currentLangContent, null, 2)
            });
          }
          setTranslatedResults([...results]);
        }

        for (let i = savedLangChunks.length; i < chunks.length; i++) {
          if (cancelTranslation) break;
          
          try {
            const chunk = chunks[i];
            const translatedChunk = await translate(
              JSON.stringify(chunk),
              lang,
              apiKey,
              controller.signal,
              (progress) => {
                const singleChunkProgress = progress / 100;
                const overallProgress = ((currentCompletedChunks + singleChunkProgress) / calculatedTotalChunks) * 100;
                setTotalProgress(Math.round(overallProgress));
              },
              (content) => {
                // 更新流式输出内容
                setStreamContent(content);
                
                try {
                  // 尝试解析当前流式输出的内容
                  const parsedStreamContent = JSON.parse(`{${content}}`);
                  
                  // 合并已翻译的内容和当前流式输出
                  const mergedContent = mergeTranslatedChunks([
                    currentLangContent,
                    parsedStreamContent
                  ]);
                  
                  // 更新译文结果，保留已翻译的内容
                  const resultIndex = results.findIndex(r => r.lang === lang);
                  if (resultIndex !== -1) {
                    results[resultIndex] = {
                      lang,
                      content: JSON.stringify(mergedContent, null, 2)
                    };
                  } else {
                    results.push({
                      lang,
                      content: JSON.stringify(mergedContent, null, 2)
                    });
                  }
                  setTranslatedResults([...results]);
                } catch {
                  // 如果解析失败，继续使用当前的累积内容
                  const resultIndex = results.findIndex(r => r.lang === lang);
                  if (resultIndex !== -1) {
                    results[resultIndex] = {
                      lang,
                      content: JSON.stringify(currentLangContent, null, 2)
                    };
                  }
                  setTranslatedResults([...results]);
                }
              }
            );
            
            const parsedChunk = JSON.parse(translatedChunk);
            translatedChunks.push(parsedChunk);
            
            // 更新当前语言的累积内容
            currentLangContent = mergeTranslatedChunks([
              currentLangContent,
              parsedChunk
            ]);

            // 更新最终的译文结果
            const resultIndex = results.findIndex(r => r.lang === lang);
            if (resultIndex !== -1) {
              results[resultIndex] = {
                lang,
                content: JSON.stringify(currentLangContent, null, 2)
              };
            } else {
              results.push({
                lang,
                content: JSON.stringify(currentLangContent, null, 2)
              });
            }
            setTranslatedResults([...results]);
            
            // 保存进度
            savedChunks[lang] = translatedChunks;
            localStorage.setItem(
              `translation_progress_${file.name}`,
              JSON.stringify(savedChunks)
            );
            
            currentCompletedChunks++;
            setCompletedChunks(currentCompletedChunks);
          } catch (error) {
            console.error(`翻译块 ${i} 失败:`, error);
            continue;
          }
        }
      }
      
      // 清理保存的进度
      localStorage.removeItem(`translation_progress_${file.name}`);
      
      toast({
        title: "成功",
        description: "翻译完成！"
      });
      
    } catch (err) {
      handleTranslationError(err);
    } finally {
      setIsTranslating(false);
      setProgress(0);
      setStreamContent('');
      setCurrentTranslatingLang(null);
      setEstimatedTime(0); // 重置预计时间
      setCompletedChunks(0);
    }
  };

  const handleCancel = () => {
    if (controller) {
      controller.abort()
      setController(null)
    }
    setCancelTranslation(true)
    setIsTranslating(false)
    setProgress(0)
    setTotalProgress(0)
    setTotalChunks(0)
    setCurrentTranslatingLang(null)
    setStreamContent("")
    toast({
      title: "已取消",
      description: "翻译已取消"
    })
    setCompletedChunks(0);
  }

  // 添加一个检查保存进度的函数
  const checkSavedProgress = (fileName: string) => {
    const savedProgress = localStorage.getItem(`translation_progress_${fileName}`);
    if (savedProgress) {
      return {
        hasSavedProgress: true,
        progress: JSON.parse(savedProgress)
      };
    }
    return { hasSavedProgress: false, progress: null };
  };

  // 在文件上传后检查是否有未完成的翻译
  useEffect(() => {
    if (file) {
      const { hasSavedProgress } = checkSavedProgress(file.name);
      if (hasSavedProgress) {
        toast({
          title: "发现未完成的翻译",
          description: "是否要继续上次的翻译进度？",
          action: (
            <Button onClick={handleTranslate}>
              继续翻译
            </Button>
          )
        });
      }
    }
  }, [file]);

  // 在组件初始化时
  useEffect(() => {
    setTotalProgress(0);
  }, []);

  return (
    <div className="space-y-4">
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
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {isTranslating && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>总体进度 ({totalProgress}%)</span>
              <span>已完成分段: {completedChunks}/{totalChunks || 1}</span>
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
          {isTranslating ? "翻译..." : "开始翻译"}
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

      
    </div>
  )
} 