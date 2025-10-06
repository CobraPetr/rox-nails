'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Phone, Instagram } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-purple-400"></div>
            <div className="w-full h-0.5 bg-purple-400"></div>
            <div className="w-full h-0.5 bg-purple-400"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-md mx-auto space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-2xl font-script text-gray-500">
              Willkommen bei
            </h1>
            <h2 className="text-3xl font-script text-gray-500">
              Rox Does Nails.
            </h2>
          </div>

          {/* Main CTA */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-pink-400 uppercase tracking-wide">
              Deine Traumnägel sind nur einen Termin entfernt.
            </h3>
            
            <div className="space-y-3">
              <Link href="/buchen">
                <Button 
                  size="lg" 
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold uppercase tracking-wide"
                >
                  Termin Buchen
                </Button>
              </Link>
              
              <Link href="#info" className="block">
                <span className="text-gray-600 underline text-sm">
                  weitere Infos
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-sm">078 222 72 83</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Instagram className="w-4 h-4" />
            <span className="text-sm">rox.does.nails</span>
          </div>
        </div>
      </footer>
    </div>
  )
}