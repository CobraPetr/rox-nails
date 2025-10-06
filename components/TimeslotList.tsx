'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TimeSlot } from '@/lib/slots'

interface TimeslotListProps {
  date: string
  selectedTime?: string
  onTimeSelect: (time: string) => void
}

export function TimeslotList({ date, selectedTime, onTimeSelect }: TimeslotListProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailability()
  }, [date])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          durationMin: 90, // Default duration, could be dynamic based on service
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }

      const data = await response.json()
      setSlots(data.slots || [])
    } catch (err) {
      console.error('Error fetching availability:', err)
      setError('Fehler beim Laden der verfügbaren Zeiten')
      // Fallback to mock slots
      setSlots([
        { time: '09:00', available: true },
        { time: '12:00', available: true },
        { time: '14:30', available: true },
        { time: '19:00', available: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Lade verfügbare Zeiten...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-red-600">{error}</div>
        <Button onClick={fetchAvailability} variant="outline" size="sm">
          Erneut versuchen
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map((slot) => (
        <Card
          key={slot.time}
          className={cn(
            'cursor-pointer transition-colors',
            !slot.available
              ? 'opacity-50 cursor-not-allowed bg-gray-100'
              : 'hover:bg-gray-50',
            selectedTime === slot.time
              ? 'ring-2 ring-primary bg-primary/5'
              : ''
          )}
          onClick={() => slot.available && onTimeSelect(slot.time)}
        >
          <CardContent className="p-4 text-center">
            <div className="font-medium text-lg">{slot.time}</div>
            {!slot.available && (
              <div className="text-xs text-gray-500 mt-1">Ausgebucht</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
