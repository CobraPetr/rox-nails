'use client'

import { cn } from '@/lib/utils'

interface StepperProps {
  currentStep: number
  totalSteps?: number
}

export function Stepper({ currentStep, totalSteps = 4 }: StepperProps) {
  return (
    <div className="flex items-center justify-center space-x-4 py-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              step === currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-600'
            )}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={cn(
                'w-8 h-0.5 mx-2',
                step < currentStep ? 'bg-primary' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
