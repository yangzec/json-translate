"use client"
import { Upload, Languages, Sparkles, Download } from 'lucide-react'

export function WorkflowSection() {
  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      number: "01",
      title: "Upload JSON File",
      description: "Support drag and drop or click to select file"
    },
    {
      icon: <Languages className="w-6 h-6" />,
      number: "02", 
      title: "Select Target Language",
      description: "Choose the target language for translation"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      number: "03",
      title: "Start Translation",
      description: "Enter API Key and start AI translation"
    },
    {
      icon: <Download className="w-6 h-6" />,
      number: "04",
      title: "Download Results",
      description: "Download the translated JSON file"
    }
  ]
  
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Complete Translation in Four Simple Steps
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've simplified the JSON file translation process to help you quickly obtain high-quality translation results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* 连接线 - 在非最后一个项目后显示 */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-px bg-gray-200 -translate-y-1/2 z-0" />
              )}
              
              <div className="relative z-10 bg-white rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    {step.icon}
                  </div>
                  <span className="text-5xl font-bold text-gray-100">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
