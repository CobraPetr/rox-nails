'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBookingStore } from '@/store/booking'
import { formatPrice } from '@/lib/slots'
import { Service } from '@/lib/validators'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface StepServiceProps {
  onNext: () => void
  onBack: () => void
}

export function StepService({ onNext, onBack }: StepServiceProps) {
  const { draft, setService, isValid } = useBookingStore()
  const [services, setServices] = useState<Service[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Hände']))
  const [loading, setLoading] = useState(true)

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

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Lade Services...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-script text-gray-600">Service</h1>
        <h2 className="text-xl font-bold text-primary">Was machen wir?</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center space-x-2 text-primary font-bold text-lg"
            >
              {expandedCategories.has(category) ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span>{category}</span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 pl-6">
                {categoryServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-colors ${
                      draft.serviceId === service.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setService(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="service"
                            value={service.id}
                            checked={draft.serviceId === service.id}
                            onChange={() => setService(service.id)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            {service.durationMin} Min
                          </Badge>
                          <span className="font-bold text-primary">
                            {formatPrice(service.basePrice)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isValid(1)}
          className="bg-primary hover:bg-primary/90"
        >
          Weiter
        </Button>
      </div>
    </div>
  )
}
