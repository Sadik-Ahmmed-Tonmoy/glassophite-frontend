"use client"

import { Truck, CreditCard, CheckCircle } from "lucide-react"

interface CheckoutStepperProps {
  currentStep: number
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: CheckCircle },
  ]

  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Progress bar */}
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200" />
          <div
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {/* Steps */}
          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  step.id <= currentStep
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                <step.icon size={18} />
              </div>
              <span className={`mt-2 text-sm font-medium ${step.id <= currentStep ? "text-primary" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${step.id === currentStep ? "text-primary" : "text-gray-400"}`}
            >
              <step.icon size={20} />
              <span className="mt-1 text-xs font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
