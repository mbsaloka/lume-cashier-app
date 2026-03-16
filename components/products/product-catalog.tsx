"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductTable } from "./product-table"
import { ProductForm } from "./product-form"
import { Plus, Search } from "lucide-react"
import { ConfirmDialog } from "./confirm-dialog"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  category: string
}

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, []);

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    type: "edit" | "delete"
    product: Product | null
    title: string
    message: string
  }>({
    open: false,
    type: "edit",
    product: null,
    title: "",
    message: "",
  })

  const { toast } = useToast()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = (productData: Omit<Product, "_id">) => {
    const newProduct = {
      ...productData,
      _id: Date.now().toString(),
    }
    setProducts((prev) => [...prev, newProduct])
    setShowForm(false)

    toast({
      title: "Product Added",
      description: `"${productData.name}" has been added to your catalog.`,
    })
  }

  const handleEditProduct = (productData: Omit<Product, "_id">) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? { ...productData, _id: editingProduct._id } : p)),
      )
      setEditingProduct(null)
      setShowForm(false)

      toast({
        title: "Product Updated",
        description: `"${productData.name}" has been updated successfully.`,
      })
    }
  }

  const handleDeleteProduct = (product: Product) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      product,
      title: "Delete Product",
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    })
  }

  const confirmDeleteProduct = async () => {
    if (!confirmDialog.product) return

    const productId = confirmDialog.product._id
    const productName = confirmDialog.product.name

    try {
      setDeleteLoading(productId)
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete product")
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId))

      setConfirmDialog({ ...confirmDialog, open: false })

      toast({
        title: "Product Deleted",
        description: `"${productName}" has been removed from your catalog.`,
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Delete Failed",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const openEditForm = (product: Product) => {
    setConfirmDialog({
      open: true,
      type: "edit",
      product,
      title: "Edit Product",
      message: `Do you want to edit "${product.name}"?`,
    })
  }

  const confirmEditProduct = () => {
    if (confirmDialog.product) {
      setEditingProduct(confirmDialog.product)
      setShowForm(true)
      setConfirmDialog({ ...confirmDialog, open: false })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Products</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600" />
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ProductTable products={filteredProducts} onEdit={openEditForm} onDelete={handleDeleteProduct} />
              {deleteLoading && (
                <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600" />
                  Deleting product...
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.type === "delete" ? confirmDeleteProduct : confirmEditProduct}
        confirmText={confirmDialog.type === "delete" ? "Delete" : "Edit"}
        variant={confirmDialog.type === "delete" ? "destructive" : "default"}
      />
    </div>
  )
}
