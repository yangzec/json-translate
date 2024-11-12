import { FileUpload } from "@/components/FileUpload"
import { TranslatePanel } from "@/components/TranslatePanel"
import { JsonPreview } from "@/components/JsonPreview"
import { TranslateProvider } from "@/context/TranslateContext"

export default function Home() {
  return (
    <TranslateProvider>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">JSON翻译工具</h1>
              <p className="text-muted-foreground">
                使用AI技术快速翻译您的JSON语言文件
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">上传文件</h2>
                <FileUpload />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">翻译设置</h2>
                <TranslatePanel />
              </div>
            </div>

            <JsonPreview />
          </div>
        </main>
      </div>
    </TranslateProvider>
  )
}
