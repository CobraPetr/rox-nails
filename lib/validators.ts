import { z } from 'zod'

export const phoneRegex = /^(\+41|0)[0-9\s]{8,12}$/

export const BookingCreateSchema = z.object({
  serviceId: z.string().min(1, 'Service ist erforderlich'),
  length: z.enum(['small', 'medium', 'long']),
  designText: z.string().optional(),
  designImages: z.array(z.object({
    url: z.string().url(),
    name: z.string().optional(),
  })).optional(),
  startTime: z.string().datetime(),
  customer: z.object({
    fullName: z.string().min(2, 'Name ist erforderlich'),
    phone: z.string().regex(phoneRegex, 'Ungültige Telefonnummer'),
    email: z.string().email('Ungültige E-Mail').optional(),
    instagram: z.string().optional(),
  }),
}).refine(
  (data) => data.designText || (data.designImages && data.designImages.length > 0),
  {
    message: 'Design-Beschreibung oder Bild ist erforderlich',
    path: ['designText'],
  }
)

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  durationMin: z.number(),
  basePrice: z.number(),
  isActive: z.boolean(),
})

export const AvailabilityRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMin: z.number().min(15).max(480),
})

export type BookingCreate = z.infer<typeof BookingCreateSchema>
export type Service = z.infer<typeof ServiceSchema>
export type AvailabilityRequest = z.infer<typeof AvailabilityRequestSchema>
