"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search } from "lucide-react"

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

export function TransactionHistory() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [totalRevenue, setTotalRevenue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

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

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`)
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setTotalRevenue(data.totalSales)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchRevenue()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    const idMatch = (transaction._id || "").toLowerCase().includes(searchTerm.toLowerCase())
    const itemsMatch = transaction.items?.some(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return idMatch || itemsMatch
  })

  const handleExportCSV = () => {
    const stringifyItems = (items: TransactionItem[]) => {
      return items.map(item => `${item.quantity}x ${item.name} (${item.price.toLocaleString("id-ID")})`).join("; ")
    }

    const csvContent = [
      ["Transaction ID", "Date", "Items", "Total", "Payment Method"],
      ...filteredTransactions.map((t) => [t._id, formatDateWIB(t.createdAt), stringifyItems(t.items), t.total.toString(), t.method]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              Rp{totalRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Transaction History</CardTitle>
            <Button onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell style={{ maxWidth: "150px" }} className="font-medium w-4 truncate">{transaction._id}</TableCell>
                    <TableCell>{formatDateWIB(transaction.createdAt)}</TableCell>
                    <TableCell>
                      {transaction.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                    </TableCell>
                    <TableCell>Rp{transaction.total.toLocaleString("id-ID")}</TableCell>
                    <TableCell>{transaction.method.toLocaleUpperCase()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">Tidak ada transaksi yang cocok.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
