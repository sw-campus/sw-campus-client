'use client'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export type FormStep = {
  title: string
  description?: string
}

type FormStepperProps = {
  steps: FormStep[]
  currentStep: number
  onStepClick?: (step: number) => void
  allowStepClick?: boolean
}

export function FormStepper({ steps, currentStep, onStepClick, allowStepClick = false }: FormStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = allowStepClick && (isCompleted || isCurrent)

          return (
            <div key={index} className="flex flex-1 items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick?.(index)}
                  disabled={!isClickable}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                    isCompleted && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-primary/10 text-primary',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 bg-muted text-muted-foreground',
                    isClickable && 'cursor-pointer hover:opacity-80',
                    !isClickable && 'cursor-default',
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                </button>
                <span
                  className={cn(
                    'mt-2 text-center text-xs font-medium',
                    isCurrent && 'text-primary',
                    !isCurrent && 'text-muted-foreground',
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn('mx-2 h-0.5 flex-1', index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30')}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
