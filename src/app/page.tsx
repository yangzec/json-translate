import { FileUpload } from "@/components/FileUpload"
import { TranslatePanel } from "@/components/TranslatePanel"
import { JsonPreview } from "@/components/JsonPreview"
import { TranslateProvider } from "@/context/TranslateContext"
import { FileIcon, Languages } from "lucide-react"

export default function Home() {
  return (
    <TranslateProvider>
      <div className="min-h-screen bg-background">
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400/50" />
        
        <main className="container mx-auto p-4 relative">
          <div className="text-center space-y-6 py-16">
            <div className="inline-block animate-bounce-slow">
              <span className="px-6 py-2 bg-white/10 rounded-full text-sm font-medium text-white">
                AI Powered
              </span>
            </div>
            <h1 className="text-6xl font-bold text-white">
              JSON Translation Tool
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Transform your JSON language files instantly with our AI-powered translation tool. 
              Fast, accurate, and easy to use.
            </p>
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center space-x-2 text-sm text-white/90">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
                <span>Multiple Languages</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/90">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
                <span>Real-time Translation</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 space-y-4">
                <div className="border border-border rounded-3xl p-6 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold pb-4 flex items-center gap-2">
                    <FileIcon className="w-5 h-5" />
                    Select JSON File
                  </h2>
                  <FileUpload />
                </div>

                <div className="border border-border rounded-3xl p-6 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Select Target Language
                  </h2>
                  <p className="text-sm text-muted-foreground pb-4">
                    Select the target language you want to translate to
                  </p>
                  <TranslatePanel />
                </div>
              </div>

              <div className="col-span-8">
                <div className="">
                  <JsonPreview />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TranslateProvider>
  )
}
