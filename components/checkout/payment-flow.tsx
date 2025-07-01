"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/providers/cart-provider"

interface PaymentFlowProps {
  total: number
  onComplete: () => void
  onBack: () => void
}

export function PaymentFlow({ total, onComplete, onBack }: PaymentFlowProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "processing" | "success" | "failed">("waiting")
  const [qrCode, setQrCode] = useState("")
  const { items, clearCart } = useCart()

  const createTransaction = async () => {
    const payload = {
      items: items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      method: "qris",
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to save transaction")
      }

      console.log("Transaction saved")
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  useEffect(() => {
    // Generate mock QR code data
    const mockQrData = `QRIS-${Date.now()}-${total.toFixed(2)}`
    setQrCode(mockQrData)
  }, [total])

  const handlePayment = async () => {
    setPaymentStatus("processing")

    setTimeout(async () => {
      // Simulate payment processing, mock success/failure
      const success = Math.random() > 0.1
      if (success) {
        try {
          await createTransaction()
          setPaymentStatus("success")
          clearCart()
          setTimeout(() => {
            onComplete()
          }, 2000)
        } catch (e) {
          setPaymentStatus("failed")
        }
      } else {
        setPaymentStatus("failed")
      }
    }, 2000)
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "waiting":
        return "Scan the QR code to pay"
      case "processing":
        return "Processing payment..."
      case "success":
        return "Payment successful!"
      case "failed":
        return "Payment failed. Please try again."
      default:
        return ""
    }
  }

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "waiting":
        return "text-blue-600"
      case "processing":
        return "text-yellow-600"
      case "success":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          <p className="text-gray-600">Total Amount</p>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            {paymentStatus === "waiting" ? (
              <div className="text-center">
                <div className="w-48 h-48 bg-white border border-gray-300 flex items-center justify-center mb-2">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">QRIS Code</p>
              </div>
            ) : paymentStatus === "processing" ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-sm text-gray-600">Processing...</p>
              </div>
            ) : paymentStatus === "success" ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-green-600">Success!</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm text-red-600">Failed</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className={`font-medium ${getStatusColor()}`}>{getStatusMessage()}</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={paymentStatus === "processing"}
            className="flex-1 bg-transparent"
          >
            Back
          </Button>
          {paymentStatus === "waiting" && (
            <Button onClick={handlePayment} className="flex-1">
              Pay with QRIS
            </Button>
          )}
          {paymentStatus === "failed" && (
            <Button onClick={() => setPaymentStatus("waiting")} className="flex-1">
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
