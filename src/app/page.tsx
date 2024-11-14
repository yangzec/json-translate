import { FileUpload } from "@/components/FileUpload"
import { TranslatePanel } from "@/components/TranslatePanel"
import { JsonPreview } from "@/components/JsonPreview"
import { TranslateProvider } from "@/context/TranslateContext"
import { FileIcon, Languages, Sparkles } from "lucide-react"
import Footer from "@/components/Footer"
import FAQ from "@/components/sections/FAQ"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { WorkflowSection } from "@/components/sections/WorkflowSection"
import { CTASection } from "@/components/sections/CTASection"
export default function Home() {
  return (
    <TranslateProvider>
      <div className="min-h-screen bg-background">
        <HeroSection />
        <main className="container mx-auto p-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 space-y-4">
                <div className="border border-border rounded-3xl p-4 md:p-6 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <h2 className="text-lg md:text-xl font-semibold pb-4 flex items-center gap-2">
                    <FileIcon className="w-5 h-5" />
                    Select JSON File
                  </h2>
                  <FileUpload />
                </div>

                <div className="border border-border rounded-3xl p-4 md:p-6 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Select Target Language
                  </h2>
                  <p className="text-sm text-muted-foreground pb-4">
                    Select the target language you want to translate to
                  </p>
                  <TranslatePanel />
                </div>
              </div>

              <div className="md:col-span-8">
                <div className="w-full">
                  <JsonPreview />
                </div>
              </div>
            </div>
          </div>
        </main>
    
        <WorkflowSection />
        <FeaturesSection />
        <FAQ />
        <CTASection />
        <Footer />
      </div>
    </TranslateProvider>
  )
}
