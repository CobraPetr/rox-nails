import { NextRequest, NextResponse } from 'next/server'
import { BookingCreateSchema } from '@/lib/validators'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { getLengthAdjustment } from '@/lib/slots'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const bookingData = BookingCreateSchema.parse(body)

    // Get service details
    const service = await db.service.findUnique({
      where: { id: bookingData.serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Calculate duration and end time
    const lengthAdjustment = getLengthAdjustment(bookingData.length)
    const totalDuration = service.durationMin + lengthAdjustment.durationMinutes
    const startTime = new Date(bookingData.startTime)
    const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)

    // Create customer
    const customer = await db.customer.upsert({
      where: { phone: bookingData.customer.phone },
      update: {
        fullName: bookingData.customer.fullName,
        email: bookingData.customer.email,
        instagram: bookingData.customer.instagram,
      },
      create: {
        fullName: bookingData.customer.fullName,
        phone: bookingData.customer.phone,
        email: bookingData.customer.email,
        instagram: bookingData.customer.instagram,
      },
    })

    // Create booking
    const booking = await db.booking.create({
      data: {
        customerId: customer.id,
        serviceId: service.id,
        length: bookingData.length,
        designText: bookingData.designText,
        designImages: bookingData.designImages || [],
        startTime,
        endTime,
        status: 'pending',
        source: 'website',
      },
    })

    // Try to confirm via n8n if available
    if (env.hasN8N) {
      try {
        const n8nPayload = {
          bookingId: booking.id,
          serviceId: service.id,
          serviceName: service.name,
          startTime: bookingData.startTime,
          endTime: endTime.toISOString(),
          length: bookingData.length,
          designText: bookingData.designText,
          designImages: bookingData.designImages,
          customer: bookingData.customer,
          source: 'website',
        }

        const response = await fetch(env.n8nWebhookBooking, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(n8nPayload),
        })

        if (response.ok) {
          const result = await response.json()
          
          if (result.status === 'confirmed' && result.eventId) {
            // Update booking with confirmation
            await db.booking.update({
              where: { id: booking.id },
              data: {
                status: 'confirmed',
                eventId: result.eventId,
              },
            })
            
            return NextResponse.json({
              status: 'confirmed',
              bookingId: booking.id,
              eventId: result.eventId,
            })
          } else if (result.status === 'conflict') {
            return NextResponse.json(
              {
                status: 'conflict',
                message: 'Dieser Slot wurde soeben belegt. Wähle bitte eine der verfügbaren Zeiten.',
                alternativeSlots: result.slots || [],
              },
              { status: 409 }
            )
          } else {
            // Manual review needed
            return NextResponse.json({
              status: 'needs_manual',
              bookingId: booking.id,
              message: 'Danke! Wir prüfen Deinen Termin manuell und bestätigen ihn in Kürze.',
            })
          }
        } else {
          throw new Error('n8n webhook failed')
        }
      } catch (error) {
        console.error('n8n booking error:', error)
        // Continue with manual review
        return NextResponse.json({
          status: 'needs_manual',
          bookingId: booking.id,
          message: 'Danke! Wir prüfen Deinen Termin manuell und bestätigen ihn in Kürze.',
        })
      }
    } else {
      // No n8n - confirm locally for development
      await db.booking.update({
        where: { id: booking.id },
        data: { status: 'confirmed' },
      })

      return NextResponse.json({
        status: 'dev-confirmed',
        bookingId: booking.id,
        message: 'Termin erfolgreich gebucht! (Development Mode)',
      })
    }
  } catch (error) {
    console.error('Booking error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Fehler beim Buchen des Termins' },
      { status: 500 }
    )
  }
}
