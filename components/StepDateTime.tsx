'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { useBookingStore } from '@/store/booking'
import { TimeslotList } from './TimeslotList'
import { cn } from '@/lib/utils'
import { addDays, format, startOfWeek } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface StepDateTimeProps {
  onNext: () => void
  onBack: () => void
}

export function StepDateTime({ onNext, onBack }: StepDateTimeProps) {
  const { draft, setDate, setTime, isValid } = useBookingStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    draft.date ? new Date(draft.date) : undefined
  )
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek(currentWeek), i)
    return {
      date: day,
      dateStr: format(day, 'yyyy-MM-dd'),
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
      isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      isPast: day < new Date(),
    }
  })

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    setSelectedDate(date)
    setDate(dateStr)
    setShowCalendar(false)
  }

  const handleWeekNavigation = (direction: 'prev' | 'next') => {
    const newWeek = addDays(currentWeek, direction === 'next' ? 7 : -7)
    setCurrentWeek(newWeek)
  }

  const handleTimeSelect = (time: string) => {
    setTime(time)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-script text-gray-600">Datum</h1>
        <h2 className="text-xl font-bold text-primary">Wann willst du kommen?</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-primary underline text-sm"
            >
              Monatsansicht
            </button>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekNavigation('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                {format(currentWeek, 'MMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekNavigation('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <Card
                key={day.dateStr}
                className={cn(
                  'cursor-pointer transition-colors text-center',
                  day.isPast
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50',
                  selectedDate && format(selectedDate, 'yyyy-MM-dd') === day.dateStr
                    ? 'ring-2 ring-primary bg-primary/5'
                    : ''
                )}
                onClick={() => !day.isPast && handleDateSelect(day.date)}
              >
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">{day.dayName}</div>
                    <div className="text-sm font-medium">{day.dayNumber}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Calendar Modal */}
          {showCalendar && (
            <div className="border rounded-lg p-4 bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-md"
                required
              />
            </div>
          )}

          <button
            onClick={() => handleWeekNavigation('next')}
            className="text-primary underline text-sm"
          >
            nächste
          </button>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Verfügbare Zeiten</h3>
          {draft.date ? (
            <TimeslotList
              date={draft.date}
              selectedTime={draft.time}
              onTimeSelect={handleTimeSelect}
            />
          ) : (
            <div className="text-gray-500 text-center py-8">
              Wähle zuerst ein Datum aus
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isValid(4)}
          className="bg-primary hover:bg-primary/90"
        >
          Weiter
        </Button>
      </div>
    </div>
  )
}
