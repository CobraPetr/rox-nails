'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useBookingStore } from '@/store/booking'
import { formatPrice, getLengthAdjustment } from '@/lib/slots'
import { Service } from '@/lib/validators'
import { Phone, Mail, Instagram, User } from 'lucide-react'

interface BookingSummaryProps {
  onConfirm: () => void
  onBack: () => void
}

export function BookingSummary({ onConfirm, onBack }: BookingSummaryProps) {
  const { draft, setCustomer, isValid } = useBookingStore()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedService = services.find(s => s.id === draft.serviceId)
  const lengthAdjustment = draft.length ? getLengthAdjustment(draft.length) : { durationMinutes: 0, priceAdjustment: 0 }
  const totalPrice = selectedService ? selectedService.basePrice + lengthAdjustment.priceAdjustment : 0

  const handleSubmit = async () => {
    if (!isValid(5) || !gdprConsent) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: draft.serviceId,
          length: draft.length,
          designText: draft.designText,
          designImages: draft.designImages,
          startTime: `${draft.date}T${draft.time}:00+02:00`,
          customer: draft.customer,
        }),
      })

      if (response.ok) {
        onConfirm()
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.message || 'Unbekannter Fehler'}`)
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Fehler beim Buchen des Termins. Bitte versuche es erneut.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Lade Zusammenfassung...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-script text-gray-600">Zusammenfassung</h1>
        <h2 className="text-xl font-bold text-primary">Überprüfe deine Auswahl</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Termin Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedService && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Länge:</span>
                  <span className="font-medium capitalize">{draft.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Datum:</span>
                  <span className="font-medium">{draft.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zeit:</span>
                  <span className="font-medium">{draft.time}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Preis:</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            )}

            {draft.designText && (
              <div className="space-y-2">
                <h4 className="font-medium">Design Beschreibung:</h4>
                <p className="text-sm text-gray-600">{draft.designText}</p>
              </div>
            )}

            {draft.designImages.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Design Bilder:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {draft.designImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.name || `Design ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Deine Kontaktdaten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  value={draft.customer?.fullName || ''}
                  onChange={(e) => setCustomer({ fullName: e.target.value })}
                  className="pl-10"
                  placeholder="Dein vollständiger Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  value={draft.customer?.phone || ''}
                  onChange={(e) => setCustomer({ phone: e.target.value })}
                  className="pl-10"
                  placeholder="078 222 72 83"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={draft.customer?.email || ''}
                  onChange={(e) => setCustomer({ email: e.target.value })}
                  className="pl-10"
                  placeholder="deine@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="instagram"
                  value={draft.customer?.instagram || ''}
                  onChange={(e) => setCustomer({ instagram: e.target.value })}
                  className="pl-10"
                  placeholder="@dein_username"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GDPR Consent */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="gdpr"
              checked={gdprConsent}
              onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
            />
            <Label htmlFor="gdpr" className="text-sm text-gray-600">
              Ich stimme der Verarbeitung meiner Daten zu und bestätige, dass ich die Datenschutzerklärung gelesen habe. *
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!isValid(5) || !gdprConsent || submitting}
          className="bg-primary hover:bg-primary/90"
        >
          {submitting ? 'Wird gebucht...' : 'Termin Buchen'}
        </Button>
      </div>
    </div>
  )
}
