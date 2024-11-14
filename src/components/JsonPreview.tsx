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
  const [activeTab, setActiveTab] = useState<string>("")
  const { selectedLangs } = useTranslate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 300 });
  const containerRef = useRef<HTMLDivElement>(null);

  const languageLabels: Record<string, string> = {
    // Common Languages
    en: 'English',
    ru: 'Russian',
    es: 'Spanish',
    de: 'German',
    tr: 'Turkish',
    fa: 'Persian',
    fr: 'French',
    ja: 'Japanese',
    pt: 'Portuguese',
    zh: 'Chinese (S)',
    'zh-TW': 'Chinese (T)',
    vi: 'Vietnamese',
    it: 'Italian',
    ar: 'Arabic',
    pl: 'Polish',
    el: 'Greek',
    nl: 'Dutch',
    id: 'Indonesian',
    ko: 'Korean',
    th: 'Thai',

    // European Languages
    uk: 'Ukrainian',
    he: 'Hebrew',
    sv: 'Swedish',
    ro: 'Romanian',
    hu: 'Hungarian',
    da: 'Danish',
    sk: 'Slovak',
    sr: 'Serbian',
    bg: 'Bulgarian',
    fi: 'Finnish',
    hr: 'Croatian',
    lt: 'Lithuanian',
    nb: 'Norwegian',
    sl: 'Slovenian',
    lv: 'Latvian',
    et: 'Estonian',
    cs: 'Czech',
    ca: 'Catalan',

    // Asian Languages
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    ur: 'Urdu',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
    mr: 'Marathi',
    ms: 'Malay',
    my: 'Burmese',
    km: 'Khmer',
    lo: 'Lao',
    mn: 'Mongolian',

    // Other Languages
    az: 'Azerbaijani',
    ka: 'Georgian',
    hy: 'Armenian',
    sw: 'Swahili',
    af: 'Afrikaans',
    am: 'Amharic'
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
          console.error('JSON parsing error:', error)
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
      // If the JSON string is empty or a prompt text, return it directly
      if (!jsonString || 
          jsonString === 'Please upload a JSON file' || 
          jsonString === 'Translation results will be displayed here') {
        return jsonString;
      }
      
      // Handle streaming output
      if (isTranslating) {
        try {
          // Try to wrap the content into a complete JSON object
          const wrappedContent = `{"temp": ${jsonString}}`;
          const parsed = JSON.parse(wrappedContent);
          return JSON.stringify(parsed.temp, null, 2);
        } catch {
          // If parsing fails, perform basic formatting
          return jsonString
            .split(',')
            .map(line => line.trim())
            .join(',\n  ');
        }
      }
      
      // Non-streaming output, parse and format normally
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If all attempts fail, return the original string
      return jsonString;
    }
  }

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Success",
        description: "Content has been copied to the clipboard"
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Copy failed, please copy manually"
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
        title: "Success",
        description: `${languageLabels[lang]} translation file has been downloaded`
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Download failed, please try again"
      })
    }
  }

  const handleDownloadAll = () => {
    try {
      // Create a zip file
      const zip = new JSZip()
      
      // Add all translation results to the zip
      translatedResults.forEach(result => {
        zip.file(`translated_${result.lang}.json`, result.content)
      })
      
      // Generate and download the zip file
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
          title: "Success",
          description: "All translation files have been downloaded"
        })
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Download failed, please try again"
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upper part: Original */}
      <div className="border border-border rounded-3xl p-4 md:p-6 transition-all duration-300 bg-white/90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Original JSON</h3>
          <div className="flex gap-2">
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
          <div className="flex items-center justify-center h-[300px]">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <>
            <div ref={containerRef} className="h-[300px] overflow-hidden">
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
  // Please upload a JSON file
}`}
                  height={containerSize.height}
                  width={containerSize.width}
                  showLineNumbers={false}
                />
              )}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Tips: Supports real-time preview and formatting of JSON files, and you can directly copy the content
            </div>
          </>
        )}
      </div>

      {/* Lower part: Translations */}
      <div className="border border-border rounded-3xl p-4 md:p-6 transition-all duration-300 bg-white/90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Translated JSON</h3>
          <div className="flex items-center gap-2">
            {activeTab && translatedResults.find(r => r.lang === activeTab) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(activeTab)}
                className="flex items-center gap-2 shadow-none"
              >
                <DownloadIcon className="h-4 w-4" />
                Download {languageLabels[activeTab]} translation
              </Button>
            )}
            {translatedResults.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                className="flex items-center gap-2 shadow-none"
              >
                <DownloadIcon className="h-4 w-4" />
                Download all translations
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
  // Translation results will be displayed here
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