"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Product {
  name: string
  price: number
  stock: number
  category: string
}

interface ProductConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  product: Product
  isEdit: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ProductConfirmationDialog({
  open,
  onOpenChange,
  title,
  product,
  isEdit,
  onConfirm,
  onCancel,
}: ProductConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {isEdit ? "Please review the updated product information:" : "Please review the new product details:"}
              </p>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-900">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="text-gray-900 font-semibold">Rp{product.price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Stock:</span>
                  <span className="text-gray-900">{product.stock} units</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                {isEdit ? "Do you want to save these changes?" : "Do you want to add this product to your catalog?"}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-rose-600 hover:bg-rose-700">
            {isEdit ? "Update Product" : "Add Product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
