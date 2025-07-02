"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/components/providers/cart-provider"
import { Minus, Plus, Trash2, Edit } from "lucide-react"

interface CartSummaryProps {
  onProceed: (method: "qris" | "cash" | "transfer") => void
  showEdit?: boolean
  onEdit?: () => void
  currentStep?: string
  setMethod: (method: "qris" | "cash" | "transfer") => void
  method: string
}

export function CartSummary({ onProceed, showEdit, onEdit, currentStep, setMethod, method }: CartSummaryProps) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cart Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Cart Summary</CardTitle>
          {showEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-500">Rp{item.product.price.toLocaleString("id-ID")} each</p>
              </div>

              {!showEdit && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeItem(item.product._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {showEdit && (
                <div className="text-right">
                  <p className="font-medium">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Rp{(item.product.price * item.quantity).toLocaleString("id-ID")}</p>
                </div>
              )}
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>Rp{total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Payment Method</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qris">QRIS</SelectItem>
                <SelectItem value="transfer">Bank Transfer/E-Wallet</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={currentStep == "review" ? onEdit : clearCart} className="flex-1 bg-transparent">
              {currentStep == "review" ? "Back" : "Clear Cart"}
            </Button>
            <Button onClick={() => onProceed(method as "qris" | "cash" | "transfer")} className="flex-1">
              {showEdit ? "Proceed" : "Review Order"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
