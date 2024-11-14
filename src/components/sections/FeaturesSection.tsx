import { Code, Languages, Sparkles, Shield } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export function FeaturesSection() {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Preserve JSON Structure",
      description: "Intelligently recognize and maintain the structure, indentation, and format of the original JSON file"
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Multi-language Support",
      description: "Support translation between multiple languages including English, Chinese, Japanese, and more"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Translation",
      description: "Utilizing OpenAI GPT models to ensure accuracy of technical terms and natural expression"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "API keys are only used temporarily in the browser and never saved or transmitted to servers"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Translation Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
