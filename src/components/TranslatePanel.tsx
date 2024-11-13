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
import { ChevronDown, Languages, Loader2 } from "lucide-react"

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
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  // Common languages (top 20 most common languages)
  const commonLanguages = [
    { value: "en", label: "English" },
    { value: "ru", label: "Russian" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
    { value: "tr", label: "Turkish" },
    { value: "fr", label: "French" },
    { value: "ja", label: "Japanese" },
    { value: "pt", label: "Portuguese" },
    { value: "zh", label: "Chinese (S)" },
    { value: "zh-TW", label: "Chinese (T)" },
    { value: "it", label: "Italian" },
    { value: "ar", label: "Arabic" },
    { value: "pl", label: "Polish" },
    { value: "el", label: "Greek" },
    { value: "nl", label: "Dutch" },
    { value: "id", label: "Indonesian" },
    { value: "ko", label: "Korean" },
    { value: "th", label: "Thai" }
  ];

  // More languages
  const moreLanguages = [
    // European languages
    { value: "vi", label: "Vietnamese" },
    { value: "fa", label: "Persian" },
    { value: "uk", label: "Ukrainian" },
    { value: "he", label: "Hebrew" },
    { value: "sv", label: "Swedish" },
    { value: "ro", label: "Romanian" },
    { value: "hu", label: "Hungarian" },
    { value: "da", label: "Danish" },
    { value: "sk", label: "Slovak" },
    { value: "sr", label: "Serbian" },
    { value: "bg", label: "Bulgarian" },
    { value: "fi", label: "Finnish" },
    { value: "hr", label: "Croatian" },
    { value: "lt", label: "Lithuanian" },
    { value: "nb", label: "Norwegian (Bokmål)" },
    { value: "sl", label: "Slovenian" },
    { value: "lv", label: "Latvian" },
    { value: "et", label: "Estonian" },
    { value: "cs", label: "Czech" },
    { value: "ca", label: "Catalan" },
    
    // Asian languages
    { value: "hi", label: "Hindi" },
    { value: "bn", label: "Bengali" },
    { value: "ta", label: "Tamil" },
    { value: "ur", label: "Urdu" },
    { value: "gu", label: "Gujarati" },
    { value: "kn", label: "Kannada" },
    { value: "ml", label: "Malayalam" },
    { value: "mr", label: "Marathi" },
    { value: "ms", label: "Malay" },
    { value: "my", label: "Burmese" },
    { value: "km", label: "Khmer" },
    { value: "lo", label: "Lao" },
    { value: "mn", label: "Mongolian" },
    
    // Other languages
    { value: "az", label: "Azerbaijani" },
    { value: "ka", label: "Georgian" },
    { value: "hy", label: "Armenian" },
    { value: "sw", label: "Swahili" },
    { value: "af", label: "Afrikaans" },
    { value: "am", label: "Amharic" }
  ];

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.ceil(seconds)} seconds`
    return `${Math.ceil(seconds / 60)} minutes`
  }

  const handleTranslationError = (err: any) => {
    setError(err.message || "Translation failed");
    toast({
      variant: "destructive",
      title: "Error",
      description: err.message || "Translation failed"
    });
  }

  const handleTranslate = async () => {
    if (!file || !apiKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a file and enter API Key"
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
      
      // Get languages that have been completely translated
      const completedLangs = translatedResults
        .filter(result => {
          try {
            // Check if the translation content is complete
            const translatedContent = JSON.parse(result.content);
            const originalContent = JSON.parse(content);
            // Compare the number of keys to determine if it's completely translated
            return Object.keys(translatedContent).length === Object.keys(originalContent).length;
          } catch {
            return false;
          }
        })
        .map(result => result.lang);

      // Filter out languages that haven't been translated
      const remainingLangs = selectedLangs.filter(lang => !completedLangs.includes(lang));

      // If all selected languages are already translated
      if (remainingLangs.length === 0) {
        toast({
          title: "Tip",
          description: "All selected languages are already translated"
        });
        return;
      }

      // Only translate languages that haven't been completed
      for (const lang of remainingLangs) {
        if (cancelTranslation) break;
        
        setCurrentTranslatingLang(lang);
        const translatedChunks: Record<string, any>[] = [];
        const savedLangChunks = savedChunks[lang] || [];
        
        // Initialize the translated content for the current language
        let currentLangContent = mergeTranslatedChunks(savedLangChunks);
        
        // If there's already saved content, add it to the results
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
          if (cancelTranslation) {
            console.log('Translation cancelled, stopping...')
            break
          }
          
          try {
            const chunk = chunks[i]
            const translatedChunk = await translate(
              JSON.stringify(chunk),
              lang,
              apiKey,
              controller.signal,
              (progress) => {
                const singleChunkProgress = progress / 100
                const overallProgress = ((currentCompletedChunks + singleChunkProgress) / calculatedTotalChunks) * 100
                setTotalProgress(Math.round(overallProgress))
              },
              (content) => {
                setStreamContent(content)
                try {
                  // 如果翻译被取消，不进行 JSON 解析
                  if (cancelTranslation) return
                  
                  const parsedStreamContent = JSON.parse(`{${content}}`)
                  const mergedContent = mergeTranslatedChunks([
                    currentLangContent,
                    parsedStreamContent
                  ])
                  
                  const resultIndex = results.findIndex(r => r.lang === lang)
                  if (resultIndex !== -1) {
                    results[resultIndex] = {
                      lang,
                      content: JSON.stringify(mergedContent, null, 2)
                    }
                  } else {
                    results.push({
                      lang,
                      content: JSON.stringify(mergedContent, null, 2)
                    })
                  }
                  setTranslatedResults([...results])
                } catch (error) {
                  // 如果是取消操作，忽略错误
                  if (cancelTranslation) return
                  
                  console.warn('Stream content parse error:', error)
                }
              }
            )
            
            // 如果翻译被取消，跳出循环
            if (!translatedChunk || cancelTranslation) {
              break
            }

            const parsedChunk = JSON.parse(translatedChunk)
            translatedChunks.push(parsedChunk)
            
            currentLangContent = mergeTranslatedChunks([
              currentLangContent,
              parsedChunk
            ])

            const resultIndex = results.findIndex(r => r.lang === lang)
            if (resultIndex !== -1) {
              results[resultIndex] = {
                lang,
                content: JSON.stringify(currentLangContent, null, 2)
              }
            } else {
              results.push({
                lang,
                content: JSON.stringify(currentLangContent, null, 2)
              })
            }
            setTranslatedResults([...results])
            
            savedChunks[lang] = translatedChunks
            localStorage.setItem(
              `translation_progress_${file.name}`,
              JSON.stringify(savedChunks)
            )
            
            currentCompletedChunks++
            setCompletedChunks(currentCompletedChunks)
          } catch (error) {
            // 如果是取消操作，跳出循环
            if (cancelTranslation || (error instanceof DOMException && error.name === 'AbortError')) {
              console.log('Translation block cancelled')
              break
            }
            // 其他错误则继续处理下一个块
            console.warn(`Translation block ${i} failed:`, error)
            continue
          }
        }
      }
      
      // Clear saved progress
      localStorage.removeItem(`translation_progress_${file.name}`);
      
      // 只有在非取消状态下才显示完成提示
      if (!cancelTranslation) {
        toast({
          title: "Success",
          description: "Translation completed!"
        });
      }
      
    } catch (err) {
      handleTranslationError(err);
    } finally {
      setIsTranslating(false);
      setProgress(0);
      setStreamContent('');
      setCurrentTranslatingLang(null);
      setEstimatedTime(0); // Reset estimated time
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
    // 清除保存的进度
    if (file) {
      localStorage.removeItem(`translation_progress_${file.name}`)
    }
    toast({
      title: "Cancelled",
      description: "Translation cancelled"
    })
    setCompletedChunks(0)
  }

  // Add a function to check saved progress
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

  // Check for unfinished translations when a file is uploaded
  useEffect(() => {
    if (file) {
      const { hasSavedProgress } = checkSavedProgress(file.name);
      if (hasSavedProgress) {
        toast({
          title: "Found unfinished translation",
          description: "Do you want to continue from the last translation progress?",
          action: (
            <Button onClick={handleTranslate}>
              Continue translation
            </Button>
          )
        });
      }
    }
  }, [file]);

  // Initialize the component
  useEffect(() => {
    setTotalProgress(0);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {/* Common languages */}
          {commonLanguages.map(option => (
            <label 
              key={option.value} 
              className={`flex items-center justify-center px-4 py-2 rounded-full cursor-pointer transition-colors text-sm ${
                selectedLangs.includes(option.value) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedLangs.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
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

        {/* Expand/collapse button */}
        <Button
          variant="ghost"
          onClick={() => setShowMoreLanguages(!showMoreLanguages)}
          className="mt-2 w-full"
        >
          {showMoreLanguages ? "Hide more languages" : "Show more languages"}
          <ChevronDown className={`ml-2 h-4 w-4 transform ${showMoreLanguages ? "rotate-180" : ""}`} />
        </Button>

        {/* More languages */}
        {showMoreLanguages && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {moreLanguages.map(option => (
              <label 
                key={option.value} 
                className={`flex items-center justify-center px-4 py-2 rounded-full cursor-pointer transition-colors text-sm ${
                  selectedLangs.includes(option.value) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedLangs.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
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
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {isTranslating && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall progress ({totalProgress}%)</span>
              <span>Completed segments: {completedChunks}/{totalChunks || 1}</span>
            </div>
            <Progress value={totalProgress} className="w-full" />
          </div>
          
          {currentTranslatingLang && (
            <div className="text-sm text-muted-foreground">
              Translating: {
                commonLanguages.find(opt => opt.value === currentTranslatingLang)?.label || currentTranslatingLang
              }
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium" 
          onClick={() => {
            if (!file) {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Please upload a JSON file first"
              });
              return;
            }
            if (!apiKey) {
              toast({
                variant: "destructive", 
                title: "Error",
                description: "Please enter OpenAI API Key"
              });
              return;
            }
            if (isTranslating) {
              return;
            }
            handleTranslate();
          }}
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-5 w-5" />
              Start translate
            </>
          )}
        </Button>

        {isTranslating && (
          <Button 
            variant="outline"
            onClick={handleCancel}
            className="w-24 py-6 shadow-none"
          >
            Cancel
          </Button>
        )}
      </div>

      
    </div>
  )
} 