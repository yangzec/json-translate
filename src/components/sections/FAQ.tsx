'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  const faqs: FAQItem[] = [
    {
      question: "What does this tool do?",
      answer: "This is an AI-powered JSON internationalization translation tool that helps developers quickly translate JSON language files into multiple languages while maintaining JSON structure integrity."
    },
    {
      question: "How to use this tool?",
      answer: "1. Upload your JSON file for translation\n2. Select target languages\n3. Enter your OpenAI API Key\n4. Click start translation\n5. Download results after translation is complete"
    },
    {
      question: "What languages are supported?",
      answer: "Currently supports multiple languages including English, Chinese (Simplified), Chinese (Traditional), Japanese, Korean, French, German, Spanish, Russian, and more."
    },
    {
      question: "Will my API Key be saved?",
      answer: "No. Your API Key is only used temporarily in the browser and will not be saved or transmitted to any servers."
    },
    {
      question: "How is translation quality assured?",
      answer: "We use OpenAI's GPT model for translation, ensuring accuracy of technical terms and natural language expression. We also support custom dictionary functionality to maintain consistency of specific terminology."
    },
    {
      question: "Is there a file size limit?",
      answer: "Single JSON file size is limited to 10MB. For larger files, it's recommended to split them and translate in batches."
    }
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Common questions about the JSON translation tool
            </p>
          </div>
        </div>
        
        <div className="mx-auto max-w-3xl mt-8 md:mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="flex justify-between items-center w-full px-4 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-4 pb-4">
                  {faq.answer.split('\n').map((line, i) => (
                    <p key={i} className="text-gray-600 mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 