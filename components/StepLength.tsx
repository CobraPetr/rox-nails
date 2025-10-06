'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/store/booking'
import { cn } from '@/lib/utils'

interface StepLengthProps {
  onNext: () => void
  onBack: () => void
}

const lengthOptions = [
  {
    id: 'small' as const,
    name: 'Small',
    description: 'Kurze Nägel',
    duration: '+0 Min',
    price: '+0 CHF',
  },
  {
    id: 'medium' as const,
    name: 'Medium',
    description: 'Mittlere Nägel',
    duration: '+10 Min',
    price: '+10 CHF',
  },
  {
    id: 'long' as const,
    name: 'Long',
    description: 'Lange Nägel',
    duration: '+20 Min',
    price: '+20 CHF',
  },
]

export function StepLength({ onNext, onBack }: StepLengthProps) {
  const { draft, setLength, isValid } = useBookingStore()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-script text-gray-600">Länge</h1>
        <h2 className="text-xl font-bold text-primary">Wähle deine Länge.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lengthOptions.map((option) => (
          <Card
            key={option.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              draft.length === option.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-gray-50'
            )}
            onClick={() => setLength(option.id)}
          >
            <CardContent className="p-6 text-center space-y-4">
              {/* Placeholder for nail length image */}
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{option.name}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">{option.duration}</p>
                  <p className="text-sm font-medium text-primary">{option.price}</p>
                </div>
              </div>

              <input
                type="radio"
                name="length"
                value={option.id}
                checked={draft.length === option.id}
                onChange={() => setLength(option.id)}
                className="w-4 h-4 text-primary"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isValid(3)}
          className="bg-primary hover:bg-primary/90"
        >
          Weiter
        </Button>
      </div>
    </div>
  )
}
