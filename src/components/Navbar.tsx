"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
      scrolled ? 'bg-white/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + 网站名称 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-12 h-7">
              <Image
                src={scrolled ? "/logo-blue.png" : "/logo-white.png"}
                alt="JSON Translater Logo"
                width={512}
                height={316}
                className="object-contain"
                priority
              />
            </div>
            <span className={`font-semibold text-lg hidden sm:block ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}>
              JSON Translater
            </span>
          </Link>

          {/* Twitter 链接 */}
          <a
            href="https://x.com/decohack"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${
              scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
            }`}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 60 60" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M40.859 12.9375H46.648L34.0007 27.3925L48.8792 47.0625H37.2277L28.1032 35.1327L17.6627 47.0625H11.8702L25.3977 31.6012L11.1265 12.9375H23.0702L31.318 23.8417L40.859 12.9375ZM38.8272 43.5975H42.035L21.329 16.2205H17.8867L38.8272 43.5975Z" 
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  )
} 