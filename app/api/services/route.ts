import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ServiceSchema } from '@/lib/validators'

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    const validatedServices = services.map((service: any) => 
      ServiceSchema.parse(service)
    )

    return NextResponse.json({ services: validatedServices })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
