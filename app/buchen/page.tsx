'use client'

import { useState } from 'react'
import { Stepper } from '@/components/Stepper'
import { StepService } from '@/components/StepService'
import { StepDesign } from '@/components/StepDesign'
import { StepLength } from '@/components/StepLength'
import { StepDateTime } from '@/components/StepDateTime'
import { BookingSummary } from '@/components/BookingSummary'
import { useBookingStore } from '@/store/booking'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Phone, Mail, Instagram, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function BookingPage() {
  const { currentStep, setStep, reset } = useBookingStore()
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingResult, setBookingResult] = useState<any>(null)

  const handleNext = () => {
    if (currentStep < 5) {
      setStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1)
    }
  }

  const handleConfirm = (result?: any) => {
    setBookingResult(result)
    setBookingComplete(true)
  }

  const handleNewBooking = () => {
    reset()
    setBookingComplete(false)
    setBookingResult(null)
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-accent"></div>
              <div className="w-full h-0.5 bg-accent"></div>
              <div className="w-full h-0.5 bg-accent"></div>
            </div>
          </div>
        </header>

        {/* Success Content */}
        <main className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="max-w-md mx-auto space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-script text-gray-600">Danke!</h1>
                <h2 className="text-xl font-bold text-primary">
                  Ich freue mich auf Dich!
                </h2>
              </div>

              <div className="text-gray-600 text-sm">
                {bookingResult?.message || 'Dein Termin wurde erfolgreich gebucht.'}
              </div>
            </div>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Richtiarkade 16, 8304 Wallisellen</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">078 222 72 83</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">rox_does_nails@yahoo.com</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">rox.does.nails</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={handleNewBooking}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Neuen Termin buchen
              </Button>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Zurück zur Startseite
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-accent"></div>
            <div className="w-full h-0.5 bg-accent"></div>
            <div className="w-full h-0.5 bg-accent"></div>
          </div>
        </div>
        
        <Link href="/">
          <Button variant="outline" size="sm">
            Abbrechen
          </Button>
        </Link>
      </header>

      {/* Stepper */}
      <Stepper currentStep={currentStep} />

      {/* Step Content */}
      <div className="px-4 pb-8">
        {currentStep === 1 && (
          <StepService onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 2 && (
          <StepDesign onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <StepLength onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 4 && (
          <StepDateTime onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 5 && (
          <BookingSummary onConfirm={handleConfirm} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
