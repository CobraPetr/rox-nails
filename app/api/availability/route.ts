import { NextRequest, NextResponse } from 'next/server'
import { AvailabilityRequestSchema } from '@/lib/validators'
import { generateMockSlots, getNextDate } from '@/lib/slots'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, durationMin } = AvailabilityRequestSchema.parse(body)

    let slots

    if (env.hasAvail) {
      // Call n8n webhook for real availability
      try {
        const response = await fetch(env.n8nWebhookAvail, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date, durationMin }),
        })

        if (response.ok) {
          const data = await response.json()
          slots = data.slots || []
        } else {
          throw new Error('n8n webhook failed')
        }
      } catch (error) {
        console.error('n8n availability error:', error)
        // Fallback to mock
        slots = generateMockSlots(date, durationMin)
      }
    } else {
      // Use mock slots
      slots = generateMockSlots(date, durationMin)
    }

    return NextResponse.json({
      slots,
      nextDate: getNextDate(date),
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
