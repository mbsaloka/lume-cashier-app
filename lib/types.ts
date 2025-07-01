export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Transaction {
  id: string
  date: string
  items: string
  total: number
  status: "PAID" | "PENDING" | "FAILED"
  paymentMethod: string
}

export interface User {
  id: string
  email: string
  name: string
}
