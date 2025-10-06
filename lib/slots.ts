import { addDays, format, startOfDay, addMinutes, isAfter, isBefore } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'Europe/Zurich'
const WORKING_HOURS = {
  start: 9, // 09:00
  end: 20,  // 20:00
}
const SLOT_INTERVAL = 15 // minutes
const PADDING_MINUTES = 10 // padding before/after bookings

export interface TimeSlot {
  time: string // HH:mm format
  available: boolean
}

export interface AvailabilityResponse {
  slots: TimeSlot[]
  nextDate?: string
}

// Generate mock availability slots
export function generateMockSlots(date: string, durationMin: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  const workDate = new Date(date + 'T00:00:00')
  
  // Convert to Zurich timezone
  const zurichDate = toZonedTime(workDate, TIMEZONE)
  
  // Generate slots from 09:00 to 20:00
  for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_INTERVAL) {
      const slotTime = new Date(zurichDate)
      slotTime.setHours(hour, minute, 0, 0)
      
      // Skip if slot + duration would go past working hours
      const slotEnd = addMinutes(slotTime, durationMin)
      if (slotEnd.getHours() >= WORKING_HOURS.end) {
        break
      }
      
      // Skip past slots (with 2 hour buffer)
      const now = new Date()
      const bufferTime = addMinutes(now, 120)
      if (isBefore(slotTime, bufferTime)) {
        continue
      }
      
      const timeStr = format(slotTime, 'HH:mm')
      
      // Mock some unavailable slots for realism
      const isUnavailable = Math.random() < 0.2 // 20% chance of being unavailable
      
      slots.push({
        time: timeStr,
        available: !isUnavailable,
      })
    }
  }
  
  return slots
}

// Check for booking conflicts (mock implementation)
export function hasBookingConflict(date: string, time: string, durationMin: number): boolean {
  // In a real implementation, this would check against actual bookings
  // For now, return false (no conflicts)
  return false
}

// Get next available date
export function getNextDate(currentDate: string): string {
  const nextDate = addDays(new Date(currentDate), 7)
  return format(nextDate, 'yyyy-MM-dd')
}

// Format price in CHF
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(priceInCents / 100)
}

// Calculate length adjustment
export function getLengthAdjustment(length: 'small' | 'medium' | 'long'): {
  durationMinutes: number
  priceAdjustment: number
} {
  const adjustments = {
    small: { durationMinutes: 0, priceAdjustment: 0 },
    medium: { durationMinutes: 10, priceAdjustment: 1000 }, // +10 CHF
    long: { durationMinutes: 20, priceAdjustment: 2000 },  // +20 CHF
  }
  
  return adjustments[length]
}
