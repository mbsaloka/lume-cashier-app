"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TransactionItem {
  name: string
  quantity: number
  price: number
}

interface Transaction {
  _id: string
  createdAt: string
  items: TransactionItem[]
  total: number
  method: string
}

export function formatDateWIB(utcString: string) {
  const date = new Date(utcString)
  return date.toLocaleString("en-EN", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function RecentTransactions() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/transactions`)
        if (!response.ok) throw new Error("Failed to fetch transactions")
        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      }
    }
    fetchTransactions()
  }, [])

  const stringifyItems = (items: TransactionItem[]) => {
    return items.map(item => `${item.quantity}x ${item.name}`).join(", ")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2 sm:gap-4"
            >
              <div className="flex-1">
                <p className="font-medium break-words">{transaction._id}</p>
                <p className="text-sm text-gray-600">{formatDateWIB(transaction.createdAt)}</p>
                <p className="text-sm text-gray-500">{stringifyItems(transaction.items)}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:flex-row gap-2">
                <Badge className="bg-green-100 text-green-800">{transaction.method.toUpperCase()}</Badge>
                <p className="font-bold text-right sm:text-left">
                  Rp{transaction.total.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

  )
}
