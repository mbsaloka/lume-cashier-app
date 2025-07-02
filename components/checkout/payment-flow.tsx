"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/providers/cart-provider"
import { ConfirmPaymentDialog } from "./confirm-payment-dialog"
import { Check } from "lucide-react"

interface PaymentFlowProps {
  total: number
  method: "qris" | "cash" | "transfer"
  onComplete: () => void
  onBack: () => void
}

export function PaymentFlow({ total, method, onComplete, onBack }: PaymentFlowProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "processing" | "success" | "failed">("waiting")
  const [qrCode, setQrCode] = useState("")
  const { items, clearCart } = useCart()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const createTransaction = async () => {
    const payload = {
      items: items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      method,
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
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  useEffect(() => {
    if (method === "qris") {
      const mockQrData = `QRIS-${Date.now()}-${total.toFixed(2)}`
      setQrCode(mockQrData)
    }
  }, [total, method])

  const handleConfirmPayment = async () => {
    setConfirmDialogOpen(false)
    try {
      await createTransaction()
      clearCart()
      onComplete()
    } catch {
      setPaymentStatus("failed")
    }
    // setTimeout(async () => {
    //   try {
    //     await createTransaction()
    //     setPaymentStatus("success")
    //     clearCart()
    //     setTimeout(() => onComplete(), 1500)
    //   } catch {
    //     setPaymentStatus("failed")
    //   }
    // }, 1500)
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "waiting":
        return method === "cash"
          ? "Collect payment from customer"
          : method === "transfer"
            ? "Finish payment via transfer"
            : "Scan the QR code to pay"
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

  const handleConfirmClick = () => {
    setConfirmDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold">Rp{total.toLocaleString("id-ID")}</p>
            <p className="text-gray-600">Total Amount</p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-xs min-h-[12rem] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center p-4">
              {paymentStatus === "waiting" && method === "qris" && (
                <div className="text-center">
                  <div className="w-48 h-48 bg-white border border-gray-300 flex items-center justify-center mb-2">
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Mock QRIS Code</p>
                </div>
              )}

              {paymentStatus === "waiting" && method === "transfer" && (
                <div className="text-center space-y-2 text-sm">
                  <p className="text-gray-600">Transfer to:</p>
                  <p className="font-medium">BCA - 1234567890</p>
                  <p>a.n. My Account</p>
                </div>
              )}

              {paymentStatus === "waiting" && method === "cash" && (
                <p className="text-gray-600 text-sm text-center">Please collect cash payment from customer.</p>
              )}

              {paymentStatus === "processing" && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-sm text-gray-600">Processing...</p>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <p className="text-sm text-green-600">Payment success</p>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-600">Payment failed</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className={`font-medium ${getStatusColor()}`}>{getStatusMessage()}</p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onBack} disabled={paymentStatus === "processing"} className="flex-1">
              Back
            </Button>

            {paymentStatus === "waiting" && (
              <Button onClick={handleConfirmClick} className="flex-1">
                Confirm Payment
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

      <ConfirmPaymentDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        amount={total}
        method={method}
        onConfirm={handleConfirmPayment}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  )
}
