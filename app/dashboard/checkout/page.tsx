import { CheckoutFlow } from "@/components/checkout/checkout-flow"

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600">Process customer purchases.</p>
      </div>

      <CheckoutFlow />
    </div>
  )
}
