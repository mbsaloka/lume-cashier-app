import { ProductCatalog } from "@/components/products/product-catalog"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-gray-600">Manage your store's product inventory.</p>
      </div>

      <ProductCatalog />
    </div>
  )
}
