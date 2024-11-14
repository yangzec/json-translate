import { Coffee, Twitter } from 'lucide-react'

interface FooterProps {
  dict: {
    creator: string
    twitter: string
    coffee: string
  }
}

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600">
            {dict.creator}
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/decohack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Twitter className="w-4 h-4" />
              {dict.twitter}
            </a>
            
            <a
              href="https://www.buymeacoffee.com/viggo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              <Coffee className="w-4 h-4" />
              {dict.coffee}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 