"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

interface CTASectionProps {
  dict: {
    title: string
    description: string
    button: string
    features: string[] | { [key: string]: string }
  }
}

export function CTASection({ dict }: CTASectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = Array.isArray(dict.features) 
    ? dict.features 
    : Object.values(dict.features)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {dict.title}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {dict.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 px-4 rounded-full font-medium"
              >
                <Check className="w-5 h-5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {dict.button}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
