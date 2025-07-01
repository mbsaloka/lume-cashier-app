"use client"

import { useState } from "react"
import { ProductSelector } from "./product-selector"
import { CartSummary } from "./cart-summary"
import { PaymentFlow } from "./payment-flow"
import { useCart } from "@/components/providers/cart-provider"

type CheckoutStep = "select" | "review" | "payment" | "complete"

export function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("select")
  const { items, total } = useCart()

  const handleProceedToReview = () => {
    if (items.length > 0) {
      setCurrentStep("review")
    }
  }

  const handleProceedToPayment = () => {
    setCurrentStep("payment")
  }

  const handlePaymentComplete = () => {
    setCurrentStep("complete")
  }

  const handleStartNew = () => {
    setCurrentStep("select")
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center space-x-4">
        {["Select Products", "Review Order", "Payment", "Complete"].map((step, index) => {
          const stepKeys: CheckoutStep[] = ["select", "review", "payment", "complete"]
          const isActive = stepKeys[index] === currentStep
          const isCompleted = stepKeys.indexOf(currentStep) > index

          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive
                    ? "bg-rose-600 text-white"
                    : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${isActive ? "text-rose-600 font-medium" : "text-gray-500"}`}>{step}</span>
              {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4" />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      {currentStep === "select" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductSelector />
          </div>
          <div>
            <CartSummary onProceed={handleProceedToReview} />
          </div>
        </div>
      )}

      {currentStep === "review" && (
        <div className="max-w-2xl mx-auto">
          <CartSummary onProceed={handleProceedToPayment} showEdit={true} onEdit={() => setCurrentStep("select")} />
        </div>
      )}

      {currentStep === "payment" && (
        <div className="max-w-md mx-auto">
          <PaymentFlow total={total} onComplete={handlePaymentComplete} onBack={() => setCurrentStep("review")} />
        </div>
      )}

      {currentStep === "complete" && (
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-600">Transaction completed successfully.</p>
          <button onClick={handleStartNew} className="bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-400">
            Start New Transaction
          </button>
        </div>
      )}
    </div>
  )
}
