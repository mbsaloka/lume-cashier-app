"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductConfirmationDialog } from "./product-confirmation-dialog"

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  category: string
}

interface ProductFormProps {
  product?: Product | null
  onSubmit: (product: Omit<Product, "_id">) => void
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  })

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<Omit<Product, "_id"> | null>(null)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
      })
    }
  }, [product])

  const validateForm = () => {
    const errors = []

    if (!formData.name.trim()) errors.push("Product name is required")
    if (!formData.category) errors.push("Category is required")
    if (!formData.price || Number.parseFloat(formData.price) <= 0) errors.push("Valid price is required")
    if (!formData.stock || Number.parseInt(formData.stock) < 0) errors.push("Valid stock quantity is required")

    return errors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm()
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
      return
    }

    const productData = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      category: formData.category,
    }

    // Store the form data and show confirmation dialog
    setPendingFormData(productData)
    setShowConfirmDialog(true)
  }

  const confirmSubmit = async () => {
    if (!pendingFormData) return

    try {
      const response = await fetch(`
        ${API_BASE_URL}/api/products${product ? `/${product._id}` : ""}`, {
        method: product ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          product
            ? { ...pendingFormData, _id: product._id }
            : pendingFormData
        ),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit product")
      }

      onSubmit(pendingFormData)
      setShowConfirmDialog(false)
      setPendingFormData(null)
    } catch (error) {
      console.error("Error submitting product:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Keychain">Keychain</SelectItem>
                  <SelectItem value="DIY">DIY</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rp)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
          </div>
        </form>
      </CardContent>
      {pendingFormData && (
        <ProductConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          title={product ? "Confirm Product Update" : "Confirm New Product"}
          product={pendingFormData}
          isEdit={!!product}
          onConfirm={confirmSubmit}
          onCancel={() => {
            setShowConfirmDialog(false)
            setPendingFormData(null)
          }}
        />
      )}
    </Card>
  )
}
